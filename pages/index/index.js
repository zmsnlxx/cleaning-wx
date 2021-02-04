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
    position: null,
    user: {}
  },
  onLoad() {
    const user = wx.getStorageSync('user');
    let total = 0
    user.position.split(',').forEach(item => {
      total += Number(item)
    })
    this.setData({ position: total, user })
  },
  onShow() {
    const token = wx.getStorageSync('token')
    if (!token) {
      Toast({ type: 'fail', context: this, message: '暂未登录，请登录后访问！', onClose: () => {
        wx.switchTab({ url: '/pages/authorization/authorization' })
      } })
    } else {
      ajax('/index/video/list', { page: 1, pageSize: 4 }).then(res => {
        this.setData({ videos: res.list })
      })
    }
  },
  jumpVideoList() {
    wx.navigateTo({ url: '/pages/videoList/videoList' })
  },
  goSign() {
    wx.navigateTo({ url: '/pages/sign/sign' })
  },
  scanCode(e) {
    const type = e.currentTarget.dataset.type
    const { position } = this.data.user
    if (type === 'inspection') {
      if (this.data.position <= 1) return Toast.fail('暂无权限，请联系管理员！')
    } else {
      if (!position.split(',').includes('1')) return Toast.fail('暂无权限，请联系管理员！')
    }
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (this.data.position <= 1 && res.path.indexOf('inspection') !== -1) {
          return Toast({ type: 'fail', context: this, message: '暂无权限，请联系管理员！' })
        }
        if (!position.split(',').includes('1') && res.path.indexOf('clean') !== -1) {
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
    if (this.data.position <= 1) return Toast({ type: 'fail', context: this, message: '暂无权限，请联系管理员！' })
    wx.navigateTo({ url: '/pages/report/report' })
  },
  jump(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({ url: `/pages/claim-record/claim-record?type=${type}` })
  }
})
