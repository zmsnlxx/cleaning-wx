import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    list: [],
    show: false,
    floors: [],
    floor: '',
    type: '1'
  },
  onLoad({ type }) {
    const { floor } = wx.getStorageSync('user');
    this.setData({ floors: floor.split(','), type })
    wx.setNavigationBarTitle({
      title: type === '1' ? '申领记录' : '消耗记录'
    })
  },
  onShow() {
    ajax('/index/apply/list', { type: this.data.type }).then(res => {
      this.setData({ list: res.list })
    })
  },
  onConfirm(e) {
    this.setData({ floor: e.detail.value, show: false, })
    const floor = this.data.floor
    if (!floor) return Toast({ type: 'fail', message: '暂未设置楼层，请联系管理员' })
    wx.navigateTo({ url: `/pages/warehouse/warehouse?type=${this.data.type}&&floor=${floor}` })
  },
  preventTouchMove() {},
  showPopup() {
    this.setData({ show: true })
  },
  onCancel() {
    this.setData({ show: false })
  },
})
