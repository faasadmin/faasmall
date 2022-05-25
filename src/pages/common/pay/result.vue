<template>
  <view class="faas-page-content" :class="loading ? 'row-center-center' : ''">
    <u-loading mode="circle" v-if="loading"></u-loading>
    <view v-else>
      <view class="faas-header">
        <view class="row-center-center faas-header-top">
          <image class="faas-image" :src="$FILE_URL + '/file/img/order/order-pay-success.png'"></image>
          <view class="row-center-center col faas-text">
            <view class="faas-title">订单支付成功</view>
            <view class="faas-total">￥{{ totalAmount }}</view>
          </view>
        </view>
        <view class="faas-header-bottom row-center-center">
          <button class="u-reset-button fs-btn" @click="switchTab">返回首页</button>
          <button class="u-reset-button fs-btn" @click="redirectTo('/pages/common/order/info?id=' + orderId)">查看详情</button>
        </view>
        <view class="faas-coupon" v-if="$isNotEmpty(couponList)">
          <view class="faas-coupon-head">
            <text class="faas-coupon-head-text">恭喜！获得优惠券</text>
          </view>
          <scroll-view scroll-y class="faas-coupon-body">
            <view class="faas-coupon-item flex" v-for="(item, index) in couponList" :key="index">
              <view class="faas-coupon-left">
                <view class="faas-item-price">{{ item.discountPrice | setNumber }}</view>
                <view class="faas-item-condition">
                  <template v-if="Number(item.thresholdPrice) > 0">
                    满{{ item.thresholdPrice | setNumber }}可用
                  </template>
                  <template v-else> 无门槛</template>
                </view>
              </view>
              <view class="faas-coupon-center">
                <view class="faas-coupon-doc"></view>
                <view class="faas-coupon-doc"></view>
                <view class="faas-border-line" :style="[lineColor]"></view>
              </view>
              <view class="faas-coupon-right flex">
                <view class="faas-right-left">
                  <view class="faas-item-name">{{ item.name }}</view>
                  <view class="faas-item-prompt"
                  >{{ item.specifyType === 1 ? '全部商品可用' : '部分商品可用' }}
                  </view>
                </view>
                <view class="faas-right-right row-center-center">
                  <button
                      class="u-reset-button fs-btn faas-fs-btn faas-right-right_btn"
                      @click="redirectTo('/pages/common/good/list?couponId=' + item.id)"
                  >
                    去使用
                  </button>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="faas-goods-list" :style="[goodsStyle]" v-if="shopData.recommendShowPage.concat('paySuccess')">
        <good-recommend></good-recommend>
      </view>
    </view>
    <view v-for="(item, index) in popupsList">
      <task-popup v-model="item.display" :title="item.remark" :index="index" :key="index" :top="300"></task-popup>
    </view>
    <!-- 开启分销商 且有条件 且不是分销商 -->
    <u-popup v-model="showApplyPromoter">
      <view class="faas-empty-popup">
        <view class="faas-top" :style="{ height: '146rpx', lineHeight: '146rpx' }">恭喜您！您已获得成为分销资格</view>
        <view class="faas-bottom" style="display: flex;justify-content: space-between;align-items: flex-end;">
          <button class="u-reset-button fs-btn">暂不申请</button>
          <view class="faas-line"></view>
          <button class="u-reset-button fs-btn" @click="routerPromoter">立即申请</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import taskPopup from '@/pages/common/task/components/popup.vue';
import goodRecommend from '@/pages/common/good/components/good-recommend.vue'
import {getMemberCouponByOrderSn, getMemeberCouponPage} from "@/faasmall/api/member";
import {getOrderInfo} from "@/faasmall/api/order";
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
  name: 'successful',
  components: {
    taskPopup,
    goodRecommend
  },
  data() {
    const _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      popupsList: [],
      totalAmount: 0,
      orderId: null,
      orderSn: null,
      couponList: [],
      loading: true,
      applyPromoter: false
    };
  },
  computed: {
    ...mapGetters({
      shopData:'shopData',
      distributionBasisData: 'distributionBasisData'
    }),
    lineColor: function () {
      return {
        //backgroundImage: `linear-gradient(to bottom, ${this.themeColor} 0%, ${this.themeColor} 50%, transparent 0%)`
      };
    },
    goodsStyle: function () {
      let style = {
        borderRadius: '16rpx 16rpx 0 0'
      };
      if (this.$isNotEmpty(this.coupon)) {
        style.borderRadius = '0';
      }
      return style;
    },
    memberInfo: function ({ $store }) {
      return $store.state.member.memberInfo;
    },
    //是否显示分销商申请
    showApplyPromoter({ distributionBasisData, memberInfo }) {
      return (
          distributionBasisData.status ===0 &&
          distributionBasisData.meetConditions !== 1 &&
          (memberInfo.distributionStatus === 6 || memberInfo.distributionStatus === 7 || memberInfo.distributionStatus === 1)
      );
    }
  },
  onLoad(options) {
    this.orderId = options.orderId;
    this.orderSn = options.orderSn;
    this.popupsList = [];
    let _this = this;
    Promise.all([this.getOrder(parseInt(options.orderId)), this.getCouponList(options.orderSn)])
        .then(function () {
          _this.loading = false;
        }).catch(function () {
          _this.loading = false;
        });
  },
  methods: {
    switchTab: function () {
      uni.switchTab({
        url: '/pages/tabbar/main/index'
      });
    },
    redirectTo: function (url) {
      uni.redirectTo({
        url
      });
    },
    getOrder: function (id) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getOrderInfo({id:id}).then(function (res) {
              _this.totalAmount = res.data.payAmount;
              resolve();
            }).catch(function (error) {
              console.error(error);
              reject();
            });
      });
    },
    // 获取购买商品获得的优惠券
    getCouponList: function (order_sn) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getMemberCouponByOrderSn(order_sn).then((res)=>{
          debugger
          if(res.code === 0){
            _this.couponList = res.data;
            resolve();
          } else {
            reject();
          }
        }).catch(error=>{
          console.error(error)
          reject();
        })
      });
    },
    // 满足申请条件 跳转到分销页面
    routerPromoter() {
      uni.redirectTo({
        url: '/pages/common/distribution/recruit'
      });
    }
  },
  filters: {
    setNumber: function (num) {
      return Number(num);
    }
  }
};
</script>
<style scoped lang="scss">
.faas-page-content {
  background-color: #ffffff;
  overflow: hidden;
  height: 100vh;
}

.faas-header {
  width: 750rpx;
  background: #ffffff;
  padding: 0 20rpx;
}

.faas-image {
  width: 156rpx;
  height: 156rpx;
  display: block;
  margin-right: 24rpx;
}

.faas-text {
  margin-left: 24rpx;
}

.faas-title {
  color: #222222;
  line-height: 1.3;
  margin-bottom: 5rpx;
}

.faas-total {
  color:#FF0505;;
  line-height: 1.3;
  margin-top: 5rpx;
}

.faas-header-top {
  margin-top: 56rpx;
}

.faas-header-bottom {
  margin-top: 48rpx;
  margin-bottom: 56rpx;
}
.faas-coupon {
  width: 710rpx;
  max-height: 556rpx;
  background: #fdf5e1;
  border-radius: 16rpx;
  margin: 0 0 32rpx 0;
  padding-top: 20rpx;
  overflow: hidden;
}
.faas-coupon-head {
  height: 56rpx;
  position: relative;
}
.faas-coupon-head-text {
  color: #6b3713;
  z-index: 10;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.faas-coupon-body {
  width: 95%;
  padding: 0 20rpx;
  max-height: 452rpx;
  margin-bottom: 28rpx;
  overflow: hidden;
  .faas-coupon-item {
    height: 160rpx;
    background: #ffffff;
    margin-bottom: 16rpx;
    border-radius: 16rpx;
    .faas-coupon-left {
      width: 217rpx;
      border-top: 2rpx solid transparent;
      border-left: 2rpx solid transparent;
      border-bottom: 2rpx solid transparent;
      border-top-left-radius: 16rpx;
      border-bottom-left-radius: 16rpx;
      border-color:#FF0505;;
      padding: 37rpx 0 35rpx 16rpx;
      text-align: center;

      .faas-item-price {
        line-height: 52rpx;
        color:#FF0505;;
      }

      .faas-item-price:before {
        content: '￥';
        color:#FF0505;;
        line-height: 14rpx;
      }

      .faas-item-condition {
        color:#FF0505;;
        line-height: 36rpx;
      }
    }

    .faas-coupon-center {
      width: 16rpx;
      position: relative;
      overflow: hidden;

      .faas-coupon-doc {
        width: 16rpx;
        height: 16rpx;
        position: absolute;
        border: 2rpx solid transparent;
        border-radius: 50%;
        background: #fdf5e1;
        border-color:#FF0505;
      }
      .faas-coupon-doc:first-child {
        top: 0;
        transform: translateY(-50%);
      }

      .faas-coupon-doc:nth-child(2) {
        bottom: 0;
        transform: translateY(50%);
      }

      .faas-border-line {
        position: absolute;
        height: 132rpx;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2rpx;
        background-size: 2rpx 14rpx;
        background-repeat: repeat-y;
      }
    }

    .faas-coupon-right {
      width: 437rpx;
      border-top: 2rpx solid transparent;
      border-right: 2rpx solid transparent;
      border-bottom: 2rpx solid transparent;
      border-top-right-radius: 16rpx;
      border-bottom-right-radius: 16rpx;
      border-color:#FF0505;

      .faas-right-left {
        width: 297rpx;
        padding: 43rpx 11rpx 41rpx 32rpx;

        .faas-item-name {
          color: #222222;
          line-height: 40rpx;
          margin-bottom: 4rpx;
        }

        .faas-item-prompt {
          color: #999999;
          line-height: 28rpx;
          margin-top: 4rpx;
        }
      }

      .faas-right-right {
        width: 140rpx;

        .faas-fs-btn {
          width: 126rpx;
          height: 48rpx;
          border-radius: 24rpx;
          padding: 0;
        }
        .faas-left-right_btn {
          color: #ffffff;
          background-color:#FF0505;
        }
        .faas-right-right_btn {
          border: 1rpx solid transparent;
          color: #FF0505;
          border-color:#FF0505;
          background-color: #ffffff;
        }
      }
    }
  }
}

.fs-btn {
  width: 190rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fs-btn:first-child {
  border: 1rpx solid #cccccc;
  color: #222222;
  margin-right: 20rpx;
}

.fs-btn:last-child {
  border-style: solid;
  border-width: 1rpx;
  color: #FF0505;
  border-color:#FF0505;
  margin-left: 20rpx;
}

.faas-goods-list {
  background-color: #f5f5f5;
  overflow: hidden;
}

.faas-empty-popup {
  width: 510rpx;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.faas-top {
  color: #222222;
  text-align: center;
  border-bottom: 1rpx solid #e5e5e5;
}

.faas-bottom {
  height: 90rpx;
  position: relative;
}

.faas-line {
  width: 2px;
  height: 88rpx;
  border: 2rpx solid #e5e5e5;
  position: absolute;
  top: 0;
  left: 50%;
}

.fs-btn {
  width: 254.5rpx;
  height: 87rpx;
  background: transparent;
  border-radius: 0;
}

.fs-btn:first-child {
  color: #666666;
}

.fs-btn:last-child {
  color: #FF0505;
}

/* end--iPhoneX底部安全区定义--end */
.u-reset-button {
  padding: 0;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  background-color: transparent;
  color: inherit;
  transform: translate(0rpx, 0rpx);
}
.u-reset-button.button-hover {
  transform: translate(1upx, 1upx);
}
.u-reset-button::after {
  border: none;
}
</style>