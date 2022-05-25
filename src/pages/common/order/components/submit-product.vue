<template>
  <view class="flex flex-column mt-2" style="background: #FFFFFF;padding: 20rpx 20rpx;border-radius: 20rpx">
    <view><text>商品信息</text></view>
    <view style="display: flex;flex-direction: row" class="mt-2" v-for="(item, index) in goodList" :key="index">
      <view>
        <u-image class="good-img" :src="item.thumbnail" width="90px" height="90px"></u-image>
      </view>
      <view style="flex: 1;padding: 10rpx" class="ml-1">
        <view><text style="word-break: break-all;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;overflow: hidden;">{{item.goodName}}</text></view>
        <view class="mt-1"><text>{{item.goodSkuName}}</text></view>
        <view class="mt-1" style="display: flex;flex-direction: row;justify-content: space-between;">
          <view>
            ￥{{item.goodSellingPrice}}
          </view>
          <view>
            <vk-data-input-number-box
                v-model="item.goodNumber" :min="1" :max="item.stocks" :step="1" :positive-integer="true">
            </vk-data-input-number-box>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "submit-product",
  props: {
    goodList: {
      type: Array,
      default: []
    },
  }
}
</script>

<style scoped>

</style>