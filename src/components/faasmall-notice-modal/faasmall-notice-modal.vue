<!--通知弹框-->
<template>
  <view class="popup-box" v-show="popupList && popupList.length">
    <view class="" v-for="(p, index) in popupList" :key="index">
      <view class="cu-modal" :class="{ show: showModal }" @tap="hideModal(p, index)" v-if="popupCurrent === index && p.image">
        <view class="cu-dialog" style="width: 610rpx;background: none;">
          <view class="img-box" @tap.stop="onPopup(p.path)"><image class="modal-img" :src="p.image" mode="aspectFit"></image></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
let timer = null;
export default {
  name: 'faasmallNoticeModal',
  components: {},
  data() {
    return {
      popupCurrent: 0,
      showModal: true
    };
  },
  props: {},
  computed: {
    ...mapGetters(['popupData', 'isLogin']),
    popupList() {
      if (this.popupData) {
        return this.popupData.list;
      }
    }
  },
  beforeDestroy() {
    clearTimeout(timer);
    timer = null;
  },
  methods: {
    hideModal(p, index) {
      clearTimeout(timer);
      this.showModal = false;
      if (p.style == 1) {
        this.$store.commit('delPopup', index);
      }
      timer = setTimeout(() => {
        this.popupCurrent += 1;
        this.showModal = true;
      }, 500);
    },
    onPopup(path) {
      this.$tools.routerTo(path);
    }
  }
};
</script>

<style lang="scss">
.img-box {
  position: relative;
  width: 610rpx;
  .modal-img {
    width: 100%;
    will-change: transform;
    height: 830rpx;
  }
}
</style>
