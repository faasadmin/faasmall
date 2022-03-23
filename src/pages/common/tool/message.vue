<template>
    <view>
      <faasmall-navbar :is-back="true" title="消息中心"></faasmall-navbar>
      <u-card title="注册成功" subTitle="2021-11-19 15:15:10">
        <view class="" slot="body">
          <view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
            <view class="u-body-item-title u-line-2">fendo恭喜你，注册成功!</view>
          </view>
        </view>
      </u-card>
    </view>
</template>

<script>
export default {
  name: "message",
  components:{

  }
}
</script>

<style scoped lang="scss">
.u-card-wrap {
  background-color: $u-bg-color;
  padding: 1px;
}

.u-body-item {
  font-size: 32rpx;
  color: #333;
  padding: 20rpx 10rpx;
}

.u-body-item image {
  width: 120rpx;
  flex: 0 0 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-left: 12rpx;
}
</style>