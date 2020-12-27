import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    params: { password: '', phone: '' },
  },
  onHide() {
    this.setData({ params: { password: '', phone: '' } })
  },
  login() {
    if (!this.data.params.phone) return Toast.fail('请输入账号！')
    if (!this.data.params.password) return Toast.fail('请输入密码！')
    wx.navigateTo({ url: '/pages/attendance-report/attendance-report' })
  },
  onChange(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`params.${model}`]: e.detail })
  },
})
