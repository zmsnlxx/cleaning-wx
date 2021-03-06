import { ajax } from '../../utils/http'

Page({
  data: {
    items: [
      { label: '巡检地点', id: 'cleaningPointName' },
      { label: '负责人', id: 'pername' },
      { label: '清扫时间', id: 'cleaningTime' },
      { label: '状态', id: 'finish' },
    ],
    list: [],
  },
  onLoad(options) {
    ajax('/index/report/cleaningToday', { cleaningPointId: options.cleaningPointId }).then(res => {
      this.setData({ list: res })
    })
  },
  onShow() {
    wx.hideHomeButton()
  },
})
