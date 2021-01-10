import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    list: [],
    show: false,
    floor: '',
  },
  onLoad() {
    ajax('/index/apply/list').then(res => {
      console.log(res.list)
      this.setData({ list: res.list })
    })
  },
  showPopup() {
    this.setData({ show: true })
  },
  jump() {
    if (!this.data.floor) return Toast({ type: 'fail', message: '请输入楼层' })
    wx.navigateTo({ url: `/pages/warehouse/warehouse?floor=${this.data.floor}` })
    this.setData({ show: false, floor: '' })
  },
  onClose() {
    this.setData({ show: false, floor: '' })
  },
  input(e) {
    this.setData({ floor: e.detail.value })
  }
})
