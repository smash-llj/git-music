export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://551r0695e7.zicp.fun' + url,
            // url: 'http://localhost:3000' + url,
            data,
            method,
            header: {
                cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            success: (res) => {
                if (data.islogin) {
                    wx.setStorage({
                        key: 'cookies',
                        data: res.cookies
                    })
                }

                resolve(res.data)
            },
            fail: (err) => {
                console.log(err);
                reject(err)
            }
        })
    })
}