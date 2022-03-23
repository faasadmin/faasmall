<template>
  <view class="sh-server-box">
    <!-- 活动/促销 -->
    <view class="mt-1" style="padding: 20rpx;background: #FFFFFF">
      <view class="row-item-center pt-1" style="width: 100%" v-if="giftPointsStatus === 1">
        <view><text class="title">活动</text></view>
        <view style="padding: 0rpx 20rpx">
          <view class="item">
            <u-tag text="送积分" type="error" />
            <text class="pl-1">购买送{{giftPoints}}积分</text>
          </view>
        </view>
      </view>
      <view class="row-center-between pt-1" v-if="giftBalanceStatus ===1 || giftCouponList.length >0">
        <view>
          <text class="title">促销</text>
        </view>
        <view style="padding-left: 20rpx;flex: 1" class="list">
          <view class="item row-center-between" v-if="giftBalanceStatus ===1">
            <view>
              <u-tag text="赠余额" type="error" />
              <text class="pl-1">购买送￥{{giftBalance}}余额</text>
            </view>
          </view>
          <view class="item pt-1 row-center-between" @tap="showCouponModal = true" v-if="giftCouponList.length > 0">
            <view>
              <u-tag text="赠优惠卷" type="error" />
              <text class="pl-1">购买送{{couponStr}}</text>
            </view>
            <view>
              <text class="iconfont icon-page-next1"></text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <u-popup v-model="showCouponModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
      <view class=" server-modal">
        <view class="server-modal-box page_box">
          <view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">优惠卷</text></view>
          <view class="modal-content content_box">
            <view class="serve-list base-coupons" v-for="giftCoupon in giftCouponList" :key="giftCoupon.name">
              <view class="left-coupons mt-2" style="display: flex;justify-content: space-between">
                <view class="row-center-center" style="width: 25%">
                  ￥{{giftCoupon.discountPrice}}
                </view>
                <view class="row-center-start ml-2" style="width: 75%;">
                    <view class="col-start-center">
                      <text>{{giftCoupon.name}}</text>
                      <text class="mt-1">满￥{{giftCoupon.thresholdPrice}}可用</text>
                      <text class="mt-1">赠送{{giftCoupon.number}}张</text>
                    </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {sidebarLogo} from "../../../../../../faas-mall-admin/src/settings";

export default {
  components: {},
  data() {
    return {
      showCouponModal: false,
    };
  },
  props: {
    giftCouponList: {
      type: Array,
      default: () => []
    },
    giftPointsStatus:{
      type: Number,
      default: 0
    },
    giftPoints:{
      type: Number,
      default: 0
    },
    giftBalanceStatus:{
      type: Number,
      default: 0
    },
    giftBalance:{
      type: Number,
      default: 0
    }
  },
  created() {

  },
  computed:{
    couponStr() {
      if(this.$tool.isNotEmpty(this.giftCouponList)){
        var arr = [ ];
        this.giftCouponList.forEach(ss=>{
          arr.push(ss.name);
        })
        return arr.join(";");
      }
    },
  },
  methods: {}
};
</script>

<style lang="scss">
.left-coupons{
  width: 100%;
  height: 100px;
  position: relative;
  background: radial-gradient(circle at right top, transparent 10px,  #FF0505 0) top left / 25% 51% no-repeat,
  radial-gradient(circle at right bottom, transparent 10px,  #FF0505 0) bottom left / 25% 51% no-repeat,
  radial-gradient(circle at left top, transparent 10px, #D1D1D1 0) top right / 75% 51% no-repeat,
  radial-gradient(circle at left bottom, transparent 10px, #D1D1D1 0) bottom right / 75% 51% no-repeat;
  filter: drop-shadow(3px 3px 3px rgba(0,0,0,.3));
}
.left-coupons::before {
  content: '';
  height: 80px;
  border: 1px dashed #FFFFFF;
  position: absolute;
  left: 25%;
  top: 0;
  bottom: 0;
  margin: auto;
}
.left-coupons::after {
  content: '';
  position: absolute;
  height: 100%;
  width:5px;
  top: 0;
  right: -5px;
  background-image: linear-gradient(to bottom, #D1D1D1 5px, transparent 5px, transparent),
  radial-gradient(10px circle at 5px 10px, transparent 5px, #D1D1D1 5px);
  background-size: 5px 15px;
}

.server-modal-box {
  width: 750rpx;
  height: 100%;
  border-radius: 30rpx 30rpx 0 0;
  background: #fff;
  padding: 30rpx;
  .modal-head {
    margin-bottom: 30rpx;
    position: relative;
    .head-title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  .modal-content {
    overflow-y: auto;
    .serve-list {

    }
  }
}
</style>
