import utils from './utils/index'

App({
  onLaunch: function() {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log(res)
          utils.request(
            'USER_LOGIN',
            {
              data: {
                code: res.code
              }
            }).then()
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
      hasLogin: false
  }
});