import utils from '../../utils/index'

Page({
  data: {
  },
  onLoad: function () {
    utils.request(
      'USER_LOGIN',
      {
        data: {
          code: 'ff'
        }
      }).then();
  },
  setQN: function (e) {
    wx.navigateTo({
      url: '../set/newQN/newQN'
    })
  },
  myQN: function () {
  }
});
