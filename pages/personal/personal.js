Page({
  data: {
    user: {},
    avatarUrl: '',
    labels: [],
  },
  onLoad: function () {
    const user = wx.getStorageSync('user');
    const labels = [
      { label: '周报月报', path: '/pages/my-report/my-report', show: user.position === '3' },
      { label: '仓库管理', path: '/pages/warehouse/warehouse', show: user.position === '3' },
      { label: '申领用品', path: '/pages/claim-record/claim-record', show: user.position !== '3' },
    ].filter(item => item.show)
    this.setData({ user, labels })
  },
  onShow() {
    const avatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({ avatarUrl })
  },
  logout() {
    wx.clearStorage()
    wx.switchTab({ url: `/pages/authorization/authorization` })
  },
  login() {
    wx.navigateTo({ url: '/pages/login/login' })
  },
  jump(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.path })
  }
})
