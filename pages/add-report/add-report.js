import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import { ajax } from '../../utils/http'

Page({
  data: {
    type: '请选择报表类型',
    show: false,
    types: [{ text: '周报', value: 1 }, { text: '月报', value: 2 }],
    params: [],
    paramsType: '',
    isDetail: false,
    detail: {},
    dialog: false,
    user: {},
  },
  onLoad(option) {
    const { type } = option
    const user = wx.getStorageSync('user')
    this.setData({ user })
    wx.setNavigationBarTitle({
      title: type === '1' ? '新增报表' : '报表详情'
    })
    if (type === '1') {
      this.checkParams(1)
    } else {
      const { content, type } = wx.getStorageSync('report-detail');
      this.setData({ isDetail: true, params: content, type: type === 1 ? '周报' : '月报' })
    }
  },
  checkParams(type) {
    let params = []
    if (this.data.params.length) {
      params = this.data.params
      params.forEach((item,index) => {
        item.label = index === 0 ? type === 1 ? '本周工作' : '本月工作' : type === 1 ? '下周工作' : '下月工作'
      })
    } else {
      params = [
        { label: type === 1 ? '本周工作' : '本月工作', next: false, list: [{ title: '', content: '' }], summary: '' },
        { label: type === 1 ? '下周工作' : '下月工作', next: true, list: [{ title: '', content: '' }], summary: '' },
      ]
    }
    this.setData({ params })
  },
  changeSummary(e) {
    const { index } = e.currentTarget.dataset
    const params = this.data.params
    params[index].summary = e.detail.value
    this.setData({ params })
  },
  change(e) {
    const { index, id, name } = e.currentTarget.dataset
    const params = this.data.params
    params[index].list[id][name] = e.detail.value
    this.setData({ params })
  },
  add(e) {
    const { index } = e.currentTarget.dataset
    const params = this.data.params
    params[index].list.push({ title: '', content: '' })
    this.setData({ params })
  },
  clear(e) {
    const { id, index } = e.currentTarget.dataset
    const params = this.data.params
    params[index].list.splice(id, 1)
    this.setData({ params })
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
    this.setData({ paramsType: value, type: text, show: false })
    this.checkParams(Number(value))
  },
  submit() {
    const [one, two] = this.data.params
    const { weekReport, monthReport } = this.data.user
    if (!one.list[0].title || !one.list[0].content) return Toast.fail(`请至少填写一条${one.label}内容`)
    if (!two.list[0].title || !two.list[0].content) return Toast.fail(`请至少填写一条${two.label}内容`)
    if (!one.summary) return Toast.fail(`请填写${one.label}工作总结`)
    if (!two.summary) return Toast.fail(`请填写${two.label.slice(0,2)}需协调工作`)
    if (!this.data.paramsType) return Toast.fail('请选择类型！')
    if (this.data.paramsType === 1) {
      if (weekReport) {
        this.setData({ dialog: true })
      } else {
        this.publish()
      }
    } else {
      if (monthReport) {
        this.setData({ dialog: true })
      } else {
        this.publish()
      }
    }
  },
  cancel() {
    wx.navigateBack({ delta: 1 })
  },
  onClose() {
    this.setData({ dialog: false })
  },
  publish() {
    ajax('/index/userReport/report', { type: this.data.paramsType, content: this.data.params }, 'post').then(() => {
      Toast({
        type: 'success',
        message: '提交成功!',
        onClose: () => {
          wx.navigateBack({ delta: 1 })
        },
      });
    })
  }
})
