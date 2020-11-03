import { ajax } from '../../utils/http'

Page({
  data: {
    videos: [],
  },
  onLoad() {
    ajax('/index/video/list', { page: 1, pageSize: 99 }).then(res => {
      this.setData({ videos: res.list })
    })
  },
})
