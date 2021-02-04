import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    user: {},
    value: '',
    list: [],
    activeName: [],
    classindex: 0,
    index: 0,
    show: false,
    row: {},
    labels: [
      { name: '名称', id: 'name' },
      { name: '品牌', id: 'brand' },
      { name: '规格', id: 'spec' },
      { name: '单位', id: 'unit' },
      { name: '库存', id: 'stock' },
    ],
    num: '',
    params: {
      floor: '',
      type: '1',
      applys: []
    },
    orderId: '',
    type: '',
    text: '库存',
  },
  onLoad(option) {
    const user = wx.getStorageSync('user');
    if (option) {
      this.setData({ user, 'params.floor': option.floor || '', type: option.type || '1', 'params.type': option.type || '1' })
      wx.setNavigationBarTitle({
        title: ['仓库管理', '用品申领', '消耗报备'][+option.type]
      })
      if (option.type !== '0') {
        this.setData({ text: option.type === '1' ? '库存' : '消耗' })
      }
    }
    this.getList()
  },
  getList() {
    ajax('/index/warehouse/list', { name: this.data.value }).then(res => {
      const activeName = res.map(item => item.type)
      this.setData({ list: res, activeName })
    })
  },
  search(e) {
    this.setData({ value: e.detail })
    this.getList()
  },
  onChange(e) {
    this.setData({ activeName: e.detail });
  },
  open(e) {
    const { classindex, index, order } = e.currentTarget.dataset
    if (order) {
      const current = this.data.params.applys.find(item => item.suppliesId === order)
      this.setData({ orderId: order, num: current.num })
    }
    const row = this.data.list[classindex].list[index]
    this.setData({ classindex, index, show: true, row })

  },
  onClose() {
    this.setData({ show: false, num: '' })
  },
  submit() {
    if (this.data.type === '0') {
      const params = { warehouseId: this.data.row.warehouseId, stock: this.data.num }
      ajax('/index/warehouse/update', params, 'post').then(res => {
        Toast({ type: 'success', context: this, message: '调整成功！' })
        this.getList()
      })
    } else {
      if (Number(this.data.num) > this.data.row.stock) return Toast.fail('库存不足，请重新输入')
      const arr = this.data.params.applys
      const list = this.data.list
      list.forEach(item => {
        if(item.typeName === this.data.row.typeName) {
          const current = item.list.find(i => i.warehouseId === this.data.row.warehouseId)
          current.order = this.data.num
        }
      })
      if (this.data.orderId) {
        arr.find(item => item.suppliesId === this.data.orderId).num = this.data.num
        this.setData({ 'params.applys': arr, list })
      } else {
        arr.push({ suppliesId: this.data.row.warehouseId, num: this.data.num })
        this.setData({ 'params.applys': arr, list })
      }
    }
    this.setData({ show: false, num: '', orderId: '' })
  },
  input(e) {
    this.setData({ num: e.detail.value })
  },
  clickBtn() {
    const { applys } = this.data.params
    let total = 0
    applys.forEach(item => {
      total += Number(item.num)
    })
    Dialog.confirm({
      title: `确认${this.data.type === '1' ? '申领'  : '消耗'}`,
      message: `*您共选择了${applys.length}种物品，共${total}件，请确认完毕后点击确认进行${this.data.type === '1' ? '申领'  : '消耗'}`,
    }).then(() => {
      ajax('/index/apply/add', this.data.params, 'post').then(() => {
        Toast({ type: 'success', context: this, message: `${this.data.type === '1' ? '申领'  : '消耗'}成功！` })
        wx.navigateBack({ delta: 1 })
      })
    })
  }
})
