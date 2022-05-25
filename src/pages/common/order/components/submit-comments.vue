<template>
  <view class="list-wrap mt-1" style="border-radius: 20rpx">
    <view class="list-item" @tap="doMessage">
      <view><text>买家留言</text></view>
      <view class="flex-1">
        <view class="flex justify-end align-center">
          <text v-if="!comments">最多支持输入50个字</text>
          <text v-else>{{comments}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "submit-comments",
  props: {
    comments: {
      type: String,
    },
  },
  methods:{
    doMessage(){
      uni.navigateTo({
        url:'pages/common/order/leave?comments=' + encodeURIComponent(this.comments)
      })
    },
  }
}
</script>

<style scoped>

</style>