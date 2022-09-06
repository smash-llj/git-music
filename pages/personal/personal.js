// pages/personal/personal.js
import request from '../../utils/request'
let coverstart = 0
let covermove = 0
let coversum = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coveryi: 'translateY(0px)', //移动位移变量
        coverdong: '', //过度动画变量
        userInfo: {},
        userrecntdata: [] //获取用户最近播放记录
    },
    // 页面动画
    covertouchstart(event) {
        console.log(event);
        coverstart = event.touches[0].clientY
        this.setData({
                coverdong: 'transform 1s linear'
            })
            //消除过度动画的重叠
    },
    covertouchmove(event) {
        covermove = event.touches[0].clientY
        coversum = covermove - coverstart
        console.log(coversum);
        //判断位移 防止出现上移
        if (coversum <= 0) {
            return;
        }
        if (coversum >= 40) {
            coversum = 40
        }
        //把得出的总位移赋值给位移变量
        this.setData({
            coveryi: `translateY(${coversum}px)`
        })
    },
    //手指离开时恢复0
    covertouchend() {
        this.setData({
            coveryi: `translateY(0px)`,
            coverdong: 'transform .5s linear'
        })
    },
    jop() {
        wx.navigateTo({
            url: "../login/login"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //读取用户最近信息
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                    userInfo: JSON.parse(userInfo)
                })
                //获取用户播放记录
            this.getuserlist(this.data.userInfo.userId)
        }
    },
    async getuserlist(userId) {
        let userrecentlist = await request('/user/record', { uid: userId, type: 1 })
        this.setData({
            userrecntdata: userrecentlist.weekData.splice(0, 20)
        })
    },
    //获取用户点击的歌曲id 
    personalsong(e) {
        let ids = e.currentTarget.dataset.index
        let personalsongid = this.data.userrecntdata[ids].song.id
            //跳转到播放页面播放
        wx.navigateTo({
            url: '../playsong/playsong?musicid=' + personalsongid,
        })
    },
    //退出登录
    exitLogin(){
     wx.clearStorage()
    //  let userExit = await request('/logout')
     wx.redirectTo({
      url: '../login/login'
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