import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    detail: {},
    show: false,
    canIApprove: false,
    autosize: { minHeight: 78 },
    type: 0,
    reason: '',
    showBtn: true
  },
  onLoad(option) {
    const detail = wx.getStorageSync('currentHolidayData')
    this.setData({ detail, canIApprove: option.type === '1', type: Number(detail.type), showBtn: [1,2].includes(detail.approval) })
  },
  withdraw() {
    ajax('/index/leave/remove', { leaveId: this.data.detail.leaveId }, 'post').then(() => {
      Toast({
        type: 'success',
        context: this,
        message: '撤回成功',
        onClose: () => {
          wx.switchTab({ url: `/pages/holiday/holiday` })
        },
      });
    })
  },
  preventTouchMove() {},
  success() {
    ajax('/index/leave/approval', { leaveId: this.data.detail.leaveId, approval: 2 }, 'post').then(() => {
      Toast({
        type: 'success',
        context: this,
        message: '通过成功',
        onClose: () => {
          wx.switchTab({ url: `/pages/holiday/holiday` })
        },
      });
    })
  },
  bindTextAreaBlur(e) {
    this.setData({ reason: e.detail.value })
  },
  goRefuse() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  refuse() {
    ajax('/index/leave/approval', { leaveId: this.data.detail.leaveId, approval: 3, reason: this.data.reason }, 'post').then(() => {
      Toast({
        type: 'success',
        context: this,
        message: '拒绝成功',
        onClose: () => {
          wx.switchTab({ url: `/pages/holiday/holiday` })
        },
      });
    })
  },
})
