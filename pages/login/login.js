import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import { ajax } from '../../utils/http'

Page({
  data: {
    params: { pwd: '', phone: '' },
  },
  onHide() {
    this.setData({ params: { pwd: '', phone: '' } })
  },
  login() {
    if (!this.data.params.phone) return Toast.fail('请输入账号！')
    if (!this.data.params.pwd) return Toast.fail('请输入密码！')
    ajax('/index/admin/login', this.data.params, 'post').then(res => {
      wx.setStorageSync('other-token', res.token);
      wx.setStorageSync('org', res.org);
      wx.navigateTo({ url: '/pages/attendance-report/attendance-report' })
    })
  },
  onChange(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`params.${model}`]: e.detail })
  },
})
