<!-- 收银台 -->
<template>
  <view>
    <view class="pay-method-wrap">
      <view class="u-flex-col u-col-center money-box">
        <text class="time" v-show="isCountDown">{{ timeText }}</text>
        <view class="money">{{orderInfo.payAmount || '0.00'}}</view>
      </view>
      <!-- 支付方式单选项 -->
      <u-radio-group v-if="paymentData.payType.length"  class="pay-box" v-model="payType" active-color="#FF0505">
        <!-- 微信支付 -->
        <view class="u-flex u-row-between pay-item" v-show="paymentData.payType.includes('wx')" @tap="payType = 'wx'">
          <view class="u-flex">
            <text class="iconfont icon-weixinzhifu" style="color: #1afa29;font-size: 30px;margin-right: 6rpx"></text>
            <text>微信支付</text>
          </view>
          <u-radio shape="circle" name="wx"></u-radio>
        </view>
        <!-- 支付宝支付 -->
        <view class="u-flex u-row-between pay-item" v-show="paymentData.payType.includes('alipay')" @tap="payType = 'alipay'">
          <view class="u-flex">
            <text class="iconfont icon-zhifubaozhifu" style="color: #1296db;font-size: 30px;margin-right: 6rpx"></text>
            <text>支付宝支付</text>
          </view>
          <u-radio shape="circle" name="alipay"></u-radio>
        </view>
        <!-- 余额支付 -->
        <view class="u-flex u-row-between pay-item" v-show="paymentData.payType.includes('wallet')"  @tap="payType = 'wallet'">
          <view class="u-flex">
            <text class="iconfont icon-yue" style="color: #d81e06;font-size: 30px;margin-right: 6rpx"></text>
            <text>余额支付</text>
          </view>
          <u-radio shape="circle" name="wallet"></u-radio>
        </view>
      </u-radio-group>
      <button class="u-reset-button pay-btn" @click="confirmPay">确认支付 ￥{{orderInfo.payAmount || '0.00'}}</button>
    </view>
  </view>
</template>

<script>
import Pay from '@/faasmall/common/pay';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import {freePay, getOrderInfo, verifyPay} from "@/faasmall/api/order";
let timer;
export default {
  components: {},
  data() {
    return {
      //订单ID
      id:'',
      payType: '', //支付方式
      isCountDown: true, //是否显示订单倒计时。
      orderInfo: {},//订单信息
      timeText: '', //倒计时文本
      platform: '',
      appPlatfrom: ''
    };
  },
  computed: {
    ...mapGetters(['paymentData','tradeData']),
  },
  onShow() {

  },
  onLoad() {
    this.id = this.$Route.query.orderId;
    this.init();
  },
  onHide() {
    clearInterval(timer);
    timer = null;
  },
  methods: {
    getOrderDetail(){
      var that = this;
      getOrderInfo({id:this.id}).then(function (res) {
        debugger
        if(res.code === 0){
          that.orderInfo = res.data;
          debugger
          if (that.paymentData.payType.length) {
            that.payType = that.paymentData.defPay;
          }
          that.countDown();
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(function (e) {
         console.error(e);
      });
    },
    init(){
      var that = this;
      verifyPay({id:that.id}).then(function (res) {
        debugger
        if(res.code === 0){
          debugger
          if(res.data){
            that.getOrderDetail();
          }
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(function (e) {
        console.error(e);
      });
    },
    // 倒计时
    countDown() {
      let that = this;
      console.info(that.orderInfo.createTime);
      let t =  parseInt(((new Date(that.orderInfo.createTime)).getTime()/1000) * 1000 + that.tradeData.autoCancelTime * 3600000) - parseInt(new Date().getTime());
      debugger
      t = t / 1000;
      timer = setInterval(() => {
        if (t > 0) {
          let time = that.$tool.format(t);
          that.timeText = `支付剩余时间 ${time.m}:${time.s}`;
          t--;
        } else {
          clearInterval(timer);
          that.timeText = '订单已过期!';
        }
      }, 1000);
    },
    // 发起支付
    confirmPay() {
      let that = this;
      let pay = null;
      if (!that.payType) {
        this.$u.toast('请选择支付方式');
        return;
      }
      if (that.payType === 3) {
        uni.showModal({
          title: '支付提示',
          confirmColor: '#FF0505',
          content: `是否确认使用余额支付:${that.orderInfo.payAmount || '0.00'}元?`,
          success: res => {
            if (res.confirm) {
              pay = new Pay(that.payType, that.orderInfo);
            }
          }
        });
      } else {
        pay = new Pay(that.payType, that.orderInfo);
      }
    },
  }
};
</script>

<style lang="scss">
.money-box {
  background: #fff;
  height: 250rpx;
  margin-bottom: 20rpx;
  padding-top: 30rpx;

  .time {
    font-size: 28rpx;
    color: #c4c4c4;
  }

  .money {
    color: #e1212b;
    font-size: 60rpx;
    margin-top: 60rpx;

    &::before {
      content: '￥';
      font-size: 46rpx;
    }
  }
}

.pay-box {
  .pay-item {
    height: 90rpx;
    padding: 0 30rpx;
    font-size: 26rpx;
    background: #fff;
    width: 750rpx;
    border-bottom: 1rpx solid #eeeeee;

    &:last-child {
      border-bottom: none;
    }

    .pay-img {
      width: 40rpx;
      height: 40rpx;
      margin-right: 25rpx;
    }
  }
}

.pay-btn {
  width: 690rpx;
  line-height: 80rpx;
  background: $mszf-theme-color;
  border-radius: 40rpx;
  color: rgba(#fff, 0.9);
  margin: 100rpx auto 0;
}
</style>
