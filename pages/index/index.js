import { ajax } from '../../utils/http'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    movies: [
      { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600160596837&di=29400d565d240c627e7c43048bb0a7c1&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F03%2F28%2F90%2F5b7d5e5a6efa2_610.jpg' },
      { url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2142142353,1341383433&fm=26&gp=0.jpg' },
      { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600160520268&di=d25dc35f751f762da12878a6149ba995&imgtype=0&src=http%3A%2F%2Fwww.itmsc.cn%2Fuploads%2Fallimg%2F171125%2F112214D04_0.png' },
      { url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600160701110&di=f75d9b16b73656f8f180b9f0b16ef85d&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fbackgd%2Fcover%2F00%2F46%2F01%2F5bfcc8c6bef5c.jpg%2521%2Ffw%2F780%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue' },
    ],
    videos: [],
  },
  onShow() {
    ajax('/index/video/list', { page: 1, pageSize: 4 }).then(res => {
      this.setData({ videos: res.list })
    })
  },
  jumpVideoList() {
    wx.navigateTo({ url: '/pages/videoList/videoList' })
  },
  goSign() {
    wx.navigateTo({ url: '/pages/sign/sign' })
  },
  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        const user = wx.getStorageSync('user');
        console.log(res)
        if (user.position === 1 && res.path.indexOf('inspection') !== -1) {
          return Toast({ type: 'fail', context: this, message: '暂无权限访问巡检，请联系管理员！' })
        }
        wx.navigateTo({ url: `/${res.path}` })
      },
      fail() {
        Toast({ type: 'fail', context: this, message: '扫码失败' })
      }
    })
  },
  goReport() {
    wx.navigateTo({ url: '/pages/report/report' })
  }
})
