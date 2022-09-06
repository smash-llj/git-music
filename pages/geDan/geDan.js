// pages/geDan/geDan.wxss.js

import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
        idx:0,
        geDanDate:[],
        geDanList:[],
        Sid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //获取video传过来的歌单id
      
        console.log(options);
        let song =options.musicid
        this.getGeDan(song)

  },

 //通过id获取歌单详情以及全部歌曲
  async getGeDan(song){
      let songDate=await request('/playlist/detail',{id:song})
      this.setData({
        geDanDate:songDate.playlist
      })
      console.log(songDate);
    },
   playSong(e){
    let { song, index } = e.currentTarget.dataset;
    console.log(song,index);
    wx.navigateTo({
      url: '../playsong/playsong?musicid='+song.id,
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