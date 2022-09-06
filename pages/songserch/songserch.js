// pages/songserch/songserch.js
import request from '../../utils/request';
import link from'../../utils/link';
let issong = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderdata: '',
        hotlist: [],
        serchsongdata: '',
        serchsonglistdata: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      
  
        //调用函数获取数据
        this.getplaceholdercontainer();
    },
    //获取搜索框内数据
    async getplaceholdercontainer() {
        let placeholdercontainerdata = await request('/search/default')
        let hotlistdata = await request('/search/hot/detail')
        this.setData({
            placeholderdata: placeholdercontainerdata.data.showKeyword,
            hotlist: hotlistdata.data
        })
    },
    //搜索
    changeinput(e) {
        //  let inputdata=e.detail.value
        //节流 防止用户输入频繁发送请求
        this.setData({
            serchsongdata: e.detail.value.trim()
        })
        if (issong) {
            return
        }
        issong = true
        this.searchld()
        setTimeout(() => {
            issong = false
        }, 1000)
    },
    //搜索内容展示函数
    async searchld() {
        //判断用户输入为空，则直接退出，不发送请求
        if (!this.data.serchsongdata) {
            //如果用户把搜索框里面的文字清除，那么搜索展示区消失
            this.setData({
                serchsonglistdata: [],
            })
            return;
        }
        //发送搜索请求
        let ssd = await link('/api/search/get', {s: this.data.serchsongdata,type:1,offset:0,limit:15 })
        this.setData({
            serchsonglistdata: ssd.result.songs
        })
        console.log(ssd);
    },
    //点击跳往播放页面播放歌曲
    playsong(e) {
        let index = e.currentTarget.dataset.index
        let playsongid = this.data.serchsonglistdata[index].id
        wx.navigateTo({
                url: '../playsong/playsong?musicid=' + playsongid,
            })
            //跳转的时候把 serchsongdata数据清空
        this.setData({
            serchsongdata: ''
        })
    },
    //用户点击热搜榜数据播放
    async serchld(e) {
        let ld = e.currentTarget.dataset.ld
        this.setData({
            serchsongdata: ld
        })
        let ssd = await request('/search', { keywords: ld, limit: 20 })
        this.setData({
            serchsonglistdata: ssd.result.songs,
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