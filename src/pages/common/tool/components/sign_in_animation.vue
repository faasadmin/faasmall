<template>
  <view class="wrap" v-if="displayAnimation">
    <view class="wrap-box">
      <view class="close" @click="toclose">
        <text class="iconfont icon-quxiao"></text>
      </view>
      <view class="icon">
        <view class="bg">
          <img src="./img/bg.png" alt="" />
        </view>
        <view class="gold">
          <img src="./img/icon.png" alt="" />
        </view>
      </view>
      <view class="text">
        <view class="score">+{{ score }}积分</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    value: {
      type: [Number, Boolean],
      default: 0
    },
    score: {
      type: [String, Number],
      default: '10'
    }
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  computed: {
    displayAnimation: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('input', 0);
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {},
  methods: {
    /**
     * 执行关闭
     * @return {[type]} [description]
     */
    toclose() {
      this.displayAnimation = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  .wrap-box {
    width: 600rpx;
    height: 600rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300rpx;
    margin-top: -400rpx;
  }

  .close {
    display: block;
    position: absolute;
    width: 52rpx;
    height: 52rpx;
    top: 0;
    right: 0;
    z-index: 100;

    .iconfont {
      width: 52rpx;
      height: 52rpx;
      font-size: 52rpx;
      line-height: 52rpx;
      color: #ffffff;
    }
  }

  .icon {
    width: 100%;
    height: 100%;
    position: relative;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        opacity: 0;
        width: 100%;
        height: 100%;
        animation-duration: 0.6s;
        animation-name: bg;
        animation-fill-mode: forwards;
      }
    }

    .gold {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -80rpx;
      margin-left: -80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      height: 160rpx;

      img {
        opacity: 0;
        animation-duration: 1.6s;
        animation-name: icon;
        animation-fill-mode: forwards;
        width: 100%;
        height: 100%;
      }
    }
  }

  .text {
    position: absolute;
    text-align: center;
    top: 400rpx;
    left: 0;
    width: 100%;
    opacity: 0;
    animation-delay: 1.2s;
    animation-duration: 0.4s;
    animation-name: text;
    animation-fill-mode: forwards;

    .score {
      font-size: 48rpx;
      font-family: PingFang SC;
      font-weight: 800;
      color: #feb805;
      color: #e29c04;
      font-weight: 800;
    }

    .tip {
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 36rpx;
      color: #fff;
    }
  }
}

@keyframes icon {
  0% {
    opacity: 0;
    transform: scale3d(0.8, 0.8, 1);
  }

  25% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  37.5% {
    opacity: 1;
    transform: scale3d(0.05, 1, 1);
  }

  50% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  62.5% {
    opacity: 1;
    transform: scale3d(0.05, 1, 1);
  }

  75% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bg {
  0% {
    opacity: 0;
    transform: scale3d(0.6, 0.6, 1);
  }

  100% {
    opacity: 1;
    ransform: scale3d(1, 1, 1);
  }
}

@keyframes text {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
