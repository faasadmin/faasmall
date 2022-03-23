<template>
  <view>
    <faasmall-navbar title="余额充值" :is-back="true"></faasmall-navbar>
    <view class="recharge-wrap">
      <view class="recharge-container">
          <view><text>充值金额</text></view>
          <view class="recharge-amount flex align-center">
            <text>￥</text>
            <u-input v-model="value" placeholder="请输入你要充值的金额" :type="type" :border="border" />
          </view>
      </view>
    </view>
    <view class="recharge-footer">
      <u-button size="default" type="primary">立即充值</u-button>
    </view>
  </view>
</template>

<script>
export default {
  name: "recharge",
  data(){
    return{
      value:'',
    }
  }
}
</script>

<style lang="scss">
.recharge-wrap{
  margin-top: 20rpx;
  height: 400rpx;
  width: 100%;
  padding: 40rpx;
  .recharge-container{
    padding: 50rpx;
    background: #FFFFFF;
    height: 100%;
    width: 100%;
    .recharge-amount{
      padding: 20rpx;
    }
  }
}
.recharge-footer{
  padding: 20rpx;
}
</style>