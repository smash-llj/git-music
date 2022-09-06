// pages/video/video.js

import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoList: [],
        navid: '', //导航标识
        songDetailList:[],
        updateTime:0
    },
    //导航选中下的红色线
    changeNav(e) {
        let navid = e.currentTarget.dataset.id
        console.log(navid);
        this.setData({
                navid,
                updateTime:this.data.songDetailList[23].updateTime
            })   
       //暂时切换不了    

    },
    //获取歌单导航数据
    async videoListData() {
      let videoData = await request('/playlist/hot')
      this.setData({
              videoList: videoData.tags.slice(0, 14),
              navid: videoData.tags[0].id
          })
          //获取视频数据
          this.songDate()
  },
  async songDate(){
    let songDetailList= await request('/top/playlist')
    this.setData({
      songDetailList:songDetailList.playlists.splice(0,24)
    })
  },
  //把点击的歌曲id传给歌单列表
// 当我们点击歌单的时候，获取对应歌单id，并发送给歌单详情页·
  getId(e){
  //  console.log(e);
   const ids=e.currentTarget.dataset.index
   const indexId=this.data.songDetailList[ids].id
  //  PubSub.publish('songId',indexId)
  //  console.log(indexId);
 
   wx.navigateTo({
     url: '../geDan/geDan?musicid='+indexId,
     
   })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取视频页导航区数据
        this.videoListData()
        this.songDate()
 
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