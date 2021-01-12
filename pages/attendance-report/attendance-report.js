import { ajax } from '../../utils/http'

Page({
  data: {
    list: [],
    form: {
      startTime: new Date().getTime(),
      orgid: '',
    },
    token: '',
    org: [],
    maxDate: new Date().getTime(),
    show: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
  },
  change(e) {
    this.setData({ 'form.orgid': e.detail })
    this.getList()
  },
  onLoad() {
    const token = wx.getStorageSync('other-token');
    const org = wx.getStorageSync('org');
    this.setData({ token, org: org.map(item => ({ text: item.orgname, value: item.orgid })), 'form.orgid': org[0].orgid })
    this.getList()
  },
  onUnload() {
    wx.removeStorageSync('other-token')
    wx.removeStorageSync('org')
  },
  getList() {
    const params = Object.assign({}, this.data.form, { startTime: parseInt(this.data.form.startTime / 1000) })
    ajax('/index/admin/signReport', params, 'get', this.data.token).then(res => {
      this.setData({ list: res })
    })
  },
  showClick() {
    this.setData({ show: true })
  },
  onCancel() {
    this.setData({ show: false })
  },
  onDateConfirm(e) {
    this.setData({ 'form.startTime': e.detail, show: false })
    this.getList()
  },
  preventTouchMove() {},
})
