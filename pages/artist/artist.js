// pages/artist/artist.js
var x = 0
var y = 0
var trackArt = []
var artistArt = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    artistImage: '',
    artistName: '',
    tracks: [],
    albums: [],
    similarArtist: [],
    trackArt: [],
    artistArt: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    x = 0;
    trackArt = [];
    y = 0;
    artistArt = [];
    wx.request({
      url: 'https://api.deezer.com/search/artist/autocomplete?q=artist:"' + options.name + '"',
      data: {
        fmt: 'json'
      },
      success: (resp) => {
        var artistList = resp.data.data
        if (artistList.length > 0) {
          var i = 0;
          var temp = true;
          for (i = 0; i < artistList.length; i++) {
            if (artistList[i].name == options.name) {
              temp = false;
              break;
            }
          }
          if (temp) {
            i = 0;
          }
          console.log(artistList[i]);
          this.setData({
            artistImage: artistList[i].picture_xl,
            artistName: artistList[i].name
          })
          wx.request({
            url: 'http://ws.audioscrobbler.com/2.0/',
            data: {
              method: 'artist.gettoptracks',
              format: 'json',
              api_key: '78584ea17d70aa799c0a973b70752424',
              artist: options.name,
              mbid: options.mbid
            },
            success: (resp) => {
              var lists = resp.data.toptracks.track;
              console.log(lists);
              this.setData({
                tracks: lists.slice(0, 4)
              });
              (async () => {
                for (var i = 0; i < 4; i++) {
                  await this.getTrackImage(lists[i].artist.name, lists[i].name);
                }
              })()
            }
          })
          wx.request({
            url: 'http://ws.audioscrobbler.com/2.0/',
            data: {
              method: 'artist.gettopalbums',
              format: 'json',
              api_key: '78584ea17d70aa799c0a973b70752424',
              artist: options.name,
              mbid: options.mbid
            },
            success: (resp) => {
              console.log(resp.data.topalbums.album);
              this.setData({
                albums: resp.data.topalbums.album.slice(0, 4)
              })
            }
          })
          wx.request({
            url: 'http://ws.audioscrobbler.com/2.0/',
            data: {
              method: 'artist.getsimilar',
              format: 'json',
              api_key: '78584ea17d70aa799c0a973b70752424',
              artist: options.name,
              mbid: options.mbid
            },
            success: (resp) => {
              var lists = resp.data.similarartists.artist
              console.log(lists);
              this.setData({
                similarArtist: lists.slice(0, 6)
              });
              (async () => {
                for (var i = 0; i < 6; i++) {
                  await this.getArtistImage(lists[i].name);
                }
              })()
            }
          })
        }
      }
    })
  },

  getTrackImage(artist, track) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://ws.audioscrobbler.com/2.0/',
        data: {
          method: 'track.getInfo',
          format: 'json',
          api_key: '78584ea17d70aa799c0a973b70752424',
          artist: artist,
          track: track
        },
        success: (resp) => {
          console.log(resp.data)
          if ('album' in resp.data.track) {
            trackArt[y] = resp.data.track.album.image[3]["#text"];
          } else {
            trackArt[y] = '';
          }
          y++;
          this.setData({
            trackArt: trackArt
          })
          resolve();
        }
      })
    })
  },

  getArtistImage(item) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.deezer.com/search/artist/autocomplete?q=artist:"' + item + '"',
        data: {
          fmt: 'json'
        },
        success: (resp) => {
          var artistList = resp.data.data
          if (artistList.length > 0) {
            var i = 0;
            var temp = true;
            for (i = 0; i < artistList.length; i++) {
              if (artistList[i].name == item) {
                temp = false;
                break;
              }
            }
            if (temp) {
              i = 0;
            }
            if ('picture_medium' in artistList[i]) {
              artistArt[x] = artistList[i].picture_medium;
            } else {
              artistArt[x] = '';
            }
          } else {
            artistArt[x] = '';
          }
          x++;
          this.setData({
            artistArt: artistArt
          })
          resolve();
        }
      })
    })
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