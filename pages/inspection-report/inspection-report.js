import * as echarts from '../../components/ec-canvas/echarts'
import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

let lineChart = null
let lineOption = {}

function setOption(xData, yData) {
  lineOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xData,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    dataZoom: [//给x轴设置滚动条
      {
        start:0,//默认为0
        end: 30,
        type: 'slider',
        show: false,
      },
      //下面这个属性是里面拖到
      {
        type: 'inside',
        show: true,
        xAxisIndex: [0],
        start: 0,//默认为1
        end: 50
      },],
    series: [
      {
        type: 'line',
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#259D8F',
            }, {
              offset: 1,
              color: '#FFF3E2',
            }]),
          },
        },
        lineStyle: {
          color: '#259D8F',
          width: 3,

        },
        itemStyle: {
          color: '#259D8F',
          borderWidth: 0,
          borderColor: '#259D8F'
        },
        data: yData,
        smooth: true,
      },
    ],
  }
}

function initLineChart(canvas, width, height, dpr) {
  lineChart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr })
  canvas.setChart(lineChart)
  lineChart.setOption(lineOption)
  return lineChart
}

Page({
  data: {
    line: {
      onInit: initLineChart,
    },
    active: 0,
    cleaningPointName: '',
    show: { startTime: false, endTime: false, cleaningPointId: false, day: false },
    form: {
      startTime: new Date().getTime() + 1000 * 60 * 60 * 24 * -7,
      endTime: new Date().getTime(),
      cleaningPointId: '',
      day: new Date().getTime()
    },
    cleaningPoints: [],
    address: { text: '', id: '' },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
    items: [
      { label: '巡检地点', id: 'cleaningPointName' },
      { label: '负责人', id: 'pername' },
      { label: '清扫时间', id: 'cleaningTime' },
      { label: '状态', id: 'finish' },
    ],
    list: [],
    maxDate: new Date().getTime()
  },
  onLoad() {
    ajax('/index/report/cleaningPointList').then(res => {
      this.setData({ cleaningPoints: res.map(item => ({ text: item.cleaningPointName, value: item.cleaningPointId })) })
    })
    this.getMonthData(this.data.form)
  },
  onChange(e) {
    const active = e.detail.name
    this.setData({ active })
    if (active) {
      this.setData({ 'form.day': new Date().getTime() })
      this.getDayData()
    } else {
      this.setData({
        'form.startTime': new Date().getTime() + 1000 * 60 * 60 * 24 * -7,
        'form.endTime': new Date().getTime(),
        'form.cleaningPointId': '',
        cleaningPointName: ''
      })
      this.getMonthData(this.data.form)
    }
  },
  showClick(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: true })
  },
  onCancel(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: false })
  },
  onDateConfirm(e) {
    const { startTime, endTime } = this.data.form
    const model = e.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: e.detail, [`show.${model}`]: false })
    if (model === 'day') {
      this.getDayData({ day: parseInt(this.data.form.day / 1000) })
    } else {
      if (this.data.form.endTime < this.data.form.startTime) {
        return  Toast({
          type: 'fail',
          context: this,
          message: '开始日期应早于结束日期,请重新选择',
          onClose: () => {
            this.setData({
              'form.startTime': startTime,
              'form.endTime': endTime,
            })
          }
        });
      }
      this.getMonthData(this.data.form)
    }
  },
  onConfirm(e) {
    const { text, value } = e.detail.value
    this.setData({ cleaningPointName: text, 'form.cleaningPointId': value, 'show.cleaningPointId': false })
    this.getMonthData(this.data.form)
  },
  getDayData(params) {
    ajax('/index/report/inspectionDaily', params).then(res => {
      this.setData({ list: res.inspectionList })
    })
  },
  getMonthData(form) {
    let params;
    if (form) {
      const { startTime, endTime, cleaningPointId } = form
      params = {
        startTime: parseInt(startTime / 1000),
        endTime: parseInt(endTime / 1000),
        cleaningPointId
      }
    }
    ajax('/index/report/inspectionMonth', params).then(res => {
      const { inspectionList } = res
      const xData = inspectionList.map(item => item.dday.slice(-5))
      const yData = inspectionList.map(item => item.cnt)
      setOption(xData, yData)
      if (lineChart) {
        lineChart.setOption(lineOption)
      }
    })
  }
})
