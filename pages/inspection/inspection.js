import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    detail: null,
    columns:  [
      { text: '完成', value: 1 },
      { text: '异常', value: 2 },
    ],
    finish: '',
    show: { type: false },
    form: {
      finish: '',
      cleaningPointId: '',
      cleaningId: '',
      star: 0,
      attach: '',
      remark: ''
    },
    canISubmit: true,
    fileList: [],
    uploadParams: { token: '', key: '' }
  },
  onLoad(options) {
    console.log(options.cleaningPointId)
    const token = wx.getStorageSync('token');
    const user = wx.getStorageSync('user')
    // 未登录
    if (!token) {
      const currentUrl = `/pages/inspection/inspection?cleaningPointId=${options.cleaningPointId}`
      wx.setStorageSync('currentUrl', currentUrl);
      wx.setStorageSync('cleaningPointId', options.cleaningPointId);
      wx.switchTab({ url: '/pages/authorization/authorization' })
      return
    }

    let position
    if (user && user.position) {
      position = user.position.split(',')
    }
    // 没权限
    if (!position.includes('2')) {
      Toast({
        type: 'fail',
        context: this,
        message: '暂无巡检权限，请联系管理员！',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/index` })
        }
      });
    }
    if (options && options.cleaningPointId) {
      ajax('/index/cleaningCheck/info', { cleaningPointId: options.cleaningPointId }).then(detail => {
        console.log(detail)
        this.setData({ detail, 'form.cleaningPointId': options.cleaningPointId, 'form.cleaningId': detail.cleaningId, canISubmit: !!detail.pername })
        if (!detail.pername) {
          Toast({
            type: 'fail',
            context: this,
            message: '当前位置暂无人打点！',
            onClose: () => {
              wx.switchTab({ url: `/pages/index/index` })
            }
          });
        }
      })
    } else {
      Toast({
        type: 'fail',
        context: this,
        message: '获取巡检位置信息失败，请重新扫码！',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/index` })
        }
      });
    }
  },
  onChange(event) {
    const model = event.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: event.detail });
  },

  showClick() {
    this.setData({ 'show.type': true })
  },
  onCancel() {
    this.setData({ 'show.type': false })
  },
  onConfirm(e) {
    this.setData({
      finish: e.detail.value.text,
      'form.finish': e.detail.value.value,
      'show.type': false
    })
  },
  submit() {
    const { finish, attach, remark } = this.data.form
    console.log(this.data.form)
    if (!finish) return Toast({ type: 'fail', context: this, message: '请选择完成状态!' });
    if (!attach) return Toast({ type: 'fail', context: this, message: '请上传附件!' });
    if (!remark) return Toast({ type: 'fail', context: this, message: '请填写备注!' });
    ajax('/index/cleaningCheck/submit', this.data.form, 'post').then(() => {
      Toast({
        type: 'success',
        context: this,
        message: '提交成功',
        onClose: () => {
          wx.switchTab({ url: `/pages/index/index` })
        }
      });
    })
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
