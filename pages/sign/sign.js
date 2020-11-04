import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
let qqmapsdk
Page({
  data: {
    position: '',
    time: '',
    timer: null,
    user: null,
    signNum: 0,
    integral: 0,
    uploadParams: { token: '', key: '' },
    fileList: [],
    form: {
      pic: '',
      must: '',
      real: '',
      type: ''
    },
    show: { integral: false, type: false, formShow: false },
    type: '',
    columns:  [
      { text: '签到', value: 1 },
      { text: '签退', value: 2 },
    ]
  },
  onLoad() {
    const user = wx.getStorageSync('user');
    const that = this
    this.setData({ timer: setInterval(() => this.display_time(), 1000), user })
    qqmapsdk = new QQMapWX({ key: 'TKLBZ-R7TWP-APTDI-LPXM5-72XG6-5NBFM' })
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const { latitude, longitude } = res
        wx.setStorageSync('position', { latitude, longitude })

        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success: function (data) {
            that.setData({ position: data.result.address })
          },
          fail: function (error) {
            console.log(error)
          },
        })
      },
      fail() {
        Toast({
          type: 'fail',
          context: this,
          message: '获取位置信息失败，暂无法打卡',
          onClose: () => {
            wx.switchTab({ url: `/pages/index/index` })
          }
        })
      }
    })
    ajax('/index/sign/signNum').then(res => {
      this.setData({ signNum: res })
    })
  },

  onHide() {
    clearInterval(this.data.timer)
  },

  input(e) {
    const model = e.currentTarget.dataset.name
    const value = e.detail.value
    this.setData({ [`form.${model}`]: Number(value) })
  },

  uploadFile(uploadFile) {
    const that = this
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://up-z0.qiniup.com',
        filePath: uploadFile,
        header: { token: wx.getStorageSync('token') },
        formData: that.data.uploadParams,
        name: 'file',
        success: (res) => {
          const { key } = JSON.parse(res.data)
          console.log(key)
          this.setData({
            'form.pic': key
          })
          resolve({ url: `http://cdn.fledchina.com/${key}` })
        },
        fail: (err) => { reject(err) }
      });
    })
  },
  beforeRead(e) {
    const { callback } = e.detail;
    ajax('/admin/upload/token').then(res => {
      this.setData({
        'uploadParams.key': encodeURI(Date.now() + '' + Math.floor(Math.random() * 10000)),
        'uploadParams.token': res.token,
      })
      callback(true);
    })
  },

  afterRead(event) {
    wx.showLoading({ title: '上传中...' })
    const { file } = event.detail
    this.uploadFile(file[0].path).then(res => {
      this.setData({
        fileList: this.data.fileList.concat(Object.assign(res, { isImage: true })),
      })
      console.log(this.data.fileList)
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '上传失败！', icon: 'none', })
    })
  },

  deleteImg(event) {
    const delIndex = event.detail.index
    const { fileList } = this.data
    fileList.splice(delIndex, 1)
    this.setData({ fileList })
  },

  display_time() {
    const now = new Date()
    let hh = now.getHours()
    let mm = now.getMinutes()
    let ss = now.getSeconds()
    this.setData({ time: this.check(hh) + ":" + this.check(mm) + ":" + this.check(ss) })
  },
  goSign() {
    if (this.data.user.position !== 1) {
      this.setData({ 'show.formShow': true })
    } else {
      this.fetchSign()
    }
  },
  fetchSign(params = null) {
    const { latitude, longitude } = wx.getStorageSync('position');
    const { lat, lng } = this.data.user
    const distance = this.GetDistance(latitude, longitude, lat, lng)
    if ((distance * 1000) > 300) {
      Toast({ type: 'fail', context: this, message: '超出打卡距离', });
    } else {
      ajax('/index/sign/sign', params, 'post').then(integral => {
        if (integral) {
          this.setData({ integral, 'show.integral': true })
          const user = wx.getStorageSync('user');
          user.integral = user.integral + integral
          wx.setStorageSync('user', user);
        }
      })
    }
  },
  submit() {
    // 校验
    const { type, real, must, pic } = this.data.form
    if (!type) return Toast({ type: 'fail', context: this, message: '请选择考勤类型', })
    if (!real) return Toast({ type: 'fail', context: this, message: '请填写实到人数', })
    if (!must) return Toast({ type: 'fail', context: this, message: '请填写出勤人数', })
    if (!pic && this.data.user.isphoto) return Toast({ type: 'fail', context: this, message: '请上传照片', })
    this.fetchSign(this.data.form)
  },
  showClick() {
    this.setData({ 'show.type': true })
  },
  onCancel(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: false })
  },
  onFormCancel() {
    this.setData({ 'show.formShow': false })
  },
  onConfirm(e) {
    this.setData({
      type: e.detail.value.text,
      'form.type': e.detail.value.value,
      'show.type': false
    })
  },
  check(a) { return a < 10 ? '0' + a : a },
  GetDistance(lat1, lng1, lat2, lng2) {
    const radLat1 = lat1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137
    s = Math.round(s * 10000) / 10000
    return s
  },
  onClose() {
    this.setData({
      'show.integral': false,
      'show.formShow': false,
    })
    wx.switchTab({ url: '/pages/index/index' })
  }
})
