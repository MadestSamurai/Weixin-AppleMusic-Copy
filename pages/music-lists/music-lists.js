// pages/music-lists/music-lists.js
const host = "http://49.234.6.100";

Page({
  data:{
    
  },

  handleTap(event){
    const {musicitem,musicindex} = event.currentTarget.dataset;
    this.setData({musicindex})
    wx.navigateTo({
      url: '/pages/audio/audio?musicitem='+JSON.stringify(musicitem),
    })
  }
})
