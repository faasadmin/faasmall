<template>
  <view class="sh-server-box">
    <view style="padding: 20rpx;height:100rpx;display: flex;justify-content: space-between;align-items: center;background: #FFFFFF" @tap="showModal = true">
      <view>
        <text class="title">优惠卷</text>
      </view>
      <view style="width: 510rpx">
        <scroll-view  scroll-x="true" @scroll="scroll" scroll-left="120">
          <view class="" style="white-space: nowrap;display: flex;align-items: center;height: 80rpx">
            <view class="coupon-3 d-inline-block" v-for="grantCoupon in grantCouponList" :key="grantCoupon.id">{{grantCoupon.name}}</view>
          </view>
        </scroll-view>
      </view>

      <view class="right-icon"><text class="iconfont icon-page-next1"></text></view>
    </view>

    <u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">

      <view class=" server-modal">
        <view class="server-modal-box page_box">
          <view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">优惠卷</text></view>
          <view class="modal-content content_box">
            <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" style="height: 800rpx;">
              <view class="coupon-one-style-item" v-for="item in grantCouponList" :key="item.id">
                <view class="coupon-one-style-left">
                  <view class="he-item-price">{{item.discountPrice | setNumber}}</view>
                  <view class="he-item-condition">
                    <template v-if="Number(item.thresholdPrice) > 0">
                      满{{ item.thresholdPrice | setNumber }}可用
                    </template>
                    <template v-else> 无门槛 </template>
                  </view>
                </view>
                <view class="coupon-one-style-center">
                  <view class="coupon-one-style-doc"></view>
                  <view class="coupon-one-style-doc"></view>
                  <view class="he-border-line"></view>
                </view>
                <view class="coupon-one-style-right">
                  <view class="he-right-left">
                    <view class="he-item-name">{{item.name}}</view>
                    <view class="he-item-prompt">{{item.specifyType === 1 ? "全部商品可用" : "部分商品可用" }}</view>
                  </view>
                  <view class="he-right-right">
                    <template>
                      <button class="cu-btn he-cu-btn he-left-right_btn">
                        立即领取
                      </button>
                    </template>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

    </u-popup>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      scrollTop: 0,
      showModal: false
    };
  },
  filters: {
    setNumber: function(num) {
      return Number(num);
    },
  },
  props: {
    grantCouponList: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  methods: {
    scroll(){

    }
  }
};
</script>

<style lang="scss">
.server-modal-box {
  width: 750rpx;
  //height: 100%;
  border-radius: 30rpx 30rpx 0 0;
  background: #fff;
  padding: 30rpx;
  .serve-btn {
    width: 690rpx;
    line-height: 80rpx;
    background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
    border-radius: 40rpx;
    font-size: 30rpx;
    color: rgba(#fff, 0.9);
    margin-top: 40rpx;
  }

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
      padding-bottom: 40rpx;

      .title-tag {
        width: 38rpx;
        height: 38rpx;
        margin-right: 20rpx;
      }

      .serve-title {
        font-size: 28rpx;
        font-weight: bold;
      }

      .serve-detail {
        text-align: left;
        font-size: 26rpx;
        color: #999;
        line-height: 42rpx;
        padding-left: 58rpx;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
