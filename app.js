App({
  onLaunch: function () {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.switchTab({ url: '/pages/authorization/authorization' })
    }
  }
})
