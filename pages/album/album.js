// pages/album/album.js
var util = require('../../utils/util');
const host = "http://49.234.6.100";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cover: "",
    title: "",
    artist: "",
    genre: "",
    year: "",
    hasIntro: false,
    introduction: "",
    songlist: [],
    date: "",
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    wx.request({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        method: 'album.getInfo',
        format: 'json',
        api_key: '78584ea17d70aa799c0a973b70752424',
        artist: options.artist,
        album: options.title,
      },
      success: (resp) => {
        console.log(resp.data.album);
        let data = resp.data.album;
        let date = new Date(options.published);
        if ('wiki' in data) {
          date = new Date(data.wiki.published);
          let content = data.wiki.content.split('<a')[0];
          this.setData({
            cover: data.image[3]["#text"],
            title: options.title,
            artist: options.artist,
            genre: data.tags.tag[0].name,
            year: date.getFullYear(),
            hasIntro: true,
            introduction: content,
            songlist: data.tracks.track,
            date: date.toDateString()
          })
        } else {
          var tracks = new Array();
          if (Array.isArray(data.tracks.track)) {
            tracks = data.tracks.track;
          } else {
            options.title = options.title + ' - Single';
            tracks[0] = data.tracks.track;
          }
          if(data.tags == "") data.tags = {"tag":[{"name": "unknown"}]}
          this.setData({
            cover: data.image[3]["#text"],
            title: options.title,
            artist: options.artist,
            genre: data.tags.tag[0].name,
            year: date.getFullYear(),
            hasIntro: false,
            introduction: "",
            songlist: tracks,
            date: date.toDateString()
          });
          console.log(data.tracks.track)
        }
      }
    });
  },

  // 禁止屏幕滚动
  preventTouchMove: function () {},

  powerDrawer: function (e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.move(currentStatus)
    this.fade(currentStatus)

    if (currentStatus == "open") {
      this.setData({showModalStatus: true});
    }
  },

  fade: function (currentStatus) {
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "ease-out", //线性  
      delay: 0 //0则不延迟  
    });

    // 将这个动画实例赋给当前的动画实例  
    this.animation = animation;

    animation.opacity(0).step();

    // 导出动画对象赋给数据对象储存  
    this.setData({
      animationData1: animation.export()
    })

    // 设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      animation.opacity(1).step();
      this.setData({
        animationData1: animation
      })

      if (currentStatus == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
  },

  move: function (currentStatus) {
    var animation = wx.createAnimation({
      duration: 500, //动画时长  
      timingFunction: "ease-out", //线性  
      delay: 0 //0则不延迟  
    });

    this.animation = animation;

    animation.translate(0,1000).step();

    // 导出动画对象赋给数据对象储存  
    this.setData({
      animationData2: animation.export()
    })

    // 设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      animation.translate(0,0).step();
      this.setData({
        animationData2: animation
      })

      if (currentStatus == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 500)
  },

  playSingle(event) {
    console.log(event);
    let songList = this.data.songlist;
    var list = [];
    for(var i = 0, len = songList.length; i < len; i++) {
      var jsonObj = new Object();
      jsonObj.id = i;
      jsonObj.name = songList[i].name;
      jsonObj.author = songList[i].artist.name;
      jsonObj.picUrl = this.data.cover;
      jsonObj.url = host+'/music/Dangerous World/'+util.zeroFill(i+1+'',2)+'.mp3'
      list.push(jsonObj);
    }
    console.log(list);
    wx.navigateTo({
      url: '../audio/audio?list='+JSON.stringify(list)+'&index='+event.currentTarget.dataset.item+'&album='+this.data.title,
    })
  },

  playAlbum() {
    let songList = this.data.songlist;
    var list = [];
    for(var i = 0, len = songList.length; i < len; i++) {
      var jsonObj = new Object();
      jsonObj.id = i;
      jsonObj.name = songList[i].name;
      jsonObj.author = songList[i].artist.name;
      jsonObj.picUrl = this.data.cover;
      jsonObj.url = host+'/music/Dangerous World/'+util.zeroFill(i+1+'',2)+'.mp3'
      list.push(jsonObj);
    }
    console.log(list);
    wx.navigateTo({
      url: '../audio/audio?list='+JSON.stringify(list)+'&index='+ 0 +'&album='+this.data.title,
    })
  },

  shuffleAlbum() {
    let songList = this.data.songlist;
    var list = [];
    for(var i = 0, len = songList.length; i < len; i++) {
      var jsonObj = new Object();
      jsonObj.id = i;
      jsonObj.name = songList[i].name;
      jsonObj.author = songList[i].artist.name;
      jsonObj.picUrl = this.data.cover;
      jsonObj.url = host+'/music/Dangerous World/'+util.zeroFill(i+1+'',2)+'.mp3'
      list.push(jsonObj);
    }
    console.log(list);
    wx.navigateTo({
      url: '../audio/audio?list='+JSON.stringify(list)+'&index='+ 0 +'&album='+this.data.title,
    })
  },

  checkArtist() {
    wx.navigateTo({
      url: '../artist/artist?name=' + this.data.artist + '&mbid='
    })
  }
})