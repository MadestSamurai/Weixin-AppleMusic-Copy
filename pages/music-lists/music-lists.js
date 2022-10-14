// pages/music-lists/music-lists.js
import PubSub from "pubsub-js";
const host = "http://49.234.6.100";

Page({
  data:{
    musicList:[], //歌曲列表
    musicindex:0  //进入某首歌曲后，记录该歌曲在列表中的索引
  },
  onLoad(options){
    const musicList = JSON.parse(options.list);
    this.setData({
      musicList
    });

    //接收消息，接收来自页面pages/music/music的消息，根据“上一首”or“下一首”，确定当前应该显示哪首歌曲
    PubSub.subscribe("switchsong",(msgName, type) => {
      // console.log(msgName,type);
      let {musicindex,musicList} = this.data;
      if(type === "prev"){
        if(musicindex===0) {
          musicindex = musicList.length-1;
        }else{
          musicindex--;
        }
      }else if(type === "next"){
        if(musicindex === musicList.length-1){
          musicindex = 0;
        }else{
          musicindex++;
        }
      }
      this.setData({musicindex});
      const music = musicList[musicindex];
      //发送消息，告诉页面pages/music/music，告诉它切换完成后的歌曲的详细消息。
      PubSub.publish("refreshmusic",music);
    })
  },
  handleTap(event){
    const {musicitem,musicindex} = event.currentTarget.dataset;
    this.setData({musicindex})
    wx.navigateTo({
      url: '/pages/audio/audio?musicitem='+JSON.stringify(musicitem),
    })
  }
})
