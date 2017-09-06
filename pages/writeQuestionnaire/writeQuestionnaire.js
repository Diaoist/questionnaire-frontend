import utils from '../../utils/index'
// newQN.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    questionTemplate: {
      type: 0,
      title: '',
      subQuestion: ['', '']
    },
    questionTemplate_3: {
      type: 2,
      title: '',
      subQuestion: ['']
    },
    question: [],
    tempSubTitle: '',
    questionType: ['单选题', '多选题', '填空题']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     return;
  //   }
  //   return {
  //     title: this.data.title,
  //     path: '/page/user?id=123',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },



  /** 
   * 设置问卷标题
   */
  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  /**
   * 子标题输入
   */
  bindSubTitleInput: function (e) {
    let question = this.data.question;
    question[e.currentTarget.dataset.id].title = e.detail.value;
    this.setData({
      question
    })
  },

  /**
   * 子选项输入
   */
  bindSubQuestionInput: function (e) {
    let question = this.data.question;
    let num = e.currentTarget.dataset.id.split(',');
    question[num[0]].subQuestion[num[1]] = e.detail.value;
    this.setData({
      question
    })
  },

  /**
   * 子选项添加
   */
  addQuestionInput: function (e) {
    let question = this.data.question;
    question[e.currentTarget.dataset.id].subQuestion.push('');
    console.log(question[e.currentTarget.dataset.id].subQuestion);
    this.setData({
      question
    })
  },

  /**
   * 添加问题
   */
  addEvent: function () {
    let that = this;
    wx.showActionSheet({
      itemList: that.data.questionType,
      success: function (res) {
        if (!res.cancel) {
          let template = '';
          if (res.tapIndex === 2) {
            template = that.data.questionTemplate_3;
          } else {
            template = that.data.questionTemplate;
          }
          template.type = res.tapIndex;
          that.data.question.push(template);
          that.setData({
            question: that.data.question
          })
        }
      }
    });
  },

  /**
   * 创建问卷
   */
  forwardEvent: function () {
    let ready = this.data.question.map((item) => {
      if (item.subQuestion.indexOf('') !== -1 || item.title === '') {
        return 0;
      } else {
        return 1;
      }
    });
    if (ready.indexOf(0) === -1 && this.data.question.length > 0 && this.data.title !== '') {
      utils.request(
        'USER_LOGIN',
        {
          data: {
            code: 'ff'
          },
          success: () => {
            wx.navigateTo({
              url: '../questionnaireInfo/questionnaireInfo'
            })
          }
        }).then(
        );
    } else {
      let message = '';
      if (this.data.question.length < 1) {
        message = '请添加问卷问题';
      } else if (this.data.title === '') {
        message = '请填写问卷标题';
      } else {
        message = '请确认填写所有子标题及可选项';
      }
      wx.showModal({
        content: message,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    }
  }
})