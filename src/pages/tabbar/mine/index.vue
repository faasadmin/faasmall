<template>
    <view>
          <view class="user-info-top">
              <view  @tap="$Router.push('/pages/common/tool/setting')" style="display: flex;justify-content: flex-end;align-items: center;padding: 20rpx">
                <text class="iconfont icon-xl icon-xitongpeizhi" style="color: #FFFFFF"></text>
<!--                <text @tap="$Router.push('/pages/common/tool/message')" class="iconfont icon-xl icon-xiaoxi4 ml-1" style="color: #FFFFFF"></text>-->
              </view>
              <view style="display:flex;padding: 0 20rpx;display: flex">
                <view @tap="$Router.push('/pages/common/member/info')">
                  <!-- 头像 -->
                  <u-image :src="avatar" shape="circle" width="120rpx" height="120rpx"></u-image>
                </view>
                <view @tap="$Router.push('/pages/common/member/info')" v-if="loginFlag" style="width: 100%;padding: 20rpx;display: flex;justify-content: flex-start;align-items: center">
                  <text>{{memberInfo.nickName}}</text>
                </view>
                <view v-else style="width: 100%;padding: 20rpx;display: flex;align-items: center">
                  <text @tap="login">请登陆~</text>
                </view>
                <view style="width: 110px;display: flex;align-items: center;justify-content: center;" @tap="$Router.push('/pages/common/tool/sign_in')">
                  <view style="border: 2px #ffffff solid;color:#FFFFFF;border-radius: 10px;padding: 2px;">签到有奖</view>
                </view>
              </view>
              <view style="display: flex;justify-content: space-between;padding: 20rpx">
                <view @tap="$Router.push('/pages/common/tool/collect')" class="flex flex-column align-center" style="width: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center">
                  <text v-if="loginFlag">{{memberInfo.collect}}</text>
                  <text v-else>*</text>
                  <text>我的收藏</text>
                </view>
                <view style="width: 1px;height: 60%;padding: 20px 0px;background: rgb(255, 255, 255);"></view>
                <view @tap="$Router.push('/pages/common/tool/footprint')" class="flex flex-column align-center" style="width: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center">
                  <text v-if="loginFlag">{{memberInfo.footprint}}</text>
                  <text v-else>*</text>
                  <text>我的足迹</text>
                </view>
              </view>
          </view>
          <view style="padding: 0 20rpx;margin-top: 40rpx">
            <view  style="margin-top: 20rpx;background: #FFFFFF;height: 260rpx;">
              <view @tap="$Router.push('/pages/common/order/list')" class="padding: 20rpx;">
                <view style="display: flex;justify-content: space-between;align-items: center;padding: 10px;border-bottom: 1px dashed #D1D1D1">
                  <text>我的订单</text>
                  <text class="iconfont icon-page-next1"></text>
                </view>
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
                <view @tap="$Router.push('/pages/common/order/afterSale/after_sale_list')" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <view><text class="iconfont icon-xl icon-shouhou"></text></view>
                  <view>待售后</view>
                </view>
              </view>
            </view>
            <view style="margin-top: 20rpx;background: #FFFFFF;">
              <view class="padding: 20rpx;">
                <view style="display: flex;justify-content: space-between;align-items: center;padding: 10px;border-bottom: 1px dashed #D1D1D1"><text>常用功能</text></view>
              </view>
              <view style="padding: 20rpx;">
                <view style="display: flex;align-items: center;margin-top: 20rpx;flex-wrap: wrap;">
                  <view @tap="$Router.push('/pages/common/wallet/index')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-zhanghuyue"></text></view>
                      <view>我的钱包</view>
                    </view>
                  </view>
                  <view @tap="$Router.push('/pages/common/coupon/list')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-wodeyouhuiquan"></text></view>
                      <view>我的优惠卷</view>
                    </view>
                  </view>
                  <view @tap="$Router.push('/pages/common/integral/index')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-jifen"></text></view>
                      <view>我的积分</view>
                    </view>
                  </view>
                  <view @tap="$Router.push('/pages/common/integral/exchange')" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-jifenshangcheng2"></text></view>
                      <view>积分商城</view>
                    </view>
                  </view>
                  <view @tap="toDistribution" v-if="distributionCenterShow" class="grid-item">
                    <view style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                      <view><text class="iconfont icon-xl icon-fenxiao"></text></view>
                      <view>分销中心</view>
                    </view>
                  </view>
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
                </view>
              </view>
            </view>
          </view>
          <!-- 版权信息 -->
          <faasmall-copyright></faasmall-copyright>
    </view>
</template>

<script>
import {checkToken} from "@/faasmall/api/login";
import jwt from "@/faasmall/utils/cache/jwt";
import {mapActions, mapGetters} from 'vuex';
import {silentLogin} from "@/faasmall/utils/auth/auth";
import {commonConstant} from '@/faasmall/common/constant';
export default {
  name: "index",
  data(){
    return{
      loginFlag:false,
    }
  },
  computed: {
    ...mapGetters(['isLogin','memberInfo','memberData','shopData']),
    distributionCenterShow({$store}) {
      const distributionCenterShow = this.$store.state.member.memberInfo.distributionCenterShowStatus;
      return distributionCenterShow === 1 || distributionCenterShow === 2;
    },
    avatar(){
      return this.loginFlag ? this.memberInfo.avatar : commonConstant.avatar;
    }
  },
  onShow(){
    this.loginFlag = jwt.getLogin();
    if (this.loginFlag) {
      this.getMemberInfo();
    }
  },
  methods:{
    ...mapActions(['getMemberInfo','getMemberData']),
    toDistribution(){
      if (this.$store.state.member.memberInfo.distributionCenterShowStatus === 2) {
        uni.navigateTo({
          url: '/pages/common/distribution/recruit'
        });
      } else {
        uni.navigateTo({
          url: '/pages/common/distribution/center'
        });
      }
    },
    refresh(){
      this.$router.go(0);
    },
    login(){
      jwt.verifyLogin();
    },
    init(){
      this.getMemberInfo().then(res => {
        uni.stopPullDownRefresh();
      }).catch(e => {
        uni.stopPullDownRefresh();
      });
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

<style  lang="scss" scoped>
  .grid-item{
    flex: 1;
    width: 25%;
    min-width: 25%;
    max-width: 25%;
    margin-bottom: 20rpx;
  }
  .user-info-top{
    background-image: url($FILE_URL + '/file/img/user/background.png');
    /*#ifdef H5||APP-PLUS */
    height: calc(var(--status-bar-height) + 360rpx);
    /*#endif  */
    /*#ifdef MP-WEIXIN */
    height: calc(var(--status-bar-height) + 300rpx);
    /*#endif  */
    width: 100%;
  }
</style>
