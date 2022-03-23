<template>
  <view>
    <faasmall-navbar title="我的资料" :is-back="true"></faasmall-navbar>
    <view class="list-wrap">
      <view class="list-item border-bottom">
        <text>头像</text>
        <view class="row-center">
          <u-image src="/static/logo.png"  width="80rpx" height="80rpx" shape="circle"></u-image>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view class="list-item border-bottom">
        <text>昵称</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <view class="list-item border-bottom">
        <text>姓名</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <view class="list-item border-bottom">
        <text>性别</text>
        <view class="flex">
          <text>男</text>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view class="list-item border-bottom">
        <text>出生日期</text>
        <view class="flex">
          <text>2021-11-21</text>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view class="list-item border-bottom">
        <text>所在城市</text>
        <view class="flex">
          <text>湖南</text>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view class="list-item border-bottom">
        <text>会员等级</text>
        <view class="flex">
          <text>默认等级</text>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view class="list-item border-bottom">
        <text>收货地址</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <view class="list-item border-bottom">
        <text>手机号</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <view class="list-item border-bottom">
        <text>微信号</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <view class="list-item border-bottom">
        <text>登陆密码</text>
        <text class="iconfont icon-page-next1"></text>
      </view>
      <u-button type="warning" size="default">退出登录</u-button>
    </view>
  </view>

</template>

<script>
export default {
  name: "user_info"
}
</script>

<style scoped>

</style>