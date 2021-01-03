import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import { ajax } from '../../utils/http'

Page({
  data: {
    form: { type: '', title: '', content: '' },
    type: '请选择报表类型',
    show: false,
    types: [ { text: '周报', value: 1 }, { text: '月报', value: 2 } ]
  },
  onChange(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: e.detail })
  },
  onClick() {
    this.setData({ show: true })
  },
  preventTouchMove() {},
  onCancel() {
    this.setData({ show: false })
  },
  onConfirm(e) {
    const { value, text } = e.detail.value
    this.setData({ 'form.type': value, type: text, show: false })
  },
  submit() {
    if (!this.data.form.title) return Toast.fail('请输入标题！')
    if (!this.data.form.content) return Toast.fail('请输入内容！')
    if (!this.data.form.type) return Toast.fail('请选择类型！')

    ajax('/index/userReport/report', this.data.form, 'post').then(() => {
      Toast({
        type: 'success',
        message: '提交成功!',
        onClose: () => {
          wx.navigateTo({ url: '/pages/my-report/my-report' })
        },
      });
    })
  }
})
