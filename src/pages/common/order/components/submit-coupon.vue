<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
      <view class="server-modal">
        <view class="server-modal-box page_box">
          <view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">优惠卷</text></view>
          <view class="modal-content content_box" style="height: 63vh;">
            <u-empty v-if="this.$isEmpty(coupon)" text="暂无可用优惠券" mode="list"></u-empty>
            <scroll-view class="faas-body-scroll" scroll-y v-else>
              <view class="faas-coupon-item" :class="
              item.radio
                ? 'faas-coupon-item-radio'
                : !item.isAvailable
                ? 'faas-coupon-item-unavailable'
                : ''
            " v-for="(item, index) in coupon" :key="index" @click="apply(item)">
                <view class="faas-coupon-top flex">
                  <view class="faas-coupon-recommended flex align-center" v-if="item.isAvailable && index === 0">
                    <text class="iconfont icon-daipingjia"></text>
                    <text>推荐</text>
                  </view>
                  <view class="faas-coupon-number">
                    <view class="faas-coupon-price">{{
                        item.discountPrice | setNumber
                      }}</view>
                    <view class="faas-coupon-condition">
                      <template v-if="Number(item.thresholdPrice) > 0">
                        满{{ item.thresholdPrice | setNumber }}可用
                      </template>
                      <template v-else> 无门槛使用 </template>
                    </view>
                  </view>
                  <view class="faas-coupon-content flex-sub flex">
                    <view class="faas-coupon-text flex-twice">
                      <view class="faas-coupon-name">{{ item.couponName }}</view>
                      <view class="faas-coupon-available">{{
                          item.expireType === 1
                              ? "全部商品可用"
                              : "部分商品可用"
                        }}</view>
                    </view>
                    <view class="faas-coupon-radio flex align-center justify-center">
                      <faasmall-radio :value="true" v-if="item.radio"></faasmall-radio>
                    </view>
                  </view>
                </view>
                <view class="faas-coupon-center">
                  <view class="faas-coupon-block"></view>
                  <view class="faas-coupon-block"></view>
                  <view class="faas-coupon-line" :style="[lineColor(item)]"></view>
                </view>
                <view class="faas-coupon-bottom">
                  <view class="faas-coupon-time">
                    {{ item.beginTime}} -
                    {{ item.endTime}}
                  </view>
                </view>
                <view v-if="!item.isAvailable" class="faas-coupon-footer">未达商品使用门槛金额</view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>


export default {
  name: "detail-shipping-address",
  components: {},
  props: {
    value: {
      type: Boolean,
    },
    coupon: {
      type: Array,
      default: function() {
        return [];
      },
    },
    memberCouponId: {
      type: Number,
    },
  },
  computed: {
    showModal: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      },
    },
    lineColor: function() {
      return (item) => {
        let color = '#FF0505';
        if (!item.isAvailable) {
          color = "#cccccc";
        }
        return {
          backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} 50%, transparent 0%)`,
        };
      };
    },
  },
  filters: {
    setNumber: function(num) {
      return Number(num);
    },
  },
  methods: {
    apply: function(item) {
      // 可使用优惠券
      if (item.isAvailable) {
        this.coupon.forEach(function(item) {
          item.radio = false;
        });
        debugger
        if (this.memberCouponId !== item.id) {
          item.radio = true;
          this.$emit("apply", item.id);
        } else {
          this.$emit("apply", null);
        }
        this.showModal = false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.server-modal-box {
  width: 750rpx;
  border-radius: 30rpx 30rpx 0 0;
  background: #fff;
  padding: 30rpx;
  .modal-head {
    margin-bottom: 30rpx;
    position: relative;
    .head-title {
      //font-size: 32rpx;
      font-weight: bold;
    }
  }
  .modal-content {
    overflow-y: auto;
  }
}
.detail-shipping-address {
  height: 63vh;
}

.flex-sub {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.flex-twice {
  -webkit-box-flex: 2;
  -webkit-flex: 2;
  flex: 2;
}
.faas-body-scroll {
  height: 100%;
  overflow: hidden;
  padding-bottom: 10rpx;
}

.faas-coupon-item {
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  .faas-coupon-bottom,
  .faas-coupon-top {
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-color: $mszf-theme-color !important;
  }
  .faas-coupon-top {
    height: 152rpx;
    border-top: 1rpx solid transparent;
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
    padding-left: 16rpx;
    position: relative;
    .faas-coupon-recommended {
      position: absolute;
      top: 0;
      right: 0;
      width: 102rpx;
      height: 40rpx;
      background-color: $mszf-theme-color !important;
      border-radius: 0rpx 16rpx 0rpx 16rpx;
      font-size: 22rpx;
      font-weight: 500;
      color: #fffefe;
      padding-left: 14rpx;
    }
    .icontuijian {
      font-size: 24rpx;
      margin-right: 8rpx;
    }
    .faas-coupon-number {
      width: 200rpx;
      padding: 36rpx 0 28rpx 0;
      text-align: center;
    }
    .faas-coupon-condition,
    .faas-coupon-price {
      color: $mszf-theme-color !important;
    }
    .faas-coupon-price {
      font-size: 50rpx;
      font-family: DIN;
      font-weight: bold;
      line-height: 52rpx;
    }
    .faas-coupon-price::before {
      content: "¥";
      font-size: 24rpx;
      font-weight: 500;
    }
    .faas-coupon-condition {
      font-size: 24rpx;
      font-weight: 500;
      line-height: 36rpx;
    }
    .faas-coupon-content {
      padding-left: 16rpx;
      .faas-coupon-text {
        text-align: left;
        font-weight: 500;
        padding: 42rpx 0 34rpx 0;
      }
      .faas-coupon-name {
        font-size: 30rpx;
        color: #222222;
        line-height: 40rpx;
      }
      .faas-coupon-available {
        font-size: 22rpx;
        color: #999999;
        line-height: 28rpx;
        margin-top: 8rpx;
      }
      .faas-coupon-radio {
        width: 130rpx;
      }
    }
  }
  .faas-coupon-center {
    height: 16rpx;
    position: relative;
    overflow: hidden;
    .faas-coupon-block {
      width: 16rpx;
      height: 16rpx;
      position: absolute;
      border: 1rpx solid transparent;
      border-radius: 50%;
      background: #fff;
      border-color:$mszf-theme-color !important;
    }
    .faas-coupon-block:first-child {
      left: 0;
      transform: translateX(-50%);
    }
    .faas-coupon-block:nth-child(2) {
      right: 0;
      transform: translateX(50%);
    }
    .faas-coupon-line {
      position: absolute;
      height: 1rpx;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 96%;
      background-size: 14rpx 1rpx;
      background-repeat: repeat-x;
    }
  }
  .faas-coupon-bottom {
    height: 56rpx;
    border-bottom: 1rpx solid transparent;
    border-bottom-left-radius: 16rpx;
    border-bottom-right-radius: 16rpx;
    .faas-coupon-time {
      font-size: 22rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 44rpx;
      padding-left: 23rpx;
    }
  }
}

.faas-coupon-item-radio {
  background-color:rgba(255,127,0,.05) !important;
}

.faas-coupon-item.faas-coupon-item-unavailable {
  background: #f5f5f5;
  .faas-coupon-top,
  .faas-coupon-bottom {
    border-color: #cccccc !important;
    background: #fff;
  }
  .faas-coupon-top {
    .faas-coupon-price,
    .faas-coupon-condition {
      color: #999999 !important;
    }
  }

  .faas-coupon-center {
    background: #fff;
    .faas-coupon-block {
      border-color: #cccccc !important;
    }
  }
  .faas-coupon-footer {
    height: 64rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #222222;
    line-height: 64rpx;
    padding-left: 24rpx;
  }
}
</style>