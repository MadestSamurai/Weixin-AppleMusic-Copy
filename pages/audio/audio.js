// pages/audio/audio.js
var util = require('../../utils/util');
const appInstance = getApp();

Page({
  data: {
    isList: false,
    isPlay: false,
    music: {},
    musicFrom: 'Unknown',
    fmtLeftTime: "0:00",
    fmtCurrentTime: "0:00",
    currentWidth: 0,
    musicList: [], //歌曲列表
    musicindex: 0 //进入某首歌曲后，记录该歌曲在列表中的索引
  },
  onLoad(options) {
    const musicList = JSON.parse(options.list);
    this.setData({
      musicList
    });
    const music = musicList[options.index];
    this.setData({
      music
    });
    const musicFrom = options.album;
    this.setData({
      musicFrom
    });

    const {
      isPlayGlobal,
      musicIdGlobal
    } = appInstance.globalData;
    const {
      id
    } = this.data.music;
    if (isPlayGlobal && musicIdGlobal === id) {
      this.setData({
        isPlay: true
      });
    }

    this.bam = wx.getBackgroundAudioManager();
    this.bam.onPlay(() => {
      this.setData({
        isPlay: true
      })
      appInstance.globalData.isPlayGlobal = true;
      appInstance.globalData.musicIdGlobal = this.data.music.id;
    })
    this.bam.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isPlayGlobal = false;
    })
    this.bam.onStop(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isPlayGlobal = false;
    })
    this.bam.onEnded(() => {
      // 音乐自然播放结束，则切换至下一首
      let {
        musicindex,
        musicList
      } = this.data;
      if (musicindex === musicList.length - 1) {
        musicindex = 0;
      } else {
        musicindex++;
      }
      this.setData({
        musicindex
      });
      const music = musicList[musicindex];
      this.setData({
        music
      })
      this.musicControl();
    })
    this.bam.onTimeUpdate(() => {
      const currentWidth = Math.floor(646 * this.bam.currentTime / this.bam.duration);
      const leftTime = this.bam.duration - this.bam.currentTime;
      const fmtCurrentTime = Math.floor(this.bam.currentTime / 60) + ":" + util.zeroFill(Math.floor(this.bam.currentTime % 60) + "", 2);
      const fmtLeftTime = Math.floor(leftTime / 60) + ":" + util.zeroFill(Math.floor(leftTime % 60) + "", 2);
      this.setData({
        currentWidth,
        fmtCurrentTime,
        fmtLeftTime
      });
    })
    const isPlay = true;
    this.setData({
      isPlay
    });
    this.musicControl();
  },
  handlePlay() {
    const isPlay = !this.data.isPlay;
    this.setData({
      isPlay
    });
    this.musicControl();
  },
  musicControl() {
    const {
      isPlay
    } = this.data;
    if (isPlay) {
      this.bam.src = this.data.music.url;
      this.bam.title = this.data.music.name;
    } else {
      this.bam.pause();
    }
  },
  handleSwitch(event) {
    const type = event.target.id;
    let {
      musicindex,
      musicList
    } = this.data;
    if (type === "prev") {
      if (musicindex === 0) {
        musicindex = musicList.length - 1;
      } else {
        musicindex--;
      }
    } else if (type === "next") {
      if (musicindex === musicList.length - 1) {
        musicindex = 0;
      } else {
        musicindex++;
      }
    }
    this.setData({
      musicindex
    });
    const music = musicList[musicindex];
    // 显示切换后的歌曲详情
    this.setData({
      music
    })
    this.bam.src = this.data.music.url;
    this.bam.title = this.data.music.name;
  },
  handleTap(event) {
    const {
      musicitem,
      musicindex
    } = event.currentTarget.dataset;
    this.setData({
      musicindex
    });
    const music = musicitem;
    this.setData({
      music
    });
    this.bam.src = this.data.music.url;
    this.bam.title = this.data.music.name;
  },
  showList() {
    if (this.data.isList) {
      this.setData({
        isList: false
      });
    } else {
      this.setData({
        isList: true
      });
    }
  },

  powerDrawer: function() {
    var currentStatus = this.data.isList
    this.fade(currentStatus)
  },

  fade: function(currentStatus) {
    var animation = wx.createAnimation({
      duration: 300, //动画时长  
      timingFunction: "linear", 
      delay: 0 //0则不延迟  
    });

    // 将这个动画实例赋给当前的动画实例  
    this.animation = animation;

    animation.opacity(0).step();

    // 导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      animation.opacity(1).step();
      this.setData({
        animationData: animation
      })

      if (currentStatus) {
        this.setData({
          isList: false
        });
      } else {
        this.setData({
          isList: true
        });
      }
    }.bind(this), 300)
  },

  checkArtist() {
    wx.navigateTo({
      url: '../artist/artist?name=' + this.data.music.author + '&mbid='
    })
  }
})