<template>
  <view>
    <view class="swiper-item-content">
      <view class="col-center-center" style="height: 100%;padding: 20rpx">
        <view class="row-center-center" style="height: 80rpx;width: 100%">
          <text>普通等级</text>
        </view>
        <view class="row-center-between" style="width: 100%;">
          <view class="col-center-center">
            <u-circle-progress active-color="#2979ff"  :percent="80" width="150">
              <view class="u-progress-content">
                <view class="u-progress-dot"></view>
                <text class='u-progress-info'>查找中</text>
              </view>
            </u-circle-progress>
            <view>
              <text>一级</text>
            </view>
          </view>
          <view class="col-center-center">
            <u-circle-progress active-color="#2979ff" :percent="80" width="150">
              <view class="u-progress-content">
                <view class="u-progress-dot"></view>
                <text class='u-progress-info'>查找中</text>
              </view>
            </u-circle-progress>
            <view>
              <text>二级</text>
            </view>
          </view>
          <view class="col-center-center">
            <u-circle-progress active-color="#2979ff" :percent="80" width="150">
              <view class="u-progress-content">
                <view class="u-progress-dot"></view>
                <text class='u-progress-info'>查找中</text>
              </view>
            </u-circle-progress>
            <view>
              <text>三级</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
export default {
  name: "member-grade",
  data() {
    return {
      color: '',
      priceColor: '',
      bgColor1: '',
      bgColor2: '',
      showModal: false
    };
  },
  props: {
    grade: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
}
</script>

<style lang="scss">
.icon-item{
  height: 46px;
  width: 46px;
}
.swiper-item-content{
  background: #FFFFFF;
  position: absolute;
  height: 360rpx;
  width: 570rpx;
  border-radius: 15rpx;
  z-index: 5;
  opacity: 0.7;
  top: 18%;
  margin: 0 20rpx;
}
</style>