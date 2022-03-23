<template>
    <view>
          <view class="user-info-top">
              <view style="display: flex;justify-content: flex-end;align-items: center;padding: 20rpx">
                <text @tap="$Router.push('/pages/common/tool/setting')" class="iconfont icon-xl icon-xitongpeizhi" style="color: #FFFFFF"></text>
<!--                <text @tap="$Router.push('/pages/common/tool/message')" class="iconfont icon-xl icon-xiaoxi4 ml-1" style="color: #FFFFFF"></text>-->
              </view>
              <view style="display:flex;padding: 0 20rpx;display: flex">
                <view @tap="$Router.push('/pages/common/member/info')"><u-image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle" width="120rpx" height="120rpx"></u-image></view>
                <view @tap="$Router.push('/pages/common/member/info')" v-if="isLogin" style="width: 100%;padding: 20rpx;display: flex;justify-content: flex-start;align-items: center">
                  <text>faasmall</text>
                </view>
                <view v-else style="width: 100%;padding: 20rpx">
                  <text @tap="login">点击登陆</text>
                </view>
              </view>
              <view style="display: flex;justify-content: space-between;padding: 20rpx">
                <view @tap="$Router.push('/pages/common/tool/collect')" class="flex flex-column align-center" style="width: 100%">
                  <text v-if="isLogin">{{userInfo.collect}}</text>
                  <text v-else>*</text>
                  <text>我的收藏</text>
                </view>
                <view style="width: 1px;height: 60%;padding: 20px 0px;background: rgb(255, 255, 255);"></view>
                <view @tap="$Router.push('/pages/common/tool/footprint')" class="flex flex-column align-center" style="width: 100%">
                  <text v-if="isLogin">{{userInfo.footprint}}</text>
                  <text v-else>*</text>
                  <text>我的足迹</text>
                </view>
              </view>
          </view>
          <view style="padding: 0 20rpx;margin-top: 40rpx">
            <view  style="margin-top: 20rpx;background: #FFFFFF;height: 260rpx;">
              <view @tap="$Router.push('/pages/common/order/list')" class="padding: 20rpx;">
                <view style="display: flex;justify-content: space-between;align-items: center;padding: 10px;border-bottom: 1px dashed #D1D1D1"><text>我的订单</text><text class="iconfont icon-page-next1"></text></view>
              </view>
              <view style="display: flex;justify-content: space-between;align-items: center;margin-top: 20rpx;padding: 20rpx;">
                <view @tap="$Router.push({path: '/pages/common/order/list',query:{tabCurrentIndex:0}})" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <view><text class="iconfont icon-xl icon-daifukan"></text></view>
                  <view>待付款</view>
                </view>
                <view @tap="$Router.push({path: '/pages/common/order/list',query:{tabCurrentIndex:1}})" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <view><text class="iconfont icon-xl icon-daifahuo"></text></view>
                  <view>待付款</view>
                </view>
                <view @tap="$Router.push({path: '/pages/common/order/list',query:{tabCurrentIndex:2}})" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <view><text class="iconfont icon-xl icon-daishouhuo"></text></view>
                  <view>待发货</view>
                </view>
                <view @tap="$Router.push({path: '/pages/common/order/list',query:{tabCurrentIndex:3}})" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <view><text class="iconfont icon-xl icon-pingjia"></text></view>
                  <view>待评价</view>
                </view>
                <view @tap="$Router.push('/pages/common/order/after_sale')" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <view><text class="iconfont icon-xl icon-shouhou"></text></view>
                  <view>待售后</view>
                </view>
              </view>
            </view>
            <view style="margin-top: 20rpx;background: #FFFFFF;height: 400rpx;">
              <view class="padding: 20rpx;">
                <view style="display: flex;justify-content: space-between;align-items: center;padding: 10px;border-bottom: 1px dashed #D1D1D1"><text>常用功能</text></view>
              </view>
              <view style="padding: 20rpx;">
                <view style="display: flex;align-items: center;margin-top: 20rpx;flex-wrap: wrap;">
                  <view @tap="$Router.push('/pages/common/address/list')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-dizhi1"></text></view>
                      <view>收货地址</view>
                    </view>
                  </view>
                  <view @tap="$Router.push('/pages/common/tool/contact_us')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-kefu1"></text></view>
                      <view>联系客服</view>
                    </view>
                  </view>
                  <view @tap="$Router.push('/pages/common/tool/help')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-bangzhuzhongxin"></text></view>
                      <view>帮助中心</view>
                    </view>
                  </view>
                  <view class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-clean"></text></view>
                      <view>清除缓存</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- copyright -->
          <view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-80 u-p-b-50" v-if="shopData.copyrightContent">
            <view class="copyright-text">{{ shopData.copyrightContent }}</view>
            <view class="copyright-text">{{ shopData.copyrightDate }}</view>
          </view>
    </view>
</template>

<script>
import {checkToken} from "../../../faasmall/api/login";
import jwt from "@/faasmall/utils/cache/jwt";
import {mapActions, mapGetters} from 'vuex';
import {silentLogin} from "@/faasmall/utils/auth/auth";
export default {
  name: "index",
  data(){
    return{

    }
  },
  computed: {
    ...mapGetters(['isLogin','userInfo','shopData']),
  },
  onShow(){
    this.init();
  },
  onLoad(options){
    console.log('options',options);
  },
  methods:{
    refresh(){
      this.$router.go(0);
    },
    login(){
      jwt.verifyLogin();
    },
    init(){
      //判断是否登陆
      if(this.isLogin){

      }
    },
    goto(url) {
      uni.navigateTo({
        url:url
      })
    },
    checkTk(){
      console.log('校验token')
      let request = checkToken({"test":'123'});
      request.then(function (res) {
        console.log('校验token有效：' + res)
      })
      .catch(function (err) {
        console.log('校验token：' + err)
      });
    },
  }
}
</script>

<style scoped>
  .grid-item{
    flex: 1;
    width: 25%;
    min-width: 25%;
    max-width: 25%;
    margin-bottom: 20rpx;
  }
  .user-info-top{
    background-image: url(@/static/img/user/background.png);
    //height: 420rpx;
    width: 100%;
  }
</style>
