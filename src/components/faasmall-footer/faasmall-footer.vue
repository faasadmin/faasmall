<template>
  <view>
    <view v-if="status === 'nomore'" class="empty">
      <text v-if="!slotEmpty">
        <!-- 缺省页 -->
        <faasmall-empty v-if="empty" :image="$FILE_URL + '/file/img/good/empty_goods.png'" tipText="暂无该商品，还有更多好货等着你噢~"></faasmall-empty>
      </text>
      <slot name="empty" v-else></slot>
    </view>
    <!-- 加载更多 -->
    <u-loadmore v-show="!empty" height="80rpx"
                :status="status"
                :loading-text="loadingText"
                :loadmore-text="loadmoreText"
                :nomore-text="nomoreText"
                icon-type="flower" color="#ccc" />
  </view>
</template>

<script>

export default {
  data() {
    const _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      status: 'loadmore',
      loadingText: '努力加载中',
      loadmoreText: '轻轻上拉',
      nomoreText: '实在没有了'
    }
  },
  components: {

  },
  props: {
    empty:{
      type: Boolean,
      default: false
    },
    slotEmpty: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    onRefresh() {
      this.$emit('refresh');
    }

  }
};
</script>
<style>
.loading-footer {
  padding: 30rpx 0;
  color: #666;
}
</style>