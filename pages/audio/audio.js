// pages/audio/audio.js
import PubSub from "pubsub-js";
var util = require('../../utils/util');
const appInstance = getApp();

Page({
  data: {
    isPlay: false,
    music: {},
    fmtLeftTime: "0:00",
    fmtCurrentTime: "0:00",
    currentWidth: 0
  },
  onLoad(options) {
    const music = JSON.parse(options.musicitem);
    this.setData({
      music
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
      PubSub.publish("switchsong", "next");
      // 接收来自播放列表页的消息，显示切换后的歌曲详情
      const eventId = PubSub.subscribe("refreshmusic", (msgName, music) => {
        PubSub.unsubscribe(eventId);
        this.setData({music})
        this.musicControl();
        this.setData({
          fmtCurrentTime: "00:00"
        })
      })
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

    this.handlePlay();
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
  handleSwitch(event){
    const type = event.target.id;
    // 发送消息，告诉播放列表页：切上一首还是下一首。prev代表切上一首，next代表切下一首。
    PubSub.publish("switchsong",type);

    // 接收来自播放列表页的消息，显示切换后的歌曲详情
    const eventId = PubSub.subscribe("refreshmusic",(msgName,music) => {
      PubSub.unsubscribe(eventId);
      this.setData({music})
      this.musicControl();
    })
  },
  showList(){
    wx.navigateTo({
      url: '/pages/music-lists/music-lists'
    })
  }
})