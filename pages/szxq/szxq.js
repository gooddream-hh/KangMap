
Page({

  /**
   * 页面的初始数据
   */
  data: {
    szry_name:'',
    szry_img_path:'',
    szry_misstime:'',
    szry_sex:'',
    szry_age:'',
    szry_resultCase:'',
    szry_detailCase:'',
    imgUrls: []
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this
  var szry_id = options.id;
   var szry_name = options.name;
   var szry_age = options.age;
   var szry_sex = options.sex;
   var szry_misstime = that.formatTime(options.misstime);
  wx.request({
    url: 'https://japi.ilocstudio.top:8443/query',
    data: {
      method:'name',
      value:szry_name,
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function(res){
    //  console.log(res)
    // console.log(res.data.data[0].properties.szry_pic_bytes)
     var szry_detailCase =res.data.data[0].properties.szsj_location_text+','+res.data.data[0].properties.szsj_detail_of_case
     var szry_resultCase = res.data.data[0].properties.szsj_result_of_case
     if (szry_resultCase=="[]") {
       szry_resultCase = "未找回"
     }
     var szry_pic_path= JSON.parse(res.data.data[0].properties.szry_pic_bytes)
     var arr_pic_path = that.data.imgUrls
     //console.log(szry_pic_path)
     for(let i=0;i<szry_pic_path.length;i++)
     {
       arr_pic_path[i] ='http://img.ilocstudio.top/mpgis/photos/'+szry_pic_path[i]
     }
     that.setData({
      szry_name:szry_name,
      szry_age:szry_age,
      szry_misstime:szry_misstime,
      szry_sex:szry_sex,
      szry_detailCase:szry_detailCase,
      szry_resultCase:szry_resultCase,
      imgUrls:arr_pic_path
     })
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
  },
  /**
   * 预览图片
   */
  previewImage(e) {
    const current = e.target.dataset.src  //获取当前点击的 图片 url
    console.log(current)
    wx.previewImage({
      current,
      urls: this.data.imgUrls
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