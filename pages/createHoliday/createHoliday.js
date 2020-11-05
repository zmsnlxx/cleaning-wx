import { formatTime } from '../../utils/util'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import { ajax } from '../../utils/http'

Page({
  data: {
    columns: [
      { text: '事假', value: '1' },
      { text: '年假', value: '2' },
    ],
    show: {
      type: false,
      startDay: false,
      startHour: false,
      endDay: false,
      endHour: false,
      switch: false,
    },
    minDate: new Date().getTime(),
    form: {
      type: '',
      startDay: '',
      startHour: '',
      endDay: '',
      endHour: '',
      remark: '',
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
  },
  preventTouchMove() {},
  showClick(e) {
    const value = e.currentTarget.dataset.name
    this.setData({ [`show.${value}`]: true, 'show.switch': true })
  },
  onCancel() {
    Object.keys(this.data.show).forEach(key => {
      this.setData({ [`show.${key}`]: false })
    })
  },

  getRemark(e) {
    this.setData({ 'form.remark': e.detail.value })
  },

  onConfirm(e) {
    const model = e.currentTarget.dataset.name
    const value = model === 'type' ? e.detail.value.text : e.detail
    this.setData({ [`form.${model}`]: value })
    this.onCancel()
  },
  submit() {
    const { startDay, endDay, type, startHour, endHour, remark } = this.data.form
    if (!startDay) return Toast({ type: 'fail', context: this, message: '请选择开始日期' })
    if (!endDay) return Toast({ type: 'fail', context: this, message: '请选择结束日期' })
    if (!startHour) return Toast({ type: 'fail', context: this, message: '请选择开始时间' })
    if (!endHour) return Toast({ type: 'fail', context: this, message: '请选择结束时间' })
    if (!type) return Toast({ type: 'fail', context: this, message: '请选择请假类型' })
    if (!remark) return Toast({ type: 'fail', context: this, message: '请输入请假原因' })
    if (startDay > endDay) return Toast({ type: 'fail', context: this, message: '结束时间早于开始时间，请重新选择!' })
    const startHourNum = Number(startHour.split(':')[0])
    const endHourNum = Number(endHour.split(':')[0])
    // 同一天
    if (startDay === endDay) {
      if (startHourNum === endHourNum) return Toast({ type: 'fail', context: this, message: '请假时间最少一小时!' })
      if (startHourNum > endHourNum) return Toast({ type: 'fail', context: this, message: '结束时间早于开始时间，请重新选择!' })
    }
    const typeCode = this.data.columns.find(item => item.text === type).value
    const params = Object.assign({}, this.data.form, { startDay: formatTime(new Date(startDay)), endDay: formatTime(new Date(endDay)), type: typeCode })
    ajax('/index/leave/submit', params, 'post').then(() => {
      Toast({
        type: 'success', context: this, message: '提交成功', onClose: () => {
          wx.switchTab({ url: `/pages/holiday/holiday` })
        },
      })
    })
  },
  cancel() {
    wx.switchTab({ url: `/pages/holiday/holiday` })
  },
})
