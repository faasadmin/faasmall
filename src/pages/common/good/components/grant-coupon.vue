<template>
  <view class="sh-server-box">
    <u-toast ref="uToast"></u-toast>
    <view style="padding: 20rpx;height:100rpx;display: flex;justify-content: space-between;align-items: center;background: #FFFFFF" @tap="showModal = true">
      <view>
        <text class="title">优惠卷</text>
      </view>
      <view style="width: 510rpx">
        <scroll-view  scroll-x="true" @scroll="scroll" scroll-left="120">
          <view class="" style="white-space: nowrap;display: flex;align-items: center;height: 80rpx">
            <view class="coupon d-inline-block" v-for="grantCoupon in grantCouponList" :key="grantCoupon.id">{{grantCoupon.name}}</view>
          </view>
        </scroll-view>
      </view>
      <view class="right-icon"><text class="iconfont icon-page-next1"></text></view>
    </view>
    <u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
      <view class=" server-modal">
        <view class="server-modal-box page_box">
          <view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">优惠卷</text></view>
          <view class="modal-content content_box">
            <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" style="height: 800rpx;">
              <view class="coupon-one-style-item" v-for="item in grantCouponList" :key="item.id">
                <view class="coupon-one-style-left">
                  <view class="fm-item-price">{{item.discountPrice | setNumber}}</view>
                </view>
                <view class="coupon-one-style-center">
                  <view class="coupon-one-style-doc"></view>
                  <view class="coupon-one-style-doc"></view>
                  <view class="fm-border-line"></view>
                </view>
                <view class="coupon-one-style-right">
                  <view class="fm-right-left">
                    <view class="fm-item-prompt">{{item.specifyType === 1 ? "全部商品可用" : "部分商品可用" }}</view>
                    <view class="fm-item-condition">
                      <template v-if="Number(item.thresholdPrice) > 0">
                        满{{ item.thresholdPrice | setNumber }}可用
                      </template>
                      <template v-else> 无门槛 </template>
                    </view>
                  </view>
                  <view class="fm-right-right">
                    <template>
                      <u-button v-if="item.receive" type="primary" shape="circle" text="已领取">已领取</u-button>
                      <u-button v-else type="error" shape="circle" text="已领取" @click="receive(item.id)">立即领取</u-button>
                    </template>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

    </u-popup>
  </view>
</template>

<script>
import {receiveCoupon} from "@/faasmall/api/coupon";

export default {
  components: {},
  data() {
    return {
      scrollTop: 0,
      showModal: false
    };
  },
  filters: {
    setNumber: function(num) {
      return Number(num);
    },
  },
  props: {
    grantCouponList: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  methods: {
    scroll(){

    },
    receive(couponId){
      receiveCoupon({id:couponId}).then((res)=>{
        debugger
        if(res.code === 0){
          this.$refs.uToast.show({
            title: '领取成功',
            type: 'success'
          })
          this.grantCouponList.forEach(el => {
            if(el.id === couponId){
               el.receive = true;
            }
          })
        }
      }).catch(err=>{
        console.error(err);
      })
    }
  }
};
</script>

<style lang="scss">
.server-modal-box {
  width: 750rpx;
  border-radius: 30rpx 30rpx 0 0;
  background: #fff;
  padding: 30rpx;
  .modal-head {
    margin-bottom: 30rpx;
    position: relative;
    .head-title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  .modal-content {
    overflow-y: auto;
  }
}
</style>
