<template>
  <view style="background: #FFFFFF;border-radius: 20rpx;padding: 20rpx;margin-top: 10rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;" >
    <view v-if="!addressData.id" class="row-center-between" style="width: 100%;align-items: center;" @tap.stop.prevent="navigateTo" >
      <view>
        <text class="iconfont icon-dizhi1"></text>
        <text class="ml-1">请选择收货地址</text>
      </view>
      <view class="list-item-right">
        <text class="iconfont icon-page-next1"></text>
      </view>
    </view>
    <view v-else style="display: flex;justify-content:space-between;width: 100%;padding-left: 20rpx;align-items: center;">
      <view class="" >
        <text class="iconfont icon-dizhi1"></text>
      </view>
      <view style="width: 100%;padding: 0 20rpx">
        <view style="display: flex;flex-direction: column;justify-content: space-between">
          <view class="">
            <text>{{ addressData.consignee }}</text>
            <text class="ml-2">{{ addressData.mobile }}</text>
            <text v-show="addressData.status === 1">默认</text>
          </view>
          <view class="">
            <view class="">{{ addressData.province }}{{ addressData.city }}{{ addressData.district }}{{ addressData.address }}</view>
            <text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;"></text>
          </view>
        </view>
      </view>
      <view class="">
        <text class="iconfont icon-page-next1"></text>
      </view>
    </view>
    <u-image style="width: 100%; height: 4rpx"  :src="$FILE_URL + '/file/img/common/address-background-bar.png'"></u-image>
  </view>
</template>

<script>
export default {
  name: "submit-address",
  data(){
    const _this = this;
    return{
      $FILE_URL: _this.$FILE_URL
    }
  },
  props: {
    addressData: {
      type: Object
    }
  },
  methods: {
    navigateTo: function () {
      this.$Router.push({
        path: '/pages/common/address/list',
        query: {type:'select'}
      });
    }
  }
}
</script>

<style scoped>

</style>