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
      { label: '仓库管理', path: '/pages/warehouse/warehouse?type=0', show: user.position === '3' },
      { label: '申领用品', path: '/pages/claim-record/claim-record?type=1', show: true },
      { label: '消耗报备', path: '/pages/claim-record/claim-record?type=2', show: true },
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
