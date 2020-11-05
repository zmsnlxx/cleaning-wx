import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    openid: '',
  },
  onLoad() {
    // 登录
    this.wxlogin()
  },
  refuse() {
    Toast({ type: 'fail', context: this, message: '该小程序为团队内部使用，未加入团队时暂无法使用！' })
  },
  wxlogin(){
    const that = this
    wx.login({
      success: res => {
        ajax('/index/login/wx', { code: res.code }).then(res => {
          that.setData({ openid: res.openid });
        })
      }
    })
  },
  getPhoneNumber(e) {
    const that = this;
    const { encryptedData, iv } = e.detail
    const openid = this.data.openid
    wx.checkSession({
      success: function() {
        if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
          console.log('拒绝授权')
        } else {
          ajax('/index/login/login', { encryptedData, iv, openid }, 'post').then(res => {
            if (res) {
              wx.setStorageSync('token', res.token);
              wx.setStorageSync('user', res);
              const currentUrl = wx.getStorageSync('currentUrl');
              if (currentUrl) {
                wx.navigateTo({ url: currentUrl })
              } else {
                wx.switchTab({ url: '/pages/index/index' })
              }
            } else {
              const cleaningPointId = wx.getStorageSync('cleaningPointId');
              if (cleaningPointId) {
                wx.redirectTo({ url: `/pages/clean-detail/clean-detail?cleaningPointId=${cleaningPointId}` })
              } else {
                Toast({ type: 'fail', context: this, message: '暂无访问权限，请联系管理员！' })
              }
            }
          })
        }
      },
      fail: function() {
        console.log("session_key 已经失效，需要重新执行登录流程");
        that.wxlogin(); //重新登录
      }
    });
  },

})
