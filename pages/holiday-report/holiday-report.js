import { ajax } from '../../utils/http'

Page({
  data: {
    show: {
      date: false,
      type: false
    },
    signList: [],
    pic: '',
    form: {
      day: new Date().getTime(),
      type: '1'
    },
    type: '签到',
    columns: [
      { text: '签到', value: 1 },
    ],
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
  },
  onLoad() {
    this.fetchData()
  },
  preventTouchMove() {},
  fetchData() {
    const params = Object.assign({}, this.data.form, { day: parseInt(this.data.form.day / 1000) })
    ajax('/index/report/signDaily', params).then(res => {
      this.setData({ signList: res.signList, pic: res.pic })
    })
  },
  showClick(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: true })
  },
  onCancel(e) {
    const model = e.currentTarget.dataset.name
    this.setData({ [`show.${model}`]: false })
  },
  onDateConfirm(e) {
    this.setData({ 'form.day': e.detail, 'show.date': false })
    this.fetchData()
  },
  onTypeConfirm(e) {
    const { text, value } = e.detail.value
    this.setData({ 'form.type': value, type: text, 'show.type': false })
    this.fetchData()
  }
})
