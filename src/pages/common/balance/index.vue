<template>
  <view>
    <faasmall-navbar title="我的余额" :is-back="true"></faasmall-navbar>
    <view class="bg-wrap">
      <view class="bg-container p-3">
        <view>账户余额</view>
        <view>0.00</view>
      </view>
    </view>
    <view class="list-wrap">
      <view @tap="$Router.push('/pages/common/balance/recharge')" class="list-item border-bottom">
        <text>充值</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <view @tap="$Router.push('/pages/common/balance/detail')" class="list-item border-bottom">
        <text>明细</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "index"
}
</script>

<style lang="scss">
.bg-wrap{
  background-image: url("http://dummyimage.com/375x100");
  width: 100%;
  height: 200rpx;
  .bg-container{
    height: 100%;
  }
}
</style>