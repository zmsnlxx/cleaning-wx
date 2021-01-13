import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    list: [],
    show: false,
    floors: [],
    floor: ''
  },
  onLoad() {
    const { floor } = wx.getStorageSync('user');
    this.setData({ floors: floor.split(',') })
  },
  onShow() {
    ajax('/index/apply/list').then(res => {
      this.setData({ list: res.list })
    })
  },
  onConfirm(e) {
    this.setData({ floor: e.detail.value, show: false, })
    const floor = this.data.floor
    if (!floor) return Toast({ type: 'fail', message: '暂未设置楼层，请联系管理员' })
    wx.navigateTo({ url: `/pages/warehouse/warehouse?type=2&&floor=${floor}` })
  },
  preventTouchMove() {},
  showPopup() {
    this.setData({ show: true })
  },
  onCancel() {
    this.setData({ show: false })
  },
})
