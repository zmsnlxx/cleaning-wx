const config = require('./config.js')
Component({
  properties: {
    activeIndex: {
      type: Number,
      value: 0,
    },
    avatarUrl: {
      type: String,
      value: ''
    }
  },
  data: {
    data: config,
  },
  created() {
    wx.hideTabBar({ aniamtion: false })
  },
  methods: {
    clickTag(e) {
      let index = e.currentTarget.dataset.index
      this.changeTag(index)

    },
    bindMiddleTab: function () {
      this.changeTag(2)
    },
    changeTag(index) {
      if (index === this.data.activeIndex) {
        return false
      }
      let pagePath = this.data.data.tabs[index].path
      wx.switchTab({
        url: pagePath,
      })
    },
    getUserInfo(e) {
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
    }
  },
})
