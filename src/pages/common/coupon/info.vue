<template>
  <view>
    <faasmall-navbar title="优惠卷详情" :is-back="true"></faasmall-navbar>
    <view class="content_box">
      <scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top :scroll-into-view="scrollId" @scroll="onScroll">
        <!-- 详情卡片 -->
        <view class="coupon-box">
          <view class="top u-flex-col u-col-center">
            <view class="img-box u-flex u-row-center u-col-center"><image class="coupon-img" src="/static/img/coupon/coupon.png" mode=""></image></view>
            <view class="title">{{ couponData.discountPrice | setNumber }}元优惠券</view>
            <view class="tip">
              <template v-if="Number(couponData.thresholdPrice) > 0"> 满{{ Number(couponData.thresholdPrice) }}可用 </template>
              <template v-else> 无门槛使用 </template>
            </view>
            <u-button type="primary">
              <text v-if="$isEmpty(couponData.status)" @tap="goScroll">立即领取</text>
              <text v-else-if="couponData.status === 1" @tap="$Router.push('/pages/common/coupon/info')">立即使用</text>
              <text v-else-if="couponData.status === 2">已使用</text>
              <text v-else-if="couponData.status === 3">已失效</text>
            </u-button>
            <view class="time" v-if="couponData.beginTime && couponData.endTime">
              <view class="end_time">有效期：{{ couponData.beginTime | timeFormat('yyyy-mm-dd') }} 至 {{ couponData.endTime | timeFormat('yyyy-mm-dd') }}</view>
            </view>
            <view class="coupon-line"></view>
          </view>
          <view class="bottom">
            <view class="notice-item">
              <view class="notice-title">优惠券说明</view>
              <view class="notice-detail">{{ couponData.explanation || '暂无说明~' }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {getCoupon} from "@/faasmall/api/coupon";

export default {
  name: "detail",
  onLoad(){
    this.couponId = this.$Route.query.id;

    this.initData();
  },
  data() {
    return {
      scrollId: '',
      couponId:'',
      couponData:{},
    };
  },
  filters: {
    img: function (type) {

      if (type === 1) {
        return '/static/img/coupon/coupon-used-icon.png';
      } else if (type === 2) {
        return '/static/img/coupon/coupon-expired-icon.png';
      } else if (type === 3) {
        return '/static/img/coupon/coupon-unable-icon.png';
      }
    },
    setNumber: function (num) {
      return Number(num);
    }
  },
  methods:{
    initData(){
      getCoupon({id:this.couponId}).then((res)=>{
        this.couponData = res.data;
      }).catch(err=>{
        console.error(err)
      })
    },
    onScroll() {
      this.scrollId = '';
    },
    goScroll() {
      if (!this.couponId) {
        //this.getCoupon();
      } else {
        if (this.couponDetail.goods_ids === '0' && this.btnStataus == 'can_use') {
          this.$Router.push({
            path: '/pages/goods/list'
          });
        }
        this.scrollId = 'couponGoods';
      }
    }
  }
}
</script>

<style lang="scss">
.page_box {
  background: linear-gradient(180deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
}
.coupon-box {
  margin: 100rpx 30rpx 0;
  border-radius: 20rpx;
  background-color: #fff;
  .top {
    border-radius: 20rpx 20rpx 0 0;
    background-image: radial-gradient(circle at bottom left, #f6d69d, #f6d69d 16rpx, transparent 17rpx),
    radial-gradient(circle at bottom right, #f6d69d, #f6d69d 16rpx, transparent 17rpx);
    padding: 110rpx 0 40rpx 0;
    position: relative;
    z-index: 5;
    .coupon-line {
      width: 95%;
      border-bottom: 2rpx dashed #f3ce90;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 6;
    }
    .img-box {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70rpx;
      .coupon-img {
        width: 100rpx;
        height: 100rpx;
      }
    }
    .title {
      font-size: 40rpx;
      font-weight: bold;
      line-height: 40rpx;
      margin-bottom: 30rpx;
    }
    .tip {
      font-size: 28rpx;
      font-weight: 500;
      margin-bottom: 50rpx;
    }
    .use-btn {
      width: 386rpx;
      line-height: 80rpx;
      background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
      border-radius: 40rpx;
      color: rgba(#fff, 0.9);
      margin-bottom: 30rpx;
    }
    .fail-btn {
      width: 386rpx;
      line-height: 80rpx;
      background: rgba(245, 245, 245, 1);
      border-radius: 40rpx;
      font-size: 30rpx;

      font-weight: 500;
      color: rgba(188, 188, 188, 1);
      margin-bottom: 30rpx;
    }
    .time {
      color: #999;
      font-size: 26rpx;
    }
  }
  .bottom {
    border-radius: 0 0 20rpx 20rpx;
    background-image: radial-gradient(circle at top left, #f6d69d, #f6d69d 16rpx, transparent 17rpx),
    radial-gradient(circle at top right, #f6d69d, #f6d69d 16rpx, transparent 17rpx);
    padding: 40rpx 30rpx;
    .notice-item {
      border-bottom: 1rpx solid #eeeeee;
      min-height: 90rpx;
      width: 100%;
      .notice-title {
        font-weight: 500;
        font-size: 26rpx;
      }
      .notice-detail {
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
        padding-bottom: 10rpx;
        text-indent: 30rpx;
      }
    }
  }
}
// 优惠券商品
.coupon-goods {
  .coupon-goods-title {
    font-size: 30rpx;
    font-weight: bold;
    height: 80rpx;
  }
  .goods-list {
    background: #fff;
    border-radius: 20rpx;
  }
}
</style>
