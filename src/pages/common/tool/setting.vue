<template>
  <view>
    <view class="container">
      <view class="logo-box col-center-center">
        <image :src="shopData.logo" mode="aspectFit"></image>
        <view class="flex justify-center align-center" style="padding: 40rpx">{{shopData.shopName}}</view>
      </view>
      <view class="item-list-wrap">
        <view class="item">
          <view class="left">
            占用缓存
          </view>
          <view class="right">
            <view class="rightText">
              {{ storageSize }}
            </view>
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
        <view style="height: 2px;"></view>
        <view class="item">
          <view class="left">
            当前版本
          </view>
          <view class="right">
            {{ shopData.version }}
          </view>
        </view>
        <view style="height: 2px;"></view>
        <view class="item" @tap="$Router.push('/pages/common/public/feedback')">
          <view class="left">
            意见反馈
          </view>
          <view class="right">
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
        <view style="height: 2px;"></view>
        <view class="item" @tap="$Router.push('/pages/common/public/rich_text?type=about')">
          <view class="left">
            关于我们
          </view>
          <view class="right">
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
        <view style="height: 2px;"></view>
        <view class="item" @tap="$Router.push('/pages/common/public/rich_text?type=privacy')">
          <view class="left">
            隐私协议
          </view>
          <view class="right">
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
      </view>
      <!-- copyright -->
      <view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-80 u-p-b-50" v-if="shopData.copyrightContent">
        <view class="copyright-text">{{ shopData.copyrightContent }}</view>
        <view class="copyright-text">{{ shopData.copyrightDate }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
  components: {

  },
  data() {
    return {
      storageSize: uni.getStorageInfoSync().currentSize + 'Kb'
    };
  },
  onLoad() {

  },
  computed: {
    ...mapGetters(['tradeData','shopData']),
  },
  methods: {

  }
}
</script>

<style lang="scss">

.container {
  .item-list-wrap {
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      background: #FFFFFF;
      padding: 0 10px;

      .left {

      }

      .right {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        image {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
.copyright-box {
  .copyright-text {
    font-size: 22rpx;
    font-weight: 500;
    color: #c4c4c4;
  }
}
</style>
