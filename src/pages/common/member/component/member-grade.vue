<template>
  <view class="swiper-item-content">
    <view style="height: 40px;line-height: 40px;margin-left: 20px;" v-if="grade.upgradeType === 1 || grade.upgradeType === 2">基升{{grade.name}}任务</view>
    <view style="padding: 0px 20px;" v-if="grade.upgradeType === 1 || grade.upgradeType === 2">
      <view v-if="grade.upgradeType === 2">满足以下任意条件即可升级</view>
      <view v-else>满足以下全部条件即可升级</view>
      <view style="margin-bottom: 5px;" v-if="grade.upgradeType !== 0 && grade.upgradeConditions.indexOf('1') > -1">
        <u-line-progress active-color="#2979ff" :percent="info.orderQuantity"></u-line-progress>
        <view class="row-center-between">
          <text>完成订单数量≥{{grade.orderQuantity}}单</text>
          <text class="right">{{info.orderQuantity}}/{{grade.orderQuantity}}</text>
        </view>
      </view>
      <view style="margin-bottom: 5px;" v-if="grade.upgradeType !== 0 && grade.upgradeConditions.indexOf('2') > -1">
        <u-line-progress active-color="#2979ff" :percent="info.singleOrderAmount"></u-line-progress>
        <view class="row-center-between">
          <text>单笔消费金额≥{{grade.singleOrderAmount}}元</text>
          <text class="right">{{info.singleOrderAmount}}/{{grade.singleOrderAmount}}</text>
        </view>
      </view>
      <view style="margin-bottom: 5px;" v-if="grade.upgradeType !== 0 && grade.upgradeConditions.indexOf('3') > -1">
        <u-line-progress active-color="#2979ff" :percent="info.sumConsumeAmount"></u-line-progress>
        <view class="row-center-between">
          <text>累计消费金额≥{{grade.sumConsumeAmount}}元</text>
          <text class="right">{{info.sumConsumeAmount}}/{{grade.sumConsumeAmount}}</text>
        </view>
      </view>
      <view style="margin-bottom: 5px;" v-if="grade.upgradeType !== 0 && grade.upgradeConditions.indexOf('4') > -1">
        <u-line-progress active-color="#2979ff" :percent="info.singleRechargeAmount"></u-line-progress>
        <view class="row-center-between">
          <text>单笔充值金额≥{{grade.singleRechargeAmount}}元</text>
          <text class="right">{{info.singleRechargeAmount}}/{{grade.singleRechargeAmount}}</text>
        </view>
      </view>
      <view style="margin-bottom: 5px;" v-if="grade.upgradeType !== 0 && grade.upgradeConditions.indexOf('5') > -1">
        <u-line-progress active-color="#2979ff" :percent="info.sumRechargeAmount"></u-line-progress>
        <view class="row-center-between">
          <text>累计充值金额≥{{grade.sumRechargeAmount}}元</text>
          <text class="right">{{info.sumRechargeAmount}}/{{grade.sumRechargeAmount}}</text>
        </view>
      </view>
      <view style="margin-bottom: 5px;margin-top: 6px" v-if="grade.upgradeType !== 0 && grade.upgradeConditions.indexOf('6') > -1">
        <view class="row-center-between">
          <text>购买以下任意商品</text>
          <text class="right"></text>
        </view>
        <view>
          <scroll-view class="groupon-scroll" enable-flex scroll-anchoring scroll-x scroll-with-animation>
              <view class="row-center-between">
                <view v-for="(item,index) in grade.designatedGoods" :key="index" style="width: 100px" class="mr-2" @tap="$Router.push({path:'/pages/common/good/info',query:{id:item.id}})">
                  <image :src="item.thumbnail" style="width: 80px;height: 80px"/>
                </view>
              </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <view style="height: 40px;line-height: 40px;margin-left: 20px;">基升{{grade.name}}尊享权益</view>
    <view>
      <u-grid :col="3" :border='false'>
        <u-grid-item v-for="(item, index) in grade.equityData" :key="index">
          <image class="icon-item" :src="item.icon"></image>
          <view class="grid-text">{{item.title}}</view>
        </u-grid-item>
      </u-grid>
    </view>
    <view class="panel-container" v-if="grade.exclusiveCouponList && grade.exclusiveCouponList.length > 0">
      <view class="panel-head">
        <view>
          <text>专享优惠卷</text>
        </view>
      </view>
      <view class="panel-body">
        <view class="grade-list">
          <scroll-view class="groupon-scroll" enable-flex scroll-anchoring scroll-x scroll-with-animation>
            <view class="groupon-card-wrap u-flex ">
              <view :class="{ 'gray-wrap': item.status_code === 'cannot_get' }" v-for="(item, index) in grade.exclusiveCouponList" :key="item.id">
                <!-- mini -->
                <view class="coupon-card u-flex u-row-between u-m-r-16"  :style="{ background: `linear-gradient(to right, ${bgColor1}, ${bgColor2})` }">
                  <view class="card-left u-flex-col u-row-center u-p-l-30">
                    <view class="price u-m-b-10" :style="{ color: priceColor }">{{ item.amount }}</view>
                    <view class="notice" :style="{ color: color }">满{{ item.enough }}元可用</view>
                    <view class="notice u-m-b-10" :style="{ color: color }">仅剩{{ item.stock }}张</view>
                  </view>
                  <view class="card-right u-p-y-20 u-p-r-10 u-flex-col u-row-center u-col-center">
                    <button class="u-reset-button get-btn u-m-b-10" :style="{ color: color }" @click="getCoupon(item.id, index)">
                      {{ item.status_code === 'cannot_get' ? '不可领取' : '领券购买' }}
                    </button>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "member-grade",
  data() {
    return {
      color: '',
      priceColor: '',
      bgColor1: '',
      bgColor2: '',
      showModal: false
    };
  },
  props: {
    info:{
      type: Object,
      default: function() {
        return {}
      }
    },
    grade: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
}
</script>

<style lang="scss">
.icon-item{
  height: 46px;
  width: 46px;
}
</style>