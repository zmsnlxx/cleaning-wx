import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    movies: [
      { url: 'http://cdn.fledchina.com/16043787618324122' },
      { url: 'http://cdn.fledchina.com/16043787977298234' },
      { url: 'http://cdn.fledchina.com/16043788141238310' },
      { url: 'http://cdn.fledchina.com/16043788312227162' },
    ],
    videos: [],
  },
  onShow() {
    ajax('/index/video/list', { page: 1, pageSize: 4 }).then(res => {
      this.setData({ videos: res.list })
    })
  },
  jumpVideoList() {
    wx.navigateTo({ url: '/pages/videoList/videoList' })
  },
  goSign() {
    wx.navigateTo({ url: '/pages/sign/sign' })
  },
  scanCode(e) {
    const type = e.currentTarget.dataset.type
    const user = wx.getStorageSync('user');
    const position = user.position.split(',')
    if (!position.includes(type)) {
      return Toast({ type: 'fail', context: this, message: '暂无权限，请联系管理员！' })
    }
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (!position.includes('2') && res.path.indexOf('inspection') !== -1) {
          return Toast({ type: 'fail', context: this, message: '暂无权限，请联系管理员！' })
        }
        if (!position.includes('1') && res.path.indexOf('clean') !== -1) {
          return Toast({ type: 'fail', context: this, message: '暂无权限，请联系管理员！' })
        }
        wx.navigateTo({ url: `/${res.path}` })
      },
      fail() {
        Toast({ type: 'fail', context: this, message: '扫码失败' })
      }
    })
  },
  goReport() {
    const user = wx.getStorageSync('user');
    const position = user.position.split(',')
    if (!position.includes('2')) return Toast({ type: 'fail', context: this, message: '暂无权限，请联系管理员！' })
    wx.navigateTo({ url: '/pages/report/report' })
  }
})
