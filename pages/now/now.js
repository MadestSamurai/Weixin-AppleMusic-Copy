// pages/now/now.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTracks: [],
    showData: {}
  },

  getTopTracks(limit) {
    wx.request({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        method: 'chart.gettoptracks',
        format: 'json',
        api_key: '78584ea17d70aa799c0a973b70752424',
        limit: limit
      },
      success: (resp) => {
        console.log(resp);
        let lists = resp.data.tracks.track;
        console.log(lists);
        for(var i in lists) {
          console.log(lists[i].image[3]["#text"])
          this.getInfo(lists[i].artist.name, lists[i].name, lists[i].mbid)
        }
      }
    });
  },

  getInfo(artist, track, mbid) {
    wx.request({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        method: 'track.getInfo',
        format: 'json',
        api_key: '78584ea17d70aa799c0a973b70752424',
        artist: artist,
        track: track,
        mbid: mbid
      },
      success: (resp) => {
        console.log(resp.data.track);
        var year = new Date(resp.data.track.wiki.published);
        resp.data.track.year = year.getFullYear();
        this.setData({
          topTracks: this.data.topTracks.concat(resp.data.track)
        })
      }
    });
  },

  checkAlbum(event){
    console.log(event);
    let clickText = event.currentTarget.dataset.item;
    console.log(clickText);

    wx.navigateTo({
      url: '../album/album?artist=' + clickText.album.artist + '&title=' + clickText.album.title + '&published=' + clickText.wiki.published
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getApp().editTabBar();
    this.getTopTracks(5);
    wx.request({
      url: 'http://49.234.6.100:5000/query',
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