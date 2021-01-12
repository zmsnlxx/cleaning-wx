import { ajax } from '../../utils/http'

Page({
  data: {
    active: 0,
    list: [],
    form: {
      startTime: new Date().getTime() + 1000 * 60 * 60 * 24 * -7,
      endTime: new Date().getTime(),
    },
    show: { startTime: false, endTime: false },
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
  },
  onShow() {
    this.getList()
  },
  onDateConfirm(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: e.detail, [`show.${model}`]: false })
    this.getList()
  },
  preventTouchMove() {},
  showClick(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: true })
  },
  onCancel(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: false })
  },
  onChange(e) {
    const active = e.detail.name
    this.setData({ active })
    this.getList()
  },
  getList() {
    const { startTime, endTime } = this.data.form
    const result = { startTime: parseInt(startTime / 1000), endTime: parseInt(endTime / 1000) }
    const params = Object.assign({}, { type: this.data.active + 1, page: 1, pageSize: 99 }, result)
    ajax('/index/userReport/list', params).then(res => {
      this.setData({ list: res.list })
    })
  },
  addReport() {
    wx.navigateTo({ url: '/pages/add-report/add-report?type=1' })
  },
  goDetail(e) {
    const index = e.currentTarget.dataset.index
    const current = this.data.list[index]
    wx.setStorageSync('report-detail', current);
    wx.navigateTo({ url: '/pages/add-report/add-report?type=2' })
  }
})
