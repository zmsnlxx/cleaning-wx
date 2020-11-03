import { ajax } from '../../utils/http'

Page({
  data: {
    openid: '',
  },
  onLoad() {
    // 登录
    this.wxlogin()
  },
  wxlogin(){
    const that = this
    wx.login({
      success: res => {
        ajax('/index/login/wx', { code: res.code }).then(res => {
          console.log(res)
          that.setData({ openid: res.openid });
        })
      }
    })
  },
  getPhoneNumber(e) {
    console.log(e)
    const that = this;
    const { encryptedData, iv } = e.detail
    const openid = this.data.openid
    wx.checkSession({
      success: function() {
        if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
          console.log('拒绝授权')
        } else {
          ajax('/index/login/login', { encryptedData, iv, openid }, 'post').then(res => {
            wx.setStorageSync('token', res.token);
            wx.setStorageSync('user', res);
            const currentUrl = wx.getStorageSync('currentUrl');
            if (currentUrl) {
              wx.navigateTo({ url: currentUrl })
            } else {
              wx.switchTab({ url: '/pages/index/index' })
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
