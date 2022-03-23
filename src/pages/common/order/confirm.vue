<template>
    <view>
      <u-toast ref="uToast" />
      <faasmall-navbar title="确认订单" :is-back="true"></faasmall-navbar>
      <view class="container">
        <view style="background: #FFFFFF;border-radius: 20rpx;padding: 20rpx;margin-top: 10rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;" >
          <view v-if="!addressData.id" class="row-center-between" style="width: 100%;align-items: center;" @tap="jump('/pages/common/address/list',{type:'select'})" >
            <view>
              <text class="iconfont icon-dizhi1"></text>
              <text class="ml-1">请选择收货地址</text>
            </view>
            <view class="list-item-right">
              <text class="iconfont icon-page-next1"></text>
            </view>
          </view>
          <view v-else style="display: flex;justify-content:space-between;width: 100%;padding-left: 20rpx;align-items: center;">
            <view class="" >
              <text class="iconfont icon-dizhi1"></text>
            </view>
            <view style="width: 100%;padding: 0 20rpx">
              <view style="display: flex;flex-direction: column;justify-content: space-between">
                <view class="">
                  <text>{{ addressData.consignee }}</text>
                  <text class="ml-2">{{ addressData.mobile }}</text>
                  <text v-show="addressData.status === 1">默认</text>
                </view>
                <view class="">
                  <view class="">{{ addressData.province }}{{ addressData.city }}{{ addressData.district }}{{ addressData.address }}</view>
                  <text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;"></text>
                </view>
              </view>
            </view>
            <view class="">
              <text class="iconfont icon-page-next1"></text>
            </view>
          </view>
          <u-image style="width: 100%; height: 4rpx"  src="https://qmxq.oss-cn-hangzhou.aliyuncs.com/address-background-bar.png"></u-image>
        </view>
        <view class="flex flex-column mt-2" style="background: #FFFFFF;padding: 20rpx 20rpx;border-radius: 20rpx">
          <view><text>商品信息</text></view>
          <scroll-view  scroll-y="true" style="height: 600rpx" class="scroll-Y" scroll-left="120">
            <view style="display: flex;flex-direction: row" class="mt-2" v-for="(item, index) in orderInfo.goodList" :key="index">
              <view>
                <u-image class="good-img" :src="item.thumbnail" width="90px" height="90px"></u-image>
              </view>
              <view style="flex: 1;padding: 10rpx" class="ml-1">
                <view><text>{{item.goodName}}</text></view>
                <view class="mt-1"><text>{{item.goodSkuName}}</text></view>
                <view class="mt-1" style="display: flex;flex-direction: row;justify-content: space-between;">
                  <view>
                    ￥{{item.goodSellingPrice}}
                  </view>
                  <view>
                    <vk-data-input-number-box
                        v-model="item.goodNumber" :min="1" :max="item.stocks" :step="1" :positive-integer="true">
                    </vk-data-input-number-box>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="list-wrap mt-1" style="border-radius: 20rpx">
          <view class="list-item list-item-border-bottom">
            <view class="list-item-left">
              <text> 商品总额</text>
            </view>
            <view class="list-item-right">
              <view class="rightText">
                ￥{{orderInfo.goodAmount}}
              </view>
            </view>
          </view>
          <view class="list-item list-item-border-bottom">
            <view class="list-item-left">
              运费
            </view>
            <view class="list-item-right">
              <view class="rightText">
                ￥0
              </view>
            </view>
          </view>
          <view class="list-item list-item-border-bottom" @click="jump('/pages/common/coupon/list')">
            <view class="list-item-left">
              优惠卷
            </view>
            <view class="list-item-right">
              <view class="flex justify-end align-center">
                <text>暂无可用优惠卷</text>
                <text class="iconfont icon-page-next1"></text>
              </view>
            </view>
          </view>
        </view>
        <view class="list-wrap mt-1" style="border-radius: 20rpx">
          <view class="list-item" @tap="doMessage">
            <view><text>买家留言</text></view>
            <view class="flex-1">
              <view class="flex justify-end align-center">
                <text class="iconfont icon-page-next1"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="height:100rpx;width:100%;background: #FFFFFF;position: absolute;bottom: 0rpx;display: flex;justify-content: center">
          <view class="flex justify-between align-center" style="width: 90%">
            <view style="display: flex">
              <view>
                共{{orderInfo.quantity}}件
              </view>
              <view class="ml-1">
                实付金额￥{{orderInfo.payAmount}}
              </view>
            </view>
            <view>
              <u-button type="primary" @click="submitOrders" :disabled="isDisabled" shape="circle">提交订单</u-button>
            </view>
          </view>
      </view>
    </view>
</template>

<script>
import vkDataInputNumberBox from '../../../components/vk-data-input-number-box/vk-data-input-number-box';
import {getPre, submitOrders} from "@/faasmall/api/order";
import {getDefaultAddress} from "@/faasmall/api/address";
import {
  getSystemInfo,
  isEmpty,
  isNotEmpty
} from "@/faasmall/utils/faasmall";
import {getMemeberCouponList} from "@/faasmall/api/member";
export default {
  components:{
    vkDataInputNumberBox
  },
  name: "confirm",
  data(){
    return{
      isDisabled: false, //提交
      //商品列表
      goodList:[],
      //订单信息
      orderInfo:{},
      //留言
      message:'',
      //商品总计
      totalNum:0,
      //来源
      source:'',
      //订单类型
      type:1,
      //优惠卷ID
      couponId:'',
      //平台
      platform: getSystemInfo(),
      //地址
      addressData:{},
      //优惠卷列表
      couponList:[],
    }
  },
  onLoad(options){
    this.goodList = this.$Route.query.goodList;
    this.source = this.$Route.query.source;
    this.type = this.$Route.query.type ? 1: this.$Route.query.type;
    debugger
    this.init();
  },
  onShow(){
    // 收货地址
    uni.$on('SHIPPING_ADDRESS', res => {
      if (res.addressData) {
        this.addressData = JSON.parse(res.addressData);
      }
      console.log(this.addressData);
      this.getPre();
      res.addressData && uni.$off('SHIPPING_ADDRESS');
    });
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    if(isNotEmpty(currPage.message)){
      let res = currPage.message;
      console.log(res)//为传过来的值
      this.message = res;
    }
  },
  methods:{
    // 初始化
    init() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      });
      return Promise.all([this.getDefaultAddress(), this.getCouponList()]).then(() => {
        uni.hideLoading();
      });
    },
    // 路由跳转
    jump(path, parmas) {
      this.$Router.push({
        path: path,
        query: parmas
      });
    },
    //默认收货地址
    getDefaultAddress(){
      getDefaultAddress().then((res)=>{
        debugger
        if (res.code === 0 && res.data) {
          this.addressData = res.data;
        }
        this.getPre();
      }).catch(err=>{
        console.error(err)
      })
    },
    getCouponList(){
      var goodIds = [];
      this.goodList.forEach(good=>{
        goodIds.push(good.goodId);
      })
      getMemeberCouponList({goodIds:goodIds}).then((res)=>{
        this.couponList = res.data;
      }).catch(error=>{
        console.error(error)
      })
    },
    //获取订单信息
    getPre(){
      getPre({
        goodSku:this.goodList,
        couponId: this.couponId,
        addressId:this.addressData.id,
        source:this.source,
        platform:this.platform,
        type: this.type
      }).then((res)=>{
        this.orderInfo = res.data;
      }).catch(error=>{
        console.error(error)
      })
    },
    doMessage(){
      uni.navigateTo({
        url:'pages/common/order/leave?message=' + encodeURIComponent(JSON.stringify(this.goodsList.message))
      })
    },
    submitOrders(){
      let that = this;
      if(this.$isEmpty(this.addressData.id)){
        this.$refs.uToast.show({
          title: '收货地址不能为空',
          type: 'error',
        })
        return;
      }
      that.isDisabled = true;
      submitOrders({
        goodSku:this.goodList,
        couponId: this.couponId,
        addressId:this.addressData.id,
        message:this.message,
        source:this.source,
        platform:this.platform,
        type: this.type
      }).then((res)=>{
        that.isDisabled = false;
        if(res.code === 0){
          if(this.$isNotEmpty(res.data.error)){
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: "none",
            });
            return;
          }
          if(res.data.pay){
            this.$Router.replace({
              path: res.data.pay ? `/pages/common/pay/method` : `/pages/common/pay/result`,
              query: {
                orderId: res.data.id,
                payState: res.data.pay ? 'pay':'success'
              }
            });
          }
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(error=>{
        console.error(error)
      })
    },
    addAddress(){
      uni.navigateTo({
        url: '/pages/common/address/list'
      });
    }
  }
}
</script>

<style scoped>

</style>