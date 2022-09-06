// pages/recommand/recommand.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        days: '',
        months: '',
        recommendList: [],
        index: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
     
        //判断用户是否登录
        let userinfo = wx.getStorageSync('userInfo')
        if (!userinfo) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                //提示后跳转到用户登录页面
                success: () => {
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })
                }
            })

        }

        //获取当前月份和天数
        this.setData({
            days: new Date().getDate(),
            months: new Date().getMonth() + 1
        })
        this.getrecommendData()
            //订阅接受来自playsong发送的数据
        PubSub.subscribe('switchType', (msg, songtype) => {
            let { recommendList, index } = this.data
            console.log(index);
            if (songtype === 'before') {
                (index === 0) && (index = recommendList.length)
                index -= 1
            } else {
                (index === recommendList.length - 1) && (index = -1)
                index += 1
            }
            this.setData({
                index
            })

            let musicid = recommendList[index].id

            //将得到的音乐id传给playsog页面
            PubSub.publish('musicid', musicid)
        })
    },
    //获取歌曲数据
    async getrecommendData() {
        let songList = await request('/recommend/songs')
        console.log(songList);
        this.setData({
            recommendList: songList.data.dailySongs
        })


    },
    playaction(e) {
        //接收来自页面发送来的数据
        let { song, index } = e.currentTarget.dataset;

        //将拿到的数据更新到全局data下
        this.setData({
            index
        })
        wx.navigateTo({
            url: '../playsong/playsong?musicid=' + song.id,
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