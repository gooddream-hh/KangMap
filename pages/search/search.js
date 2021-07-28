// pages/search/search.js

Page({
  data: {
    list:[],
    namelist:[],
    suggestion:[],
    infoList:[],
    keyword:'',
    haveData:true,
  },
 
  //根据关键词搜索匹配信息
  getsuggest:function(e){
   // console.log(e);
    var _this = this;
    var keyword = e.detail.value;
    _this.setData({
      keyword: keyword,
    }) 
   // this.getSearchResult(keyword) 
  },
  //点击搜索信息
  handleSearch:function(){
    var keyword =this.data.keyword;
    // console.log(keyword);
    if(keyword != ""){
      this.getSearchResult(keyword)
    }
  },
  
  onLoad:function(options) {
    //this.getSearchResult("");
  },
  getSearchResult:function(keyword){
    var _this = this;
    var sug =[];
    wx.showLoading({
      title: '正在搜索',
    })
    wx.request({
      url:  'https://japi.ilocstudio.top:8443/query',
      data: {
        method:'name',
        value:keyword,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res)
        wx.hideLoading()
        if(res.data.count!=0){
          for(let i=0;i<res.data.count;i++) {
              sug.push({
                title:res.data.data[i].properties.szry_name,
                id:res.data.data[i].properties.szry_id,
                addr:res.data.data[i].properties.szsj_location_text,
                sz_time:res.data.data[i].properties.szsj_miss_time,
                latitude:res.data.data[i].geometry.coordinates[1],
                longitude:res.data.data[i].geometry.coordinates[0],
              });                
          }
          _this.setData({//设置infoList属性
            infoList:sug,
            haveData:true,
          });
        }else{
          _this.setData({
            haveData:false,
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  //点击选择搜索结果
  backfill:function(e){
    console.log(e);
    var id = e.currentTarget.id;
    getApp().globalData.nameId = id;
    getApp().globalData.infoList=this.data.infoList
    for(var i=0; i<this.data.infoList.length;i++){
      if(i==id){
        console.log(this.data.infoList[i])
        wx.switchTab({
          url:'../index/index',
          success: function(res){
            var page = getCurrentPages().pop();
            if (page == undefined || page == null)return;
            page.backfill_name();

            console.log('跳转页面成功');//success
          },
          fail: function() {
            console.log('跳转页面失败');// fail
          },
          complete: function() {
            console.log('跳转页面完成');// complete
          }
        })
      }
    }
  },

})