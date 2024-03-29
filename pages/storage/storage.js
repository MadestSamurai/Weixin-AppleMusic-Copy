// storage.js

Page({
  data: {
    function_list: [
      {icon: "/image/menu/playlist.svg", title: "播放列表"},
      {icon: "/image/menu/artist.svg", title: "艺人"},
      {icon: "/image/menu/album.svg", title: "专辑"},
      {icon: "/image/menu/song.svg", title: "歌曲"},
      {icon: "/image/menu/download.svg", title: "已下载"}
    ]
  },

  onLoad() {
    getApp().editTabBar();

    wx.request({
      url: 'http://49.234.6.100:5000/storage',
      success: (resp) => {
        console.log(resp);
        this.setData({
          showData: resp.data
        })
      }
    });
  }
})
