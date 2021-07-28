// pages/location/location.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addListShow: true,
    chooseCity: false,
    latitude: '',
    longitude: '',
    suggestion: [],
    regionData: {},
    regionShow: {
      province: false,
      city: false,
      district: true
    },
    currentRegion: {
      province: '选择城市',
      city: '选择城市',
      district: '选择城市',
    },
    currentProvince: '选择城市',
    currentCity: '选择城市',
    currentDistrict: '选择城市',
    selectedId: 0,
    defaultKeyword: '房产小区',
    keyword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'CQNBZ-XNU3W-LK5RZ-RR5RE-PHHQF-GWFIJ'
    });
    if(options.addListShow=="true"&&options.chooseCity=="false"){
      console.log(options)
      let currentRegion = JSON.parse(options.currentRegion)
      this.setData({
        latitude: options.latitude,
        longitude: options.longitude,
        currentRegion: currentRegion,
      })
    }else{
      let currentRegion = JSON.parse(options.currentRegion)
      this.setData({
        latitude: options.latitude,
        longitude: options.longitude,
        currentRegion: currentRegion,
        addListShow:false,
        chooseCity:true,
      })
      this.chooseCity();
    }
  },

  //根据关键词搜索匹配位置
  getsuggest: function (e) {
    //console.log(e)
    var _this = this;
    var keyword = e.detail.value;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      location: _this.data.latitude + ',' + _this.data.longitude,
      page_size: 20,
      page_index: 1,
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) { //搜索成功后的回调
       // console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].province,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          // nearList: sug,
          keyword: keyword,
          //scale: 15
        });
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //点击选择搜索结果
  backfill: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    getApp().globalData.addrId = id;
    getApp().globalData.addrList = this.data.suggestion
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        console.log(this.data.suggestion[i])
        wx.switchTab({
          url: '../index/index',
          success: function (res) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.backfill();

            console.log('跳转页面成功');//success
          },
          fail: function () {
            console.log('跳转页面失败');// fail
          },
          complete: function () {
            console.log('跳转页面完成');// complete
          }
        })
      }
    }
  },
  //整理目前选择省市区的省市区列表
  getRegionData: function () {
    let self = this;
    //调用获取城市列表接口
    qqmapsdk.getCityList({
      success: function (res) { //成功后的回调
        //console.log(res)
        let provinceArr = res.result[0];
        let cityArr = [];
        let districtArr = [];
        for (var i = 0; i < provinceArr.length; i++) {
          var name = provinceArr[i].fullname;
          if (self.data.currentRegion.province == name) {
            if (name == '北京市' || name == '天津市' || name == '上海市' || name == '重庆市') {
              cityArr.push(provinceArr[i])
            } else {
              qqmapsdk.getDistrictByCityId({
                // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
                id: provinceArr[i].id,
                success: function (res) { //成功后的回调
                  //console.log(res);
                  cityArr = res.result[0];
                  self.setData({
                    regionData: {
                      province: provinceArr,
                      city: cityArr,
                      district: districtArr
                    }
                  })
                },
                fail: function (error) {
                  //console.error(error);
                },
                complete: function (res) {
                  //console.log(res);
                }
              });
            }
          }
        }
        for (var i = 0; i < res.result[1].length; i++) {
          var name = res.result[1][i].fullname;
          if (self.data.currentRegion.city == name) {
            qqmapsdk.getDistrictByCityId({
              // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
              id: res.result[1][i].id,
              success: function (res) { //成功后的回调
                //console.log(res);
                districtArr = res.result[0];
                self.setData({
                  regionData: {
                    province: provinceArr,
                    city: cityArr,
                    district: districtArr
                  }
                })
              },
              fail: function (error) {
                //console.error(error);
              },
              complete: function (res) {
                //console.log(res);
              }
            });
          }
        }
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //打开选择省市区页面
  chooseCity: function () {
    let self = this;
    self.getRegionData();
    self.setData({
      addListShow:false,
      chooseCity: true,
      regionShow: {
        province: false,
        city: false,
        district: true
      },
      currentProvince: self.data.currentRegion.province,
      currentCity: self.data.currentRegion.city,
      currentDistrict: self.data.currentRegion.district,
    })
  },
  showProvince: function () {
    this.setData({
      regionShow: {
        province: true,
        city: false,
        district: false
      }
    })
  },
  //选择城市
  showCity: function () {
    this.setData({
      regionShow: {
        province: false,
        city: true,
        district: false
      }
    })
  },
  //选择地区
  showDistrict: function () {
    this.setData({
      regionShow: {
        province: false,
        city: false,
        district: true
      }
    })
  },
  //选择省之后操作
  selectProvince: function (e) {
    //console.log(e)
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    self.setData({
      currentProvince: name,
      currentCity: '请选择城市',
    })
    if (name == '北京市' || name == '天津市' || name == '上海市' || name == '重庆市') {
      var provinceArr = self.data.regionData.province;
      var cityArr = [];
      for (var i = 0; i < provinceArr.length; i++) {
        if (provinceArr[i].fullname == name) {
          cityArr.push(provinceArr[i])
          self.setData({
            regionData: {
              province: self.data.regionData.province,
              city: cityArr,
              district: self.data.regionData.district
            }
          })
          self.showCity();
          return;
        }
      }
    } else {
      let bj = self.data.regionShow;
      self.getById(id, name, bj)
    }
  },
  //选择城市之后操作
  selectCity: function (e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    self.setData({
      currentCity: name,
      currentDistrict: '请选择城市',
    })
    let bj = self.data.regionShow;
    self.getById(id, name, bj)
  },
  //选择区县之后操作
  selectDistrict: function (e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let latitude = e.currentTarget.dataset.latitude;
    let longitude = e.currentTarget.dataset.longitude;
    let region={
      latitude:latitude,
      longitude:longitude
    }   
    self.setData({
      currentDistrict: name,
      latitude: latitude,
      longitude: longitude,
      scale: 15,
      currentRegion: {
        province: self.data.currentProvince,
        city: self.data.currentCity,
        district: name
      },
      // chooseCity: false,
      keyword: self.data.defaultKeyword
    })
    getApp().globalData.region = region;
    console.log(region)
    wx.switchTab({
      url: '../index/index',
      success: function(res){
        // success
        var page = getCurrentPages().pop();
        if(page == undefined || page == null)return;
        page.backfill_region();
      
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    //self.nearby_search();
  },
  
  //根据选择省市加载市区列表
  getById: function (id, name, bj) {
    let self = this;
    qqmapsdk.getDistrictByCityId({
      // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
      id: id, //对应接口getCityList返回数据的Id，如：北京是'110000'
      success: function (res) { //成功后的回调
        //console.log(res);
        if (bj.province) {
          self.setData({
            regionData: {
              province: self.data.regionData.province,
              city: res.result[0],
              district: self.data.regionData.district
            }
          })
          self.showCity();
        } else if (bj.city) {
          self.setData({
            regionData: {
              province: self.data.regionData.province,
              city: self.data.regionData.city,
              district: res.result[0]
            }
          })
          self.showDistrict();
        } else {
          self.setData({
            chooseCity: false,
          })
        }
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //返回上一页或关闭搜索页面
  back1: function () {
    wx.navigateBack({
      delta: 1
    })
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