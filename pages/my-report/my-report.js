import { ajax } from '../../utils/http'

Page({
  data: {
    active: 0,
    list: [],
  },
  onLoad() {
    this.getList()
  },
  onChange(e) {
    const active = e.detail.name
    this.setData({ active })
    this.getList()
  },
  getList() {
    ajax('/index/userReport/list', { type: this.data.active + 1, page: 1, pageSize: 99 }).then(res => {
      this.setData({ list: res.list })
    })
  },
  addReport() {
    wx.navigateTo({ url: '/pages/add-report/add-report' })
  },
  goDetail(e) {
    const index = e.currentTarget.dataset.index
    const current = this.data.list[index]
    wx.setStorageSync('report-detail', current);
    wx.navigateTo({ url: '/pages/report-detail/report-detail' })
  }
})
