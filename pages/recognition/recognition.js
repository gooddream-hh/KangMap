// pages/recognition/recognition.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:'',
    id:'',
    photos: "",
    img_arr:[],
    //显示结果的数组
    arr:[
      {
        name:"",
        similarity:""
      },
      {
        name:"",
        similarity:""
      },
    ],
    //弹窗上信息的数组
    infoArr:[],
    latlonArr:[],
    recognition:false,
    result:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //选择图片的方法
  chooseImg: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      
        //显示
        that.setData({
          photos : tempFilePaths,
        });
      }
    })
  },
    /**
   * 上传照片
   */
  uploadImg: function(e) {
    var that = this
    wx.showLoading({
      title:'识别中请稍等',
      mask:true
    })
    wx.uploadFile({
      //https://japi.ilocstudio.top:8443/UpIMGServlet
      url: 'https://japi.ilocstudio.top:8443/upload', 
      filePath:that.data.photos[0],
      name: 'file',
      header:{
        "Content-Type":"multipart/form-data"
      },
      formData: {
        'user': 'abc'
      },
      success: function (res) {
        var data1 = res.data
       // console.log(data1)
        //详细信息数组
        var informationArr = []
        //简单信息数组
        var showArr = []
        //经纬度数组
        var latlonArrCopy = []
        var showObj ={
          name:'',
          similarity:''
        }
        var informationObj= {
          name:'',
          pic_name:'',
          sz_time:'',
          sz_case:'',
        }
        if(data1.length>20){
          var data2 = JSON.parse(data1)
          //console.log(data2)
          for(let i=0; i<2;i++){
              var infoData = data2[i].data[0]
              var misstime =that.formatTime(infoData.properties.szsj_miss_time)
            //  console.log(infoData)
              latlonArrCopy.push({
                szry_id:infoData.properties.szry_id,
                lon:infoData.geometry.coordinates[0],
                lat:infoData.geometry.coordinates[1],
              })              
              showArr.push({
                name:infoData.properties.szry_name,
                similarity:data2[i].similarity
              })
              informationArr.push({
                name:infoData.properties.szry_name,
                pic_name:data2[i].pic_name+'.jpg',
                pic_path:'http://img.ilocstudio.top/mpgis/photos/',
               // sz_time:infoData.properties.szsj_miss_time,
                sz_time:misstime,
                sz_case:infoData.properties.szsj_detail_of_case
              })
          }
           //将显示结果为true
          that.setData({
           latlonArr:latlonArrCopy,
           infoArr:informationArr,
           arr:showArr,
           recognition:true,
           result:true,
         })
        }
        else{
            that.setData({
              result:false,
              recognition:true
            })
        } 
    },
      fail:function(res){
        console.log(res)
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  /**
   *跳转到index页面
   */
  backfill:function () {
    var that = this
    var id = that.data.id
    getApp().globalData.nameId2 = id;
    getApp().globalData.infoList2=that.data.latlonArr[id]
    wx.switchTab({
      url: '../index/index',
      success: function(res){
        var page = getCurrentPages().pop();
        if(page == undefined || page == null)return;
        page.backfill_recognition();   
      },
      fail: function() {
        console.log('跳转失败')
      },
      complete: function() {
        // complete
      }
    })
  },

  /** 
   * 格式化时间
   */
   formatTime:function (misstime) {
    var sz_misstime = misstime.slice(0,10)
    return sz_misstime;
  },

  /**
   * 按钮点击事件 //点击结果弹出详细信息
   */
  popModal: function (e) {
    console.log(e)
    var id  = e.currentTarget.id
     this.setData({
       showModal: e.currentTarget.id,
       id:e.currentTarget.id
     })
   },
   /**
    * 隐藏
    */
   hidepopup: function () {
     this.setData({
       showModal: ""
     });
   },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})