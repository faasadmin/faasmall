<template>
  <view>
    <u-navbar
        :title="title"
        :is-back="isBack"
        :left-text="leftText"
        :right-text="rightText"
        @click-left="onClickBack"
        @click-right="onClickRight"
    >
      <view
          v-if="isBack"
          class="u-nav-slot"
            @tap="onClickBack"
          slot="left"
      >
        <text class="iconfont icon-page-previous" v-if="isBack"></text>
      </view>
      <view class="navbar-right" slot="right">
        <slot name="right"></slot>
      </view>
    </u-navbar>
  </view>
</template>

<script>
export default {
  name: "index",
  props: {
    // 标题
    title: { type: String, default: '' },
    leftText: { type: String, default: '' },
    rightText: { type: String, default: '' },
    isBack: { type: Boolean, default: false },
  },
  methods:{
    /**
     * 点击返回页面
     */
    onClickBack(){

      console.log('返回');
      uni.navigateBack();
    },
    onClickRight(){
      // do something...
    }
  }
}
</script>

<style scoped>

</style>