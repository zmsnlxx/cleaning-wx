import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    list: [
      {}
    ],
    form: {
      day: new Date().getTime()
    },
    maxDate: new Date().getTime(),
    show: { day: false },
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
    const model = e.currentTarget.dataset.name
    this.setData({ [`form.${model}`]: e.detail, [`show.${model}`]: false })
    if (model === 'day') {
      this.getDayData({ day: parseInt(this.data.form.day / 1000) })
    }
  },
  preventTouchMove() {},
})
