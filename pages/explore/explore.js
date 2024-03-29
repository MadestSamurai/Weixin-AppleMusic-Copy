// pages/explore/explore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData: {}
  },

  clickitem(event) {
    let clickIndex = event.currentTarget.dataset.index;
    console.log(clickIndex);
    this.setData({
      currentIndex: clickIndex
    });
  },

  changeitem(event) {
    console.log(event);
    let swiperIndex = event.detail.current;
    console.log("当前滑动的下表为：" + swiperIndex);
    this.setData({
      currentIndex: swiperIndex
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getApp().editTabBar();

    wx.request({
      url: 'http://49.234.6.100:5000/explore',
      success: (resp) => {
        console.log(resp);
        this.setData({
          showData: resp.data
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})