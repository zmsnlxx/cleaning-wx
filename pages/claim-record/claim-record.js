import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    list: [],
    user: {}
  },
  onLoad() {
    const user = wx.getStorageSync('user');
    this.setData({ user })
  },
  onShow() {
    ajax('/index/apply/list').then(res => {
      this.setData({ list: res.list })
    })
  },
  jump() {
    const floor = this.data.user.floor
    if (!floor) return Toast({ type: 'fail', message: '暂未设置楼层，请联系管理员' })
    wx.navigateTo({ url: `/pages/warehouse/warehouse?type=2&&floor=${floor}` })
  }
})
