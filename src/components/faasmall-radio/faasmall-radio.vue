<template>
  <view class="flex justify-center align-center" @click="newVal = !newVal">
    <view class="faas-radio faas-radio-0" v-if="!newVal"></view>
    <view class="faas-radio faas-radio-1 flex justify-center align-center" v-else>
      <text class="faas-select iconfont icon-gou"></text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'faasmall-radio',
  props: {
    value: {
      type: [Boolean, Number]
    },
    isChange: {
      type: [Boolean],
      default: true
    }
  },
  computed: {
    newVal: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        if (!this.isChange) return;
        return this.$emit('input', val);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.faas-radio {
  // #ifndef H5
  width: 36rpx;
  height: 36rpx;
  // #endif
  // #ifdef H5
  width: 36rpx;
  height: 36rpx;
  // #endif
  border-radius: 50%;
}
.faas-radio-0 {
  border: 2rpx solid #cccccc;
}
.faas-radio-1 {
  background-color: $mszf-theme-color;
}
.faas-select {
  font-size: 20rpx;
  color: #ffffff;
}
</style>
