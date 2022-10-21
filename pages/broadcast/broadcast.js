// pages/broadcast/broadcast.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getApp().editTabBar();

    wx.request({
      url: 'http://49.234.6.100:5000/broadcast',
      success: (resp) => {
        console.log(resp);
        this.setData({
          showData: resp.data
        })
      }
    });
  }
})