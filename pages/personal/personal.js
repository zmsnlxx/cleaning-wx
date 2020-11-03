Page({
  data: {
    user: {},
    avatarUrl: ''
  },
  onLoad: function () {
    const user = wx.getStorageSync('user');
    this.setData({ user })
  },
  onShow() {
    const avatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({ avatarUrl })
  },
  logout() {
    wx.clearStorage()
    wx.switchTab({ url: `/pages/authorization/authorization` })
  }
})
