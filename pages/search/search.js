// pages/search/search.js
var util = require('../../utils/util');
const host = "http://49.234.6.100";
var limit = 20
var pagesTrack = 1
var pagesAlbum = 1
var pagesArtist = 1
var artistArt = []
var trackArt = []
var x = 0;
var y = 0;

Page({

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
    this.setData({currentIndex: clickIndex});
  },

  changeitem(event) {
    let swiperIndex = event.detail.current;
    this.setData({currentIndex: swiperIndex});
  },

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
        api_key: 'YOUR_API_KEY',
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
        api_key: 'YOUR_API_KEY',
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
        api_key: 'YOUR_API_KEY',
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
          api_key: 'YOUR_API_KEY',
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
      url: '../artist/artist?name=' + artistinfo.name + '&mbid=' + artistinfo.mbid
    })
  },

  handleTapAlbum(event) {
    var albuminfo = event.currentTarget.dataset.musicitem
    console.log(albuminfo)
    wx.navigateTo({
      url: '../album/album?artist=' + albuminfo.artist + '&title=' + albuminfo.name
    })
  },

  handleTapSingle(event) {
    var singleinfo = event.currentTarget.dataset.musicitem
    console.log(singleinfo)
    var list = [];
    var jsonObj = new Object();
    jsonObj.id = 0;
    jsonObj.name = singleinfo.name;
    jsonObj.author = singleinfo.artist;
    jsonObj.picUrl = this.data.trackArt[event.currentTarget.dataset.musicindex];
    jsonObj.url = host + '/music/Dangerous World/' + util.zeroFill(Math.round(Math.random()*15) + 1 + '', 2) + '.mp3'
    list.push(jsonObj);
    console.log(list);
    wx.navigateTo({
      url: '../audio/audio?list=' + JSON.stringify(list) + '&index=' + 0 + '&album=' + "搜索",
    })
  }
})