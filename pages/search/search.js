// pages/search/search.js
var limit = 20
var pagesTrack = 1
var pagesAlbum = 1
var pagesArtist = 1
var artistArt = []
var trackArt = []
var x = 0;
var y = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    artists: [],
    artistArt: [],
    tracks: [],
    trackArt: [],
    albums: [],
    searchKey: '',
    isSearched: false,
    currentIndex: 0,
    menutxt: ["艺人", "专辑", "歌曲"]
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
      url: 'http://49.234.6.100:5000/search',
      success: (resp) => {
        console.log(resp);
        this.setData({
          showData: resp.data
        })
      }
    });
  },

  confirm(e) {
    this.setData({
      searchKey: e.detail.value,
      isSearched: true
    });
    if (e.detail.value != '') {
      x = 0;
      artistArt = [];
      y = 0;
      trackArt = [];
      this.searchTrack(e.detail.value, 1, false);
      this.searchAlbum(e.detail.value, 1, false);
      this.searchArtist(e.detail.value, 1, false);
    }
  },

  searchTrack(key, page, con) {
    wx.request({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        method: 'track.search',
        format: 'json',
        api_key: '78584ea17d70aa799c0a973b70752424',
        limit: limit,
        track: key,
        page: page
      },
      success: (resp) => {
        var lists = resp.data.results.trackmatches.track
        if (con) {
          this.setData({
            tracks: this.data.tracks.concat(lists)
          });
        } else {
          this.setData({
            tracks: lists
          })
        }
        console.log(lists);
        (async () => {
          for (var i = 0; i < limit; i++) {
            await this.getTrackImage(lists[i].artist, lists[i].name, lists[i].mbid);
          }
        })()
      }
    });
  },

  searchAlbum(key, page, con) {
    wx.request({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        method: 'album.search',
        format: 'json',
        api_key: '78584ea17d70aa799c0a973b70752424',
        limit: limit,
        album: key,
        page: page
      },
      success: (resp) => {
        if (con) {
          this.setData({
            albums: this.data.albums.concat(resp.data.results.albummatches.album)
          });
        } else {
          this.setData({
            albums: resp.data.results.albummatches.album
          })
        }
      }
    });
  },

  searchArtist(key, page, con) {
    wx.request({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        method: 'artist.search',
        format: 'json',
        api_key: '78584ea17d70aa799c0a973b70752424',
        limit: limit,
        artist: key,
        page: page
      },
      success: (resp) => {
        var lists = resp.data.results.artistmatches.artist
        if (con) {
          this.setData({
            artists: this.data.artists.concat(lists)
          });
        } else {
          this.setData({
            artists: lists
          });
        }
        (async () => {
          for (var i = 0; i < limit; i++) {
            await this.getArtistImage(lists[i].name);
          }
        })()
      }
    });
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

  getTrackImage(artist, track, mbid) {
    return new Promise((resolve, reject) => {
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
          console.log(resp.data.track)
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

  loadnextArtist() {
    pagesArtist++;
    this.searchArtist(this.data.searchKey, pagesArtist, true);
  },

  loadnextAlbum() {
    pagesAlbum++;
    this.searchAlbum(this.data.searchKey, pagesAlbum, true);
  },

  loadnextTrack() {
    pagesTrack++;
    this.searchTrack(this.data.searchKey, pagesTrack, true);
  },

  handleTapArtist(event) {
    var artistinfo = event.currentTarget.dataset.musicitem
    console.log(artistinfo)
    wx.navigateTo({
      url: '/pages/artist/artist?name=' + artistinfo.name + '&mbid=' + artistinfo.mbid
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