// pages/now/now.js
Page({

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
        let lists = resp.data.tracks.track;
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
        var year = new Date(resp.data.track.wiki.published);
        resp.data.track.year = year.getFullYear();
        this.setData({
          topTracks: this.data.topTracks.concat(resp.data.track)
        })
      }
    });
  },

  checkAlbum(event){
    let clickText = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../album/album?artist=' + clickText.album.artist + '&title=' + clickText.album.title + '&published=' + clickText.wiki.published
    })
  },

  onLoad(options) {
    getApp().editTabBar();
    this.getTopTracks(5);
    wx.request({
      url: 'http://49.234.6.100:5000/now',
      success: (resp) => {
        console.log(resp);
        this.setData({
          showData: resp.data
        })
      }
    });
  }
})