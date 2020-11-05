import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    show: false,
    user: '',
    list: [],
    currentData: {}
  },
  onShow() {
    const user = wx.getStorageSync('user');
    this.setData({ user })
  },
  onLoad() {
    ajax('/index/goods/list', { page: 1, pageSize: 99 }).then(res => {
      this.setData({ list: res.list })
    })
  },
  preventTouchMove() {},
  submit(e) {
    this.setData({ show: true, currentData: e.currentTarget.dataset.row })
  },
  onClose() {
    this.setData({ show: false })
  },
  confirm() {
    ajax('/index/goods/exchange', { goodsId: this.data.currentData.goodsId }, 'post').then(() => {
      const integral = this.data.user.integral - this.data.currentData.exchangeIntegral
      this.setData({ show: false, 'user.integral': integral })
      const user = wx.getStorageSync('user');
      user.integral = integral
      wx.setStorageSync('user', user);
      Toast({ type: 'success', context: this, message: '兑换成功！' })
    }).catch(() => {
      this.setData({ show: false })
    })
  },
  jumpMallDetail(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({ url: `/pages/mallDetail/mallDetail?type=${type}` })
  }
})
