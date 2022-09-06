// pages/playsong/playsong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
const appInstance = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isplay: false,
        musicid: '',
        authorId:0,
        songplaydata: [], //歌曲信息
        MoreList:[],
        musicLink: '',
        currentdata: '00:00',
        sumtime: '00:00',
        currentwidth: 0,
        lyric: [],//歌词
        lyricTime: 0,//歌词对应的时间
        currentLyric: "",//当前歌词对象
    },
    /**
     * 生命周期函数--监听页面加载
     */

    onLoad(options) {
 
      // 获取任意组件用户点击的歌曲id
        let musicid = options.musicid
        this.setData({
                musicid
            }) 
        //调用点击播放歌曲函数
          this.getplaySong(musicid)
          //调用歌曲歌词函数
          this.getsongfont(musicid)
        //页面切换时，判断音乐是否播放
        if (appInstance.gloabData.ismusicplay && appInstance.gloabData.musicplayid === musicid) {
            this.setData({
                isplay: true
            })
        }
      this.getBackgroundAudioManager = wx.getBackgroundAudioManager()
      //歌曲播放的时候
      this.getBackgroundAudioManager.onPlay(() => {
            this.setData({
                    isplay: true //判断是否开始播放
                })
                //更改全局配置
            appInstance.gloabData.ismusicply = true
            appInstance.gloabData.musicplayid = musicid
           

        })
        //歌曲暂停的时候
       this.getBackgroundAudioManager.onPause(() => {
                this.setData({
                        isplay: false //判断是否开始播放
                    })
                    //更改全局配置
                appInstance.gloabData.ismusicply = false
            })
         //实时监听音乐播放函数
      this.getBackgroundAudioManager.onTimeUpdate(() => {
             this. playsongjindu()
            })
            
          //音乐播放结束
      this.getBackgroundAudioManager.onEnded(() => {
          PubSub.publish('switchType', 'after')
                //接收来自recommand发来的消息
            PubSub.subscribe('musicid', (msg, musicid) => {
                //调用获取歌曲信息函数，把下一首歌曲id传入，获取下一首歌曲信息
                this.getplaySong(musicid)
                    //调用播放函数 点击下一首的时候自动播放
                this.playsongaction(true, musicid)
                    //取消订阅
                PubSub.unsubscribe('musicid')
                //发布消息给recommand 
      
            })
            this.setData({
                currentwidth: 0,
                currentdata: 0
            })
            //切歌
      PubSub.publish('switchMusic','next');

      //重置所有数据
      this.setData({
        currentWidth: 0,
        currentTime: '00:00',
        lyric: [],
        lyricTime: 0,
        isPlay: false,
        currentLyric: ""
      })
         //调用点击播放歌曲函数
         this.getplaySong(musicid)
         //调用歌曲歌词函数
         this.getsongfont(musicid)
         //自动播放歌曲
       this. playsongs(true)
        
        })
        //页面进入自动播放歌曲
        this.playsongs()
    },

     

    //点击按钮播放歌曲
       playsongs() {
          //点击的时候将isplay取反
          let isplay = !this.data.isplay
          this.setData({
            isplay
          })
          console.log(isplay);
              //将data里面的Musicid,musicLink获取出来
          let { musicid, musicLink } = this.data
              //用户点击播放时，全局配置的相关属性更改
          appInstance.gloabData.ismusicplay = isplay
              //调用播放歌曲函数
          this.playsongaction(isplay, musicid, musicLink)

       },
      //点击实现切换下一首或者上一首功能
      nextplaysong(e) {
          //判断是上一首还是下一首
          let songtype = e.currentTarget.id
              //切换时上一首歌曲暂停
          this.getBackgroundAudioManager.stop()
          PubSub.subscribe('musicid', (msg, musicid) => {
                  //调用获取歌曲信息函数，把下一首歌曲id传入，获取下一首歌曲信息
                  this.getplaySong(musicid)
                      //调用播放函数 点击下一首的时候自动播放
                  this.playsongaction(true, musicid)
                      //取消订阅
                  PubSub.unsubscribe('musicid')
              })
              //发布消息数据给remcomdend
          PubSub.publish('switchType', songtype)
      },

    //获取播放界面歌曲信息封装函数
      async getplaySong(musicid) {
        let playSongDatas = await request('/song/detail', { ids: musicid })
        console.log(playSongDatas);
        let dayjs = require('dayjs')
        let sumtime = dayjs(playSongDatas.songs[0].dt).format('mm:ss')
        this.setData({
            songplaydata: playSongDatas.songs[0],
            sumtime,
            authorId:playSongDatas.songs[0].ar[0].id
        })
         //获取歌手更多热门歌曲
         this.getMoreList()
    },
      //播放歌曲
      async playsongaction(isplay, musicid, musicLink) {
          // 全局调用 否则再有些作用域没有这个实例
          if (isplay) {
            console.log('1111'+isplay);
              //做性能优化，用户播放暂停再播放就不用再次发送请求获取数据
              if (!musicLink) {
                  //获取音乐播放链接路径
                  let musicplayData = await request('/song/url', { id: musicid })
                  console.log(musicplayData);
                  musicLink = musicplayData.data[0].url
                  this.setData({
                      musicLink
                  })
                
              }
              this.getBackgroundAudioManager.src = musicLink
                  //必须补充title这是必填选项
              this.getBackgroundAudioManager.title = this.data.songplaydata.name
          } else {
              //暂停音乐
              this.getBackgroundAudioManager.pause()
          }
      
      },
       //获取歌手更多热门歌曲
     async getMoreList(){
      let MoreList=await request('/artists',{id:this.data.authorId})
      this.setData({
        MoreList:MoreList.hotSongs.splice(0,10)
      })
    },
    //点击歌手更多热门歌曲
     async playMore(e){
      let { more } = e.currentTarget.dataset;
      const MoreId=more.id
      console.log(more);
      console.log(MoreId);
      
     let MoreDate=await request('/song/url', { id: MoreId })
     this.setData({
       musicLink:MoreDate.data[0].url
     })
       //调用点击播放歌曲函数
       this.getplaySong(MoreId)
       //调用歌曲歌词函数
       this.getsongfont(MoreId)
       //将isplay恢复默认值
       this.setData({
        isplay:false 
       })
       //调用播放
       this.playsongs()
    },

     //歌曲播放进度函数
     playsongjindu(){
      let dayjs = require('dayjs')
                    //getBackgroundAudioManager.currentTime音乐播放的毫秒数
                     //getBackgroundAudioManager.currentTime已经播放的时长
                    //getBackgroundAudioManager.duration总时长
                 let lyricTime = Math.ceil(this.getBackgroundAudioManager.currentTime); 
                let currentdata = dayjs(this.getBackgroundAudioManager.currentTime * 1000).format('mm:ss')
                let currentwidth = this.getBackgroundAudioManager.currentTime / this.getBackgroundAudioManager.duration * 225
                this.setData({
                  lyricTime,
                    currentdata,
                    currentwidth
                })
                 //获取当前歌词
    this.getCurrentLyric();
    },
    // 获取歌词
      async getsongfont(musicid){
        let lyricData= await request('/lyric', { id:musicid })
        
        this.formatLyric(lyricData.lrc.lyric);                
        },
      //歌词滚动函数
      formatLyric(text) {
        let result = [];
        let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
        let row = arr.length; //获取歌词行数
        for (let i = 0; i < row; i++) {
          let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
          let temp_arr = temp_row.split("]");//我们可以通过“]”对时间和文本进行分离
          let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
          //再对剩下的歌词时间进行处理
          temp_arr.forEach(element => {
            let obj = {};
            let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
            let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
            obj.time = s;
            obj.text = text;
            result.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
          });
        }
        result.sort(this.sortRule) //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
        this.setData({
          lyric: result
        })
      },
      sortRule(a, b) { //设置一下排序规则
        return a.time - b.time;
      },
  
    //控制歌词播放
      getCurrentLyric(){
        let j;
        for(j=0; j<this.data.lyric.length-1; j++){
          if(this.data.lyricTime == this.data.lyric[j].time){
            this.setData({
              currentLyric : this.data.lyric[j].text
            })
          }
        }
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