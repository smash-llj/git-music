// pages/login/login.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: '',

    },
    //接受表单数据
    udata(e) {
        console.log(e);
        let type = e.currentTarget.dataset.type;
        this.setData({
            [type]: e.detail.value
        })
    },
    //登录
    async login() {
        let { phone, password } = this.data
        if (!phone) {
            wx.showToast({
                title: "手机号码输入不能为空",
                icon: 'none'
            })
            return;
        }
        //验证手机号码
        let phonemsg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!phonemsg.test(phone)) {
            wx.showToast({
                title: "手机号码错误",
                icon: 'none'
            })
            return;
        }
        //验证密码不能为空
        if (!password) {
            wx.showToast({
                title: "密码输入不能为空",
                icon: 'none'
            })
            return;
        }
        //验证密码格式
        let passwordmsg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/
        if (!passwordmsg.test(password)) {
            wx.showToast({
                title: "密码格式错误，密码必须由字母、数字组成，区分大小写 且密码长度为8-18位",
                icon: 'none'
            })
            return;
        }
        //后端验证
        let resultv = await request('/login/cellphone', { phone, password, islogin: true })
        if (resultv.code === 200) {
            wx.showToast({
                title: '登录成功',
                icon: 'success'
            })
            wx.setStorageSync('userInfo', JSON.stringify(resultv.profile))
                //登录成功后跳转页面
            wx.reLaunch({
                url: '../personal/personal',
            })
        } else if (resultv.code === 400) {
            wx.showToast({
                title: '手机号错误',
            })
        } else if (resultv.code === 502) {
            wx.showToast({
                title: '密码错误',
            })
        } else {
            wx.showToast({
                title: '错误，请重试',
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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