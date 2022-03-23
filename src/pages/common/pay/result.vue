<template>
  <view class="pay-result column-center">
    <view class="contain bg-white">
      <view class="header column-center">
        <view>
          <image class="tips-icon" src="/static/images/icon_paySuccess.png"></image>
        </view>
        <view class="xl mt20">订单支付成功</view>
      </view>
      <view style="height:181rpx"></view>
      <view class="info">
        <view class="order-num row-between mt20">
          <view class="ml20">订单编号</view>
          <view class="mr20">
            {{payInfo.order_sn}}
          </view>
        </view>
        <view  class="order-time row-between mt20">
          <view class="ml20">付款时间</view>
          <view class="mr20">xxxx</view>
        </view>
        <view class="order-pay-type row-between mt20">
          <view class="ml20">支付方式</view>
          <view class="mr20">xxxx</view>
        </view>
        <view class="order-pay-money row-between mt20">
          <view class="ml20">支付金额</view>
          <view class="mr20">
            xxxxx
          </view>
        </view>
      </view>
      <view class="line ml20"></view>
      <view class="opt-btn-contain row-center wrap">
        <navigator hover-class="none" class="check-order-btn row-center bg-primary br60 mt20" open-type="redirect" url="/pages/user_order/user_order">
          <view class="white bg-primary lg">查看订单</view>
        </navigator>
        <navigator hover-class="none" class="go-back-btn row-center br60 mt20" open-type="switchTab" url="/pages/index/index">
          <view class="primary br60 lg">返回首页</view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      payInfo: {}
    };
  },
  components: {

  },
  props: {},
  onLoad: function(options) {
    this.id = options.id;
    this.getOrderResultFun();
  },
  methods: {
    getOrderResultFun() {

    }
  }
};
</script>
<style lang="scss">
.pay-result {
  .contain {
    width: 682rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
    border-radius: 10rpx;
    margin-top: 78rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;
    padding-bottom: 40rpx;
    position: relative;

    .tips-icon {
      width: 112rpx;
      height: 112rpx;
    }

    .header {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -50rpx;
    }

    .order-num {
      align-items: flex-start;
    }

    .info {
      margin-bottom: 40rpx;
    }

    .opt-btn-contain {
      margin-top: 40rpx;

      .check-order-btn {
        width: 650rpx;
        height: 84rpx;
      }

      .go-back-btn {
        width: 650rpx;
        height: 84rpx;
        border:1px solid  #FFFFFF;
        box-sizing: border-box;
      }
    }

    .line {
      width: 650rpx;
      border-top: 1px solid rgba(229, 229, 229, 1);
    }
  }
}
</style>
