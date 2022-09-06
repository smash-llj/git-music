export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: 'https://music.163.com' + url,
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