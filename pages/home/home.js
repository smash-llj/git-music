// pages/home/home.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [],
        songdata: [],
        topListItem: [],
        songsid: '',
        songtop: '',
        songbottom: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {

        let result = await request('/banner', { type: 2 });
        this.setData({
                bannerList: result.banners
            })
            // 获取歌单数据
        let songList = await request('/personalized', { limit: 10 })
        this.setData({
            songdata: songList.result
        })

        //获取排行榜信息
        let topList = await request('/toplist')
        let resultArr = []
        for (let i = 0; i < 5; i++) {
            let topListId = topList.list[i].id
            let topListItem = await request('/playlist/detail', { id: topListId })
            let weneed = { name: topListItem.playlist.name, tracks: topListItem.playlist.tracks.slice(0, 3) }
            resultArr.push(weneed)
            this.setData({
                topListItem: resultArr
            })
        }

    },//点击跳转到每日推荐页面
    jopRecommed() {
        wx.navigateTo({
            url: "../recommand/recommand"
        })
    },
    //点击跳转到歌单页面
    jopVideo(){
      wx.navigateTo({
        url: "../video/video"
    })
    },
    //点击跳转到排行榜页面
    jopTop(){
      wx.navigateTo({
        url: '../topList/topList',
      })
    },
    //获取歌单详情
    getSongList(e){
      let { song } = e.currentTarget.dataset;
      console.log(song);
      wx.navigateTo({
        url: '../geDan/geDan?musicid='+song.id,
      })
    
    },
    homeplay(e) {

        let index = e.currentTarget.dataset.index
        this.setData({
            songtop: index
        })

        let ids = this.data.songtop
        let lists = this.data.songbottom

        let playsongid = this.data.topListItem[ids].tracks[lists].id
        console.log(playsongid);
        wx.navigateTo({
            url: '../playsong/playsong?musicid=' + playsongid,
        })
    },
    homesong(e) {
        let list = e.currentTarget.dataset.list
            // console.log(list);
        this.setData({
            songbottom: list
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