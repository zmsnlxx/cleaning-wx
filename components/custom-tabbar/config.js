module.exports={
  tabStyle:{
    activeColor:'#FE494C',//触发时文字颜色
    inactiveColor:'#353535',//未触发时文字的颜色
  },
  tabs:[
    {
      "content":"首页",//显示的文字
      "activeImg":"../../public/img/tabbar/home-active.png",//触发时的图片
      "inactiveImg":"../../public/img/tabbar/home.png",//未触发的图片
      "path":"/pages/index/index"//按钮对应的路径
    },
    {
      "content": "请假",
      "activeImg": "../../public/img/tabbar/holiday-active.png",
      "inactiveImg": "../../public/img/tabbar/holiday.png",
      "path": "/pages/holiday/holiday"
    },
    {
      "content": "积分商城",
      "activeImg": "../../public/img/tabbar/mall-active.png",
      "inactiveImg": "../../public/img/tabbar/mall.png",
      "path": "/pages/mall/mall"
    },
    {
      "content": "我的",
      "activeImg": "../../public/img/tabbar/personal-active.png",
      "inactiveImg": "../../public/img/tabbar/personal.png",
      "path": "/pages/personal/personal"
    }
  ]
}
