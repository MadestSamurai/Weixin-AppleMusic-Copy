// pages/artist/artist.js
var util = require('../../utils/util');
const host = "http://49.234.6.100";
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

  handleTapArtist(event) {
    var artistinfo = event.currentTarget.dataset.musicitem
    console.log(artistinfo)
    wx.navigateTo({
      url: '../artist/artist?name=' + artistinfo.name + '&mbid=' + artistinfo.mbid
    })
  },

  handleTapAlbum(event) {
    var albuminfo = event.currentTarget.dataset.musicitem
    console.log(albuminfo)
    wx.navigateTo({
      url: '../album/album?artist=' + albuminfo.artist.name + '&title=' + albuminfo.name
    })
  },

  handleTapTrack(event) {
    var singleinfo = event.currentTarget.dataset.musicitem
    console.log(singleinfo)
    var list = [];
    var jsonObj = new Object();
    jsonObj.id = 0;
    jsonObj.name = singleinfo.name;
    jsonObj.author = singleinfo.artist.name;
    jsonObj.picUrl = this.data.trackArt[event.currentTarget.dataset.musicindex];
    jsonObj.url = host + '/music/Dangerous World/' + util.zeroFill(Math.round(Math.random()*15) + 1 + '', 2) + '.mp3'
    list.push(jsonObj);
    console.log(list);
    wx.navigateTo({
      url: '../audio/audio?list=' + JSON.stringify(list) + '&index=' + 0 + '&album=' + "搜索",
    })
  }
})