const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;

//单个点的样式
const mpMarker = {
  id: 0,
  latitude: 23.098994,
  longitude: 113.322520,
  joinCluster: true,
  type: 'single',
  title: '',
  width: 40,
  heigth: 32,
  iconPath: '../../icon/marker.png',
  callout: {
    content: '',
    fontSize: 14,
    color: '#000000',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 8,
    display: 'BYCLICK',
    textAlign: 'left'
  }
};
//标记点数组
var mpArray = [];
var mpArrayId = [];
var mpAllArray = [];
//对象数组
var objArray = [];
var objAllArray = [];
//内部对象
var myslefObj = {
  n: 0,
  id: 1,
  lat: 23.098994,
  lon: 113.322520,
  name: '',
  sex: '',
  age: 13,
  misstime: '',
};
Page({
  data: {
    markerId:-1,
    ifSwitch: true,
    markers:[],
    //mpPartArray:[],
    allMarkers: false, //切换数据判断
    drawer: false,
    CustomBar: app.globalData.CustomBar,
   
    scale: 15,
    addListShow: false,
    chooseCity: false,
    regionShow: {
      province: false,
      city: false,
      district: true
    },
    regionData: {},
    currentRegion: {
      province:'选择城市',
      city:'选择城市',
      district:'选择城市',
    },
    currentProvince: '选择城市',
    currentCity: '选择城市',
    currentDistrict: '选择城市',
    latitude: '25',
    longitude: '114',
    centerData: {},
    nearList: [],
    suggestion: [],
    selectedId: 0,
    defaultKeyword: '房产小区',
    keyword: '',
  },

  //详细信息转换
  tranform: function (outObj) {
    var sysObj = {};
    sysObj.id = outObj.properties.szry_id
    sysObj.lat = outObj.geometry.coordinates[1]
    sysObj.lon = outObj.geometry.coordinates[0]
    sysObj.name = outObj.properties.szry_name
    sysObj.age = outObj.properties.szsj_miss_age
    sysObj.misstime = outObj.properties.szsj_miss_time
    sysObj.sex = outObj.properties.szry_gender
    sysObj.detailcase = outObj.properties.szsj_detail_of_case
    sysObj.resultcase = outObj.properties.szsj_result_of_case
    return sysObj;
  },
  //未找回人员基本信息转换
  tranformBasic: function (outObj) {
    var sysObjBasic = {}
    sysObjBasic.id = outObj.szry_id
    sysObjBasic.lat = outObj.szsj_lat
    sysObjBasic.lon = outObj.szsj_lon
    sysObjBasic.name = outObj.szry_name
    sysObjBasic.age = outObj.szsj_miss_age
    sysObjBasic.sex = outObj.szry_gender
    sysObjBasic.misstime = outObj.szsj_miss_time
    return sysObjBasic
  },

  //将外部对象转成内部对象，再将对象转成标记
  outTransObj: function (outObj) {
    //1 将外部对象转成内部对象
    var myslefObj = this.tranform(outObj);
    return myslefObj;
  },
  outTransObjBasic: function (outObj) {
    var myslefObj = this.tranformBasic(outObj);
    return myslefObj;
  },

  objTransMarker: function (myslefObj) {
    //2 将对象转成标点
    //转换callout
    var myCallout = {
      content: '姓名:' + myslefObj.name + '\n走失年龄:' + myslefObj.age + '\n更多>>',
      fontSize: 14,
      color: '#000000',
      borderWidth: 2,
      borderColor: '#000000',
      borderRadius: 10,
      padding: 8,
      display: 'BYCLICK',
      textAlign: 'left'
    }
    //转换marker
    var myMarker = {
      //  id: myslefObj.id,
      id: myslefObj.n,
      width: 40,
      heigth: 32,
      latitude: myslefObj.lat,
      longitude: myslefObj.lon,
      iconPath: '../../icon/marker.png',
      //title: myslefObj.name,
      joinCluster: true,
      callout: myCallout,
    }
    return myMarker;
  },
  //用于消除标记的方法
  cancelCallout: function (myslefObj) {
    //转换marker
    var myMarker = {
      id: myslefObj.n,
      width: 40,
      heigth: 32,
      latitude: myslefObj.lat,
      longitude: myslefObj.lon,
      iconPath: '../../icon/marker.png',
    //  title: myslefObj.name,
      joinCluster: true,
      // callout: myCallout,
    }
    return myMarker;
  },
  //消除地图标记
  removeMarkers: function () {
    this.mapCtx.addMarkers({
      clear: true,
      markers: []
    })
  },
  //使用微信小程序Api来添加标记
  addMarkersCluster(mpArray) {
    var markers = [];
    markers = markers.concat(mpArray)
    this.mapCtx.addMarkers({
      markers,
      clear: false,
      success(res) {
        console.log('添加成功')
      },
      fail(res) {
        console.log('添加失败')
      },
      complete(res) {
        console.log('addMarkers', res)
      }
    })

  },
  //点击标记取消前一个标记的气泡
  markertap: function (e) {
  
  },
  //点击地图气泡消失
  //点击气泡跳转页面
  callouttap: function (res) {
    // console.log(res)
    var idx = res.detail.markerId;
    if (!this.data.allMarkers) {
      wx.navigateTo({
        // url: '../szxq/szxq?id='+ objArray[idx].id+'&name='+ objArray[idx].name+'&age='+objArray[idx].age+'&sex='+objArray[idx].sex+'&misstime='+objArray[idx].misstime+'&detailCase='+objArray[idx].detailcase+'&resultCase='+objArray[idx].resultcase,
        url: '../szxq/szxq?id=' + objArray[idx].id + '&name=' + objArray[idx].name + '&age=' + objArray[idx].age + '&sex=' + objArray[idx].sex + '&misstime=' + objArray[idx].misstime,
      })
    } else {
      wx.navigateTo({
        // url: '../szxq/szxq?id='+ objArray[idx].id+'&name='+ objArray[idx].name+'&age='+objArray[idx].age+'&sex='+objArray[idx].sex+'&misstime='+objArray[idx].misstime+'&detailCase='+objArray[idx].detailcase+'&resultCase='+objArray[idx].resultcase,
        url: '../szxq/szxq?id=' + objAllArray[idx].id + '&name=' + objAllArray[idx].name + '&age=' + objAllArray[idx].age + '&sex=' + objAllArray[idx].sex + '&misstime=' + objAllArray[idx].misstime,
      })
    }

  },
  /************************************************************* */

  //页面刷新加载
  onLoad: function (options) {
    // 实例化腾讯地图文档API核心类
    qqmapsdk = new QQMapWX({
      key: 'CQNBZ-XNU3W-LK5RZ-RR5RE-PHHQF-GWFIJ'
    });
    wx.showLoading({
      title: '加载数据请稍等',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    //实列化微信小程序地图API
    let self = this;
    this.mapCtx = wx.createMapContext('myMap')
    //监听地图事件，聚合簇的点击事件。
    this.mapCtx.on('markerClusterClick', res => {
      console.log('markerClusterClick', res)
    })

    //定位(可以写一个定位方法)
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        //console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //console.log(res)
            self.setData({
              latitude: latitude,
              longitude: longitude,
              currentRegion: res.result.address_component,
              keyword: self.data.defaultKeyword,
            })
            // 调用接口
            self.nearby_search();
          },
        });
      },
      fail(err) {
        wx.showLoading({
          title: '定位失败',
        })
        wx.hideLoading({});
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }
    });

    let latitude = self.data.latitude
    let longitude = self.data.longitude
    wx.request({
      url: 'https://japi.ilocstudio.top:8443/query',
      data: {
        method: 'locate',
        value: longitude + ',' + latitude,
      },
      method: 'GET', 
      success: function (res) {
        // console.log(res.data)
        for (var idb = 0; idb < res.data.length; idb++) {
          myslefObj = self.outTransObjBasic(res.data[idb]);
          var ID = res.data[idb].szry_id
          mpArrayId.push(ID)
          myslefObj.n = idb;
          objArray.push(myslefObj);
          var myMarker = self.objTransMarker(myslefObj);
          mpArray.push(myMarker);
        }
        self.addMarkersCluster(mpArray);
      },
      fail: function () {
        console.log('onLoad请求数据失败')
      },
      complete: function () {
        // complete
      }
    })
  },

  getLocation: function () {
    let self = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        //console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 15,
        })
      },
      fail(err) {
        wx.showLoading({
          title: '定位失败',
        })
        wx.hideLoading({});
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }
    });
  },
 
  onReady: function () {
     this.mapCtx = wx.createMapContext('myMap')
  },
  //点击搜索弹出和隐藏左侧列表
  showModal(e) {
    // console.log(e);
    let drawer;
    if (e.currentTarget.dataset.target == "true") {
      drawer = true;
    } else {
      drawer = false;
    }
    this.setData({
      drawer: drawer
    })
  },

  //切换数据按钮e
  clickSwitch: function (e) {
    console.log(e)
    if (!this.data.allMarkers) {
      this.setData({
        modalName: 'DrawerModalL'
      })
    } else {
      wx.showLoading({
        title: '正在切换数据'
      })
      this.removeMarkers()//移除全部
      this.addMarkersCluster(mpArray)//添加未找回
      wx.hideLoading()
      this.setData({
        allMarkers: false,
      })
    }
  },
  //切换对话框
  dialogSwitch: function (e) {
    console.log(e)
    this.hideModal()
    this.clickSwitch(e)
  },

  //对话框确定按钮--添加全部数据
  sureSwitch: function () {
    let that = this
    that.hideModal()
    wx.showLoading({
      title: '加载数据请稍等',
    })
    if (that.data.ifSwitch) {
      wx.request({
        url: 'https://japi.ilocstudio.top:8443/query?method=name&value',
        data: {

        },
        success: function (res) {
          // console.log(res);
          var obj = res.data;
          for (var id = 0; id < obj.data.length; id++) {
            myslefObj = that.outTransObj(obj.data[id]);
            myslefObj.n = id;
            objAllArray.push(myslefObj);
            var myMarker = that.objTransMarker(myslefObj);
            mpAllArray.push(myMarker);
          }
          console.log('下载完成')
          wx.hideLoading()
          that.removeMarkers()//移除未找回
          that.addMarkersCluster(mpAllArray)//添加全部
          console.log('sureSwitch添加成功')
          that.setData({
            allMarkers: true,
            ifSwitch: false
          })
        },
        fail: function (res) {
          console.log('与服务器连接失败')
          console.log(res)
        },
        complete: function (res) {
          console.log('交互完成')
        }
      })
    } else {
      wx.hideLoading()
      that.removeMarkers()//移除未找回
      that.addMarkersCluster(mpAllArray)//添加全部
      console.log('sureSwitch添加成功')
      that.setData({
        allMarkers: true,
      })
    }
  },
  //对话框1取消按钮
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //地图缩放按钮
  addScale() {
    var that = this;
    this.mapCtx.getScale({
      success: function (res) {
        // console.log(res)
        that.setData({
          scale: res.scale + 1
        })
      }
    })
  },
  minusScale() {
    var that = this;
    this.mapCtx.getScale({
      success: function (res) {
        //console.log(res)
        that.setData({
          scale: res.scale - 1
        })
      }
    })
  },

  //重新定位
  doLocation() {
    this.getLocation();
  },
  /**********************************************************************/
  //监听拖动地图，拖动结束根据中心点更新页面
  mapChange: function (e) {
    let self = this;
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      self.mapCtx.getCenterLocation({
        success: function (res) {
          self.setData({
            nearList: [],
            latitude: res.latitude,
            longitude: res.longitude,
          })
        }
      })
    }
  },
  //跳转搜索名字页面
  jumpSearch: function (e) {
    //var objarray = objArray;
    var model = JSON.stringify(objArray);
    wx.navigateTo({
      url: '../search/search?model=',
    })
  },
 
  onShow: function () { },
  //通过照片识别到地图上
  backfill_recognition: function () {
    var self = this
    var id = getApp().globalData.nameId2
    var infoList2 = getApp().globalData.infoList2
    console.log(infoList2)
    self.setData({
      latitude: infoList2.lat,
      longitude: infoList2.lon,
      scale: 16,
    })
    if ((self.data.allMarkers == false) && (mpArrayId.indexOf(infoList2.szry_id) == -1)) {
      //跳出提示框
      console.log('弹出框')
      this.setData({
        modalName: 'ModalL'
      })
    }
  },
  //通过名字搜索点击选择搜索结果
  backfill_name: function () {
    var self = this
    var infoList = getApp().globalData.infoList;
    // console.log(infoList);
    var id = getApp().globalData.nameId;
    console.log(id);
    console.log(infoList[id])
    for (var i = 0; i < infoList.length; i++) {
      if (i == id) {
        //  console.log(infoList[i])
        this.setData({
          latitude: infoList[i].latitude,
          longitude: infoList[i].longitude,
          scale: 16,
        });

        // return;
      }
    }
    if ((self.data.allMarkers == false) && (mpArrayId.indexOf(infoList[id].szry_id) == -1)) {
      //跳出提示框
      console.log('弹出框')
      this.setData({
        modalName: 'ModalL'
      })
    }
  },
  backfill_region:function(){
    var region = getApp().globalData.region;
    console.log(region)
    this.setData({
      latitude:region.latitude,
      longitude:region.longitude,
      scale:12
    })
    this.nearby_search()
  },
  //通过地址点击选择搜索结果
  backfill: function (e) {
    // var id = e.currentTarget.id;
    // let name = e.currentTarget.dataset.name;
    var suggestion = getApp().globalData.addrList;
    // console.log(infoList);
    var id = getApp().globalData.addrId;
    for (var i = 0; i < suggestion.length; i++) {
      if (i == id) {
        //console.log(this.data.suggestion[i])
        this.setData({
          centerData: suggestion[i],
         // addListShow: false,
          latitude: suggestion[i].latitude,
          longitude: suggestion[i].longitude,
          scale:15
        });
        this.nearby_search();
        return;
        //console.log(this.data.centerData)
      }
    }
  },

  //显示搜索列表
  // showAddList: function () {
  //   this.setData({
  //     addListShow: true
  //   })
  // },
  showAddList:function () {  
    let currentRegion = JSON.stringify(this.data.currentRegion)
    wx.navigateTo({
      url:'../location/location?longitude='+this.data.longitude+'&latitude='+this.data.latitude+'&currentRegion='+currentRegion+'&addListShow='+'true'+'&chooseCity='+'false',
    })
  },
  // 根据关键词搜索附近位置
  nearby_search: function () {
    var self = this;
    // 调用接口
    qqmapsdk.search({
      keyword: self.data.keyword, //搜索关键词
      //boundary: 'nearby(' + self.data.latitude + ', ' + self.data.longitude + ', 1000, 16)',
      location: self.data.latitude + ',' + self.data.longitude,
      page_size: 20,
      page_index: 1,
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        self.setData({
          selectedId: 0,
          centerData: sug[0],
          nearList: sug,
          suggestion: sug
        })
        //self.addMarker(sug[0]);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //打开选择省市区页面
  chooseCity: function () {
    let currentRegion = JSON.stringify(this.data.currentRegion)
    wx.navigateTo({
      url: '../location/location?addListShow='+'false'+'&chooseCity='+'true'+'&longitude='+this.data.longitude+'&latitude='+this.data.latitude+'&currentRegion='+currentRegion,
    })

  },
  
})