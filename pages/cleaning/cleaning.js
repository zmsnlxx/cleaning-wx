import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    user: null,
    isCleaning: true,
    detail: null,
    timer: null,
    time: '',
    columns:  [
      { text: '完成', value: 1 },
      { text: '异常', value: 2 },
    ],
    cleaningPointId: '',
    form: {
      finish: 1,
      cleaningPointId: '',
      cleaningId: '',
      star: '',
      attach: '',
      remark: ''
    },
    integral: 0,
    show: { type: false, integral: false },
    finish: '',
    fileList: [],
    uploadParams: { token: '', key: '' }
  },
  onLoad: function (options) {
    console.log(options)
    const user = wx.getStorageSync('user')
    this.setData({
      cleaningPointId: options.cleaningPointId || '5',
      user,
      isCleaning: user.position === 1,
      timer: user.position === 1 ? null : setInterval(() => this.display_time(), 1000)
    })
    wx.setNavigationBarTitle({
      title: user.position === 1 ? '打点' : '巡检'
    })
    const api = this.data.isCleaning ? '/index/cleaning/signNum' : '/index/cleaningCheck/info'
    ajax(api, { cleaningPointId: '5' }).then(res => {
      console.log(res)
      this.setData({ detail: res })
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
  showClick() {
    this.setData({ 'show.type': true })
  },
  onCancel(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: false })
  },
  onConfirm(e) {
    this.setData({
      finish: e.detail.value.text,
      'form.finish': e.detail.value.value,
      'show.type': false
    })
  },
  onChange(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: e.detail })
  },
  sign() {
    ajax('/index/cleaning/sign', { cleaningPointId: this.data.form.cleaningPointId }, 'post').then(() => {
      Toast({
        type: 'success',
        context: this,
        message: '打点成功',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/indeex` })
        }
      });
    })
  },
  submit() {
    console.log(this.data.form)
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
          this.setData({
            'form.attach': key
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
})
