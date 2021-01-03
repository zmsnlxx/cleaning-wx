Page({
  data: {
    detail: {}
  },
  onLoad() {
    this.setData({ detail: wx.getStorageSync('report-detail') })
  },
  onUnload() {
    wx.removeStorageSync('report-detail')
  }
})
