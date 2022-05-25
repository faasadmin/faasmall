<template>
  <view class="list-wrap mt-1" style="border-radius: 20rpx">
    <u-toast ref="uToast" />
    <view class="list-item list-item-border-bottom">
      <view class="list-item-left">
        <text> 商品总额</text>
      </view>
      <view class="list-item-right">
        <view class="rightText">
          ￥{{goodAmount}}
        </view>
      </view>
    </view>
    <view class="list-item list-item-border-bottom">
      <view class="list-item-left">
        运费
      </view>
      <view class="list-item-right">
        <view class="rightText">
          ￥{{freightAmount}}
        </view>
      </view>
    </view>
    <view class="list-item list-item-border-bottom" @click="isCoupon = true">
      <view class="list-item-left">
        优惠卷
      </view>
      <view class="list-item-right">
        <view class="flex justify-end align-center">
          <text v-if="possible === 0">暂无可用优惠卷</text>
          <template v-else>
            <text v-if="this.$isEmpty(couponReduced)">{{ possible }}张可用</text>
            <text v-else>-¥{{couponReduced}}</text>
          </template>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
    </view>
    <submit-coupon v-model="isCoupon" :coupon="coupon" :user-coupon-id="memberCouponId" @apply="apply"></submit-coupon>
  </view>
</template>

<script>
import SubmitCoupon from "@/pages/common/order/components/submit-coupon";
import {getMemeberAvailableCouponList} from "@/faasmall/api/member";
export default {
  name: "submit-expense",
  components: {SubmitCoupon},
  data() {
    return {
      isCoupon: false,
      coupon: [],
      possible: 0
    };
  },
  props: {
    goodList: {
      type: Array
    },
    goodAmount: {
      type: Number
    },
    freightAmount: {
      type: Number
    },
    couponReduced: {
      type: [Number, String]
    },
    memberCouponId: {
      type: Number
    },
  },
  mounted() {

  },
  methods:{
    apply: function (cuponId) {
      this.$emit('apply', cuponId);
    },
    getCoupon: function () {
      debugger
      let _this = this;
      return new Promise(function (resolve, reject) {
        let ids = _this.goodList.map(function (item) {
          return item.goodId;
        });
        getMemeberAvailableCouponList({ids:ids}).then(function (response) {
          let list = response.data;
          list.forEach(function (item) {
            item.radio = false;
            debugger
            //判断门槛金额
            if (Number(item.thresholdPrice) > _this.goodAmount) {
              item.isAvailable = 0;
            } else {
              item.isAvailable = 1;
            }
          });
          list = list.sort(function (a, b) {
            return b.isAvailable - a.isAvailable;
          });
          _this.possible = list.filter(item => item.isAvailable === 1).length;
          _this.coupon = list;
          resolve();
        }).catch(function (error) {
          _this.$refs.uToast.show({
              title: error.msg,
              type: 'error',
            })
            reject();
         });
      });
    }
  },
  watch:{
    goodAmount:{
      deep:true,
      handler:function(){
        this.getCoupon();
      }
    }
  }
}
</script>

<style scoped>

</style>