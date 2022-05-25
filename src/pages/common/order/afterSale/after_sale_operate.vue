<!--售后操作-->
<template>
  <view style="padding: 20rpx">
      <view v-for="(item, index) in goods" :key="index" style="display: flex;justify-content: space-between;padding: 20rpx;background: #FFFFFF">
         <view style="height: 160rpx;width: 160rpx">
           <u-image :src="item.thumbnail"  width="160rpx" height="160rpx"></u-image>
         </view>
         <view style="display: flex;flex-direction: column;padding: 0 20rpx">
           <view style="margin-top: 5rpx;word-break: break-all;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;overflow: hidden;">{{item.goodName}}</view>
           <view style="margin-top: 5rpx">{{item.goodSkuName}}</view>
           <view style="margin-top: 5rpx">x{{item.goodNumber}}</view>
         </view>
      </view>
      <view style="margin-top: 20rpx;padding: 20rpx;background: #FFFFFF">
        <view
            style="display: flex;justify-content: space-between;align-items: center"
            @tap="toPage(0)"
            v-if="status === 2 ||  status === 3 || status === 4"
        >
          <image style="height: 120rpx;width: 120rpx" :src="$FILE_URL +  '/file/img/order/order-refund.png'"></image>
          <view style="width: 100%;margin-left: 30rpx;">
            <view>仅退款</view>
            <view>没收到货，或与卖家协商同意仅退款</view>
          </view>
          <text class="iconfont icon-page-next1"></text>
        </view>
        <view v-if="status === 3 || status === 4">
          <view style="display: flex;justify-content: space-between;align-items: center" @tap="toPage(1)">
            <image style="height: 120rpx;width: 120rpx" :src="$FILE_URL + '/file/img/order/order-refunds.png'"></image>
            <view style="width: 100%;margin-left: 30rpx;">
              <view>退货退款</view>
              <view>已收到货，需要退还收到的货物</view>
            </view>
            <text class="iconfont icon-page-next1"></text>
          </view>
          <view style="display: flex;justify-content: space-between;align-items: center" @tap="toPage(2)" v-if="status === 4">
            <image style="height: 120rpx;width: 120rpx" :src="$FILE_URL + '/file/img/order/order-exchange.png'"></image>
            <view style="width: 100%;margin-left: 30rpx;">
              <view>换货</view>
              <view>对收到的商品不满意，可与商家协商换货</view>
            </view>
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
      </view>
  </view>
</template>

<script>
export default {
  name: "after_sale_apply",
  data() {
    const _this = this;
    return {
      goods: [],
      isTask: false,
      status: null,
      orderSn: '',
      $FILE_URL: _this.$FILE_URL,
    };
  },
  onLoad(options) {
    debugger
    this.goods = JSON.parse(decodeURIComponent(decodeURIComponent(options.goods)));
    this.isTask = options.isTask;
    this.orderSn = options.orderSn;
    this.status = parseInt(options.status);
  },
  methods:{
    toPage: function (type) {
      uni.redirectTo({
        url:
            '/pages/common/order/afterSale/after_sale_apply?goods=' +
            encodeURIComponent(JSON.stringify(this.goods)) +
            '&type=' +
            type +
            '&isTask=' +
            this.isTask +
            '&orderSn=' +
            this.orderSn
      });
    }
  }
}
</script>

<style scoped>

</style>