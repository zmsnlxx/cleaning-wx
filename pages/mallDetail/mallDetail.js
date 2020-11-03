import { ajax } from '../../utils/http'

Page({
  data: {
    list: []
  },
  type: '1',
  onLoad(options) {
    const api = options.type === '1' ? '/index/goods/integralList' : '/index/goods/exchangeList'
    ajax(api, { page: 1, pageSize: 99 }).then(res => {
      console.log(res)
      this.setData({ list: res.list, type: options.type })
    })
  }
})
