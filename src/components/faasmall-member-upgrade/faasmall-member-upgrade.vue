<template>
  <view>
    <view class="grade-wrap">
      <view class="grade-container">
          <view class="grade-left">
            <u-image class="mr5" src="http://dummyimage.com/180x180"  width="90px" height="90px" ></u-image>
          </view>
          <view class="grade-center">
              <view><text>{{name}}</text></view>
              <view><text>{{title}}</text><text>{{discount}}折</text></view>
          </view>
          <view class="grade-right">
            <text>升级</text>
          </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "faasmall-member-upgrade",
  props:{
    name:{
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    discount: {
      type: Number,
      default: 0
    },
  }
}
</script>

<style lang="scss">
.grade-wrap{
  width: 100%;
  .grade-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>