import { ajax } from '../../utils/http'

Component({
  properties: {
    videoList: {
      type: Array,
      value: [],
    },
  },
  data: {
    fullScreen: false,
    currentVideo: {},
    show: false,
    integral: 0,
  },
  methods: {
    preventTouchMove() {},
    play(e) {
      const videoContext = wx.createVideoContext('myvideo', this);
      videoContext.requestFullScreen();
      this.setData({
        fullScreen: true,
        currentVideo: this.data.videoList[e.currentTarget.dataset.index]
      })
    },

    // 播放完毕
    closeVideo() {
      const videoContext = wx.createVideoContext('myvideo', this);
      videoContext.exitFullScreen();
      // 视频播放完毕时用户获取积分
      ajax('/index/video/play',{ videoId: this.data.currentVideo.videoId }, 'post').then(res => {
        if (res) {
          const user = wx.getStorageSync('user');
          user.integral = user.integral + res
          wx.setStorageSync('user', user);
          this.setData({ show: true, integral: res })
        }
      })
    },

    onClose() {
      this.setData({ show: false })
    },

    fullScreen(e){
      //视屏全屏时显示加载video，非全屏时，不显示加载video
      this.setData({
        fullScreen: e.detail.fullScreen
      })
    }
  },
})
