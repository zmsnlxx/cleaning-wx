import { ajax } from '../../utils/http'

Page({
  data: {
    active: 0,
    list: [],
  },
  onShow() {
    const api = this.data.active === 0 ? '/index/leave/myStart' : '/index/leave/myApproval'

    ajax(api, { page: 1, pageSize: 99 }).then(res => {
      this.setData({ list: res.list })
    })
  },
  onChange(e) {
    this.setData({ active: e.detail.index, list: [] })
    const api = this.data.active === 0 ? '/index/leave/myStart' : '/index/leave/myApproval'
    ajax(api, { page: 1, pageSize: 99 }).then(res => {
      this.setData({ list: res.list })
    })
  },
  jumpDetail(e) {
    wx.setStorageSync('currentHolidayData', e.currentTarget.dataset.row);
    wx.navigateTo({ url: `/pages/holidayDetail/holidayDetail?type=${this.data.active}` })
  },
  goCreatdHoliday() {
    wx.navigateTo({ url: '/pages/createHoliday/createHoliday' })
  }
})
