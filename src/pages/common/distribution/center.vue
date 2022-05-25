<template>
  <view>
    <view>
        <view style="height: 200rpx;width: 100%;background: #ff0013;padding: 20rpx">
          <view style="display: flex;align-items: center;height: 100%;width: 100%;justify-content: space-between">
            <view style="display: flex">
              <view>
                <u-image :src="memberInfo.avatar"  width="80rpx" height="80rpx" shape="circle"></u-image>
              </view>
              <view style="margin-left: 20rpx">
                <view>{{memberInfo.nickName}}</view>
                <view>推荐人:{{info.referrer}}</view>
              </view>
            </view>
          </view>
        </view>
        <view style="position: relative;height: 120rpx">
          <view style="height: 160rpx;width: 100%;position: absolute;padding: 0 20rpx;margin-top: -40rpx">
            <view style="background: #FFFFFF;height: 100%;width: 100%;display: flex;padding: 20rpx">
                <view style="flex: 1">
                  <view>分销等级：{{info.levelName}}</view>
                  <u-line-progress active-color="#2979ff" :percent="70"></u-line-progress>
                  <view v-if="info.nextLevel">
                    <text>升至{{info.nextLevel.name}}</text>，
                    <text v-if="info.nextLevel.difference">
                      还需{{ info.nextLevel.difference.conditions }}{{ info.nextLevel.difference.differenceNum }}
                    </text>
                    <text v-else>已满足升级条件</text>
                  </view>
                </view>
                <view  v-if="info.nextLevel" style="margin-left: 20rpx;display: flex;justify-content: center;align-items: center">
                  <!-- #ifndef H5 -->
                  <u-button @click="goUpgrade" size="mini">升级</u-button>
                  <!-- #endif -->
                  <!-- #ifdef H5 -->
                  <he-open-subscribe @open-subscribe-success="goUpgrade" :template-id="templateIds">
                    <u-button size="mini">升级</u-button>
                  </he-open-subscribe>
                  <!-- #endif -->
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
                  <text>{{distributionOtherData.cumulativeCommission}}</text>
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
                        <text>{{distributionOtherData.alreadyWithdrawable}}</text>
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
                      <text>{{distributionOtherData.pending}}</text>
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
                <text style="margin-left: 20rpx">{{distributionOtherData.canWithdrawable}}</text>
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
                <text>{{distributionOtherData.cumulativeDistribution}}</text>
                <text>></text>
              </view>
              <view>{{info.orderNum}}</view>
            </view>
            <view style="height: 30px;width: 1px;background: #727272"></view>
            <view class="col-center-center" @tap="$Router.push('/pages/common/distribution/offline')">
              <view>
                <text>{{distributionOtherData.cumulativeOffline}}</text>
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
import {getDistributionCenterInfo, getDistributionOpen} from "@/faasmall/api/distribution";
import {mapGetters} from "vuex";

export default {
  name: "index",
  data(){
    return{
      info:{
        referrer:'',
        levelName:'',
        nextLevel:{},
        cashWithdrawal:'',
        pendingCommission:'',
        availableCashAmount:'',
      }
    }
  },
  onLoad(){
    this.init();
  },
  computed: {
    ...mapGetters(['isLogin','memberInfo','shopData','distributionOtherData','subscribeData']),
    templateIds: function() {
      let arr = [];
      this.subscribeData.distributorUpgradeTid
          ? arr.push(this.subscribeData.distributorUpgradeTid)
          : null;
      return arr;
    },
  },
  methods:{
    goUpgrade(){
      // #ifndef H5
      const that = this;
      if(that.subscribeData.status === 0){
        wx.requestSubscribeMessage({
          tmplIds: that.subTemplateId,
          success: function () {},
          fail: function () {},
          complete: function () {
            that.$Router.push('/pages/common/distribution/grade');
          }
        });
      } else {
        that.$Router.push('/pages/common/distribution/grade');
      }
      // #endif
      // #ifdef H5
      that.$Router.push('/pages/common/distribution/grade');
      // #endif
    },
    init(){
      getDistributionOpen().then((res)=>{
        if(res.code === 0 && res.data){
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
        } else {
          uni.redirectTo({
            url: 'pages/common/distribution/apply'
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