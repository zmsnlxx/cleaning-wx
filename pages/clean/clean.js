import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    time: '',
    timer: null,
    cleaningPointId: null,
    detail: null
  },
  onLoad(options) {
    console.log(options)
    const token = wx.getStorageSync('token');
    const user = wx.getStorageSync('user')
    const position = user.position.split(',')
    if (!token) {
      const currentUrl = `/pages/clean/clean?cleaningPointId=${options.cleaningPointId}`
      wx.setStorageSync('currentUrl', currentUrl);
      wx.setStorageSync('cleaningPointId', options.cleaningPointId);
      wx.switchTab({ url: '/pages/authorization/authorization' })
      return
    }
    // 没权限
    if (!position.includes('1')) {
      Toast({
        type: 'fail',
        context: this,
        message: '暂无打点权限，请联系管理员！',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/index` })
        }
      });
    }
    if (options && options.cleaningPointId) {
      this.setData({
        cleaningPointId: options.cleaningPointId,
        timer: setInterval(() => this.display_time(), 1000)
      })
      ajax('/index/cleaning/signNum', { cleaningPointId: options.cleaningPointId }).then(detail => {
        console.log(detail)
        this.setData({ detail })
      })
    } else {
      Toast({
        type: 'fail',
        context: this,
        message: '获取打点位置信息失败，请重新扫码！',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/index` })
        }
      });
    }
  },

  sign() {
    ajax('/index/cleaning/sign', { cleaningPointId: this.data.cleaningPointId }, 'post').then(() => {
      Toast({
        type: 'success',
        context: this,
        message: '打点成功',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/index` })
        }
      });
    })
  },

  onHide() {
    clearInterval(this.data.timer)
  },

  display_time() {
    const now = new Date()
    let hh = now.getHours()
    let mm = now.getMinutes()
    let ss = now.getSeconds()
    this.setData({ time: this.check(hh) + ":" + this.check(mm) + ":" + this.check(ss) })
  },
  check(a) {
    if (a < 10) return "0"+ a;
    return a;
  },
})
