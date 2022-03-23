<template>
  <view>
    <faasmall-navbar title="分销中心" :is-back="true"></faasmall-navbar>
    <view>
        <view style="height: 200rpx;width: 100%;background: #ff0013;padding: 20rpx">
          <view style="display: flex;align-items: center;height: 100%;width: 100%;justify-content: space-between">
            <view style="display: flex">
              <view>
                <u-image src="http://dummyimage.com/375x180"  width="80rpx" height="80rpx" shape="circle"></u-image>
              </view>
              <view style="margin-left: 20rpx">
                <view>fendo</view>
                <view>推荐人:{{info.referrer}}</view>
              </view>
            </view>
<!--            <view style="display: flex;flex-direction: column">
              <text class="iconfont icon-paihangbang1" style="font-size: 30px"></text>
              <text>榜单</text>
            </view>-->
          </view>
        </view>
        <view style="position: relative;height: 120rpx">
          <view style="height: 160rpx;width: 100%;position: absolute;padding: 0 20rpx;margin-top: -40rpx">
            <view style="background: #FFFFFF;height: 100%;width: 100%;display: flex;padding: 20rpx">
                <view style="flex: 1">
                  <view>分销等级：{{info.levelName}}</view>
                  <u-line-progress active-color="#2979ff" :percent="70"></u-line-progress>
                  <text>升至{{info.nextName}}</text>
                </view>
                <view style="margin-left: 20rpx;display: flex;justify-content: center;align-items: center">
                  <u-button @click="$Router.push('/pages/common/distribution/grade')" size="mini">升级</u-button>
                </view>
            </view>
          </view>
        </view>
        <view style="padding: 20rpx;height: 300rpx;width: 100%;display: flex;justify-content: space-between;align-items: center">
          <view style="background:#FFFFFF;height: 100%;flex: 1">
              <view style="display: flex;justify-content: center;align-items: center;flex-direction: column;height: 100%">
                <text class="iconfont icon-zhifu" style="font-size: 30px"></text>
                <text>￥{{info.cumulativeCommission}}</text>
                <view style="display: flex;align-items: center;justify-content: center">
                  <view style="background: red;width: 30rpx;height: 30rpx;border-radius: 50rpx"></view>
                  <text>累计佣金</text>
                </view>
              </view>
          </view>
          <view style="flex: 1;height: 100%;display: flex;flex-direction: column;justify-content: space-between;align-items: center">
              <view style="width: 100%;height:100%;padding: 0 0 10rpx 10rpx">
                <view style="width: 100%;height:100%;background: #FFFFFF;display: flex;justify-content: center;align-items: center;">
                    <view style="display: flex;justify-content: center;align-items: center;flex-direction: column">
                      <text>￥{{info.cashWithdrawal}}</text>
                      <view style="display: flex;align-items: center;justify-content: center;">
                        <view style="background: yellow;width: 30rpx;height: 30rpx;border-radius: 50rpx"></view>
                        <text>已提现金额</text>
                      </view>
                    </view>
                    <view style="margin-left: 20rpx">
                      <text class="iconfont icon-kehuxiaoliang3x" style="font-size: 30px"></text>
                    </view>
                </view>
              </view>
              <view style="width: 100%;height:100%;padding: 0 0 0 10rpx">
                <view style="width: 100%;height:100%;background: #FFFFFF;display: flex;justify-content: center;align-items: center;">
                  <view style="display: flex;justify-content: center;align-items: center;flex-direction: column">
                    <text>￥{{info.pendingCommission}}</text>
                    <view style="display: flex;align-items: center;justify-content: center;">
                      <view style="background: green;width: 30rpx;height: 30rpx;border-radius: 50rpx"></view>
                      <text>待结算佣金</text>
                    </view>
                  </view>
                  <view style="margin-left: 20rpx">
                    <text class="iconfont icon-6xiaoliang" style="font-size: 30px"></text>
                  </view>
                </view>
              </view>
          </view>
        </view>
        <view style="height: 160rpx;width: 100%;padding: 20rpx">
            <view style="background: #FFFFFF;height: 100%;width: 100%;display: flex;justify-content: space-between;align-items: center;padding: 0 40rpx;">
              <view style="display: flex;align-items: center;">
                <view style="background: green;width: 30rpx;height: 30rpx;border-radius: 50rpx"></view>
                <text style="margin-left: 20rpx">可提现金额</text>
              </view>
              <view>
                ￥{{info.availableCashAmount}}
              </view>
              <view>
                <u-button @click="$Router.push('/pages/common/distribution/withdraw_apply')" size="mini">提现</u-button>
              </view>
            </view>
        </view>
        <view style="padding: 20rpx;height: 60rpx;width: 100%;">
          <view style="display: flex;justify-content: space-between;align-items: center;background: #FFFFFF;padding: 20rpx">
            <view class="col-center-center" @tap="$Router.push('/pages/common/distribution/order')">
              <view>
                <text>累计分销订单</text>
                <text>></text>
              </view>
              <view>{{info.orderNum}}</view>
            </view>
            <view style="height: 30px;width: 1px;background: #727272"></view>
            <view class="col-center-center" @tap="$Router.push('/pages/common/distribution/offline')">
              <view>
                <text>累计下线人数</text>
                <text>></text>
              </view>
              <view>{{info.offlineNum}}</view>
            </view>
          </view>
        </view>
    </view>
  </view>
</template>

<script>
import {getDistributionCenterInfo} from "@/faasmall/api/distribution";

export default {
  name: "index",
  data(){
    return{
      info:{}
    }
  },
  onLoad(){
    this.init();
  },
  methods:{
    init(){
      getDistributionCenterInfo().then((res)=>{
        if(res.code === 0){
          this.info = res.data;
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(err=>{
        console.error(err);
      })
    }
  }
}
</script>

<style scoped>

</style>