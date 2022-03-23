<template>
  <view>
    <faasmall-navbar title="订单详情" :is-back="true"></faasmall-navbar>
    <u-toast ref="uToast" />
    <view class="order-details">
      <view class="header-bg"></view>
      <view class="main">
        <view class="header" style="display: flex;justify-content: space-between;align-items: center">
          <view>
            <view class="item" style="color: #FFFFFF;">
              {{getStatus(orderInfo.status)}}
            </view>
            <!-- 是否开启待付款订单取消时间 -->
            <view class="item" style="color: #FFFFFF;" v-if="tradeData.autoCancelStatus===1 && orderInfo.status === 1">
              剩{{ h }}小时{{i}}分钟自动关闭
            </view>
            <view class="item" style="color: #FFFFFF;" v-if="orderInfo.status === 2">
              剩{{d}}天{{ h }}小时自动确认收货
            </view>
            <view class="item" style="color: #FFFFFF;" v-if="orderInfo.status === 7">
              超时未付款
            </view>
            <view class="item" style="color: #FFFFFF;" v-else-if="orderInfo.status === 8 || orderInfo.status === 6">
              订单已取消
            </view>
          </view>
          <u-image width="120rpx" height="120rpx" :src="orderInfo.statusImg"></u-image>
        </view>
        <view class="address-wrap row contain row-center-start">
          <u-image width="60rpx" height="60rpx" src="/static/img/user/address.png"></u-image>
          <view class="address">
            <view>
              <view class="mb-1">
                <text class="name md mr-2">{{orderInfo.buyer.name}}</text>
                <text class="phone md">{{orderInfo.buyer.mobile}}</text>
              </view>
              <view class="area sm mt10 lighter">{{orderInfo.buyer.province}}{{orderInfo.buyer.city}}{{orderInfo.buyer.district}}{{orderInfo.buyer.address}}</view>
            </view>
          </view>
        </view>
        <view class="goods contain">
          <view class="order-goods bg-white">
            <view  class="item-wrap">
              <view class="item row row-center-start" style="padding-left: 40rpx" v-for="good in orderInfo.goodList" :key="good.id">
                <view class="goods-img">
                  <u-image class="mr5" :src="good.thumbnail"  width="120rpx" height="120rpx" ></u-image>
                </view>
                <view class="goods-info ml-1 flex1">
                  <view class="goods-name line2 mb10">
                    {{good.goodName}}
                  </view>
                  <view class="goods-spec xs muted mb-1">数量:{{good.goodNumber}} {{good.goodSkuName}}</view>
                  <view class="row-content-between">
                    <view class="goods-price ">
                      <view class="primary">
                        ￥{{good.goodSellingPrice}}
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="footer row" >
                <u-button shape="square" v-if="(orderInfo.status === 4 || orderInfo.status === 5) && orderInfo.evaluate === 0">评价晒图</u-button>
                <u-button shape="square" v-if="orderInfo.status === 2 && orderInfo.goodList.length > 1">整单退款</u-button>
                <u-button shape="square" v-if="orderInfo.status === 3">确认收货</u-button>
                <template shape="square" v-if="orderInfo.status === 1">
                  <view class="he-pay-price flex align-center">
                    <text class="he-label">实付金额</text>
                    <text class="he-value">¥{{ orderInfo.payAmount }}</text>
                  </view>
                  <view style="flex: 1"></view>
                  <u-button shape="square" v-if="shopData.operatingStatus === 1" @click="toPay">立即支付</u-button>
                  <u-button shape="square" v-else>已打样</u-button>
                </template>
              </view>
            </view>
          </view>
        </view>
        <view class="price contain" style="padding: 10px 0px;">
          <view class="row-center-between">
            <view>商品总额</view>
            <view class="black">
              ￥{{orderInfo.goodAmount}}
            </view>
          </view>
          <view class="row-center-between">
            <view>运费</view>
            <view class="black">￥{{orderInfo.freightAmount}}
            </view>
          </view>
          <view class="row-center-between">
            <view class="lighter">实付金额</view>
            <view class="primary xl">
              ￥{{orderInfo.payAmount}}
            </view>
          </view>
        </view>
        <view class="order-info contain">
          <view class="item row" style="align-items: flex-start;">
            <view class="title">买家留言</view>
            <view class="black">{{orderInfo.buyer.remark || '无'}}</view>
          </view>
        </view>
        <view class="order-info contain">
          <view class="item row">
            <view class="title">订单编号</view>
            <view class="black">{{orderInfo.orderSn}}</view>
          </view>
          <view class="item row" v-if="orderInfo.payType">
            <view class="title">支付方式</view>
            <view class="black">{{getPayMethod(orderInfo.payType)}}</view>
          </view>
          <view class="item row">
            <view class="title">下单时间</view>
            <view class="black">{{orderInfo.createTime}}</view>
          </view>
          <view  class="item row" v-if="orderInfo.payTime">
            <view class="title">付款时间</view>
            <view class="black">{{orderInfo.payTime}}</view>
          </view>
          <view  class="item row" v-if="(orderInfo.status === 3 || orderInfo.status === 4 || orderInfo.status === 5) && orderInfo.sendTime">
            <view class="title">发货时间</view>
            <view class="black">{{orderInfo.sendTime}}</view>
          </view>
          <view  class="item row" v-if="(orderInfo.status === 4 || orderInfo.status === 5) && orderInfo.receivedTime">
            <view class="title">收货时间</view>
            <view class="black">{{orderInfo.receivedTime}}</view>
          </view>
          <view  class="item row" v-if="(orderInfo.status === 5) && orderInfo.finishTime">
            <view class="title">完成时间</view>
            <view class="black">{{orderInfo.finishTime}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {pay} from "@/faasmall/api/pay";
import {freePay, getOrderDetail, getOrderInfo, getPre, verifyPay} from "@/faasmall/api/order";
import {mapGetters} from "vuex";
export default {
  name: "info",
  components:{

  },
  data() {
    return {
      orderInfo: {
        buyer:{}
      },
      team: {},
      isFirstLoading: true,
      type: 0,
      cancelTime: 0,
      showCancel: "",
      showLoading: false,
      id:'',
      d: '00',
      h: '00', // 小时的默认值
      i: '00', // 分钟的默认值
      timestamp: 0,
      timer: null, // 定时器
      seconds: 0
    };
  },
  computed: {
    ...mapGetters(['tradeData','shopData']),
  },
  watch: {
    timestamp() {
      this.clearTimer();
      this.start();
    }
  },
  onShow(){
    this.id = this.$Route.query.id;
    debugger
    this.init();
    let _this = this;
    let end = null;
    setTimeout(function() {
      console.log(_this.orderInfo.createTime);
      console.info(new Date(_this.orderInfo.createTime).getTime()/1000);
      debugger
      if (_this.orderInfo.status !== 3) {
        end = ((new Date(_this.orderInfo.createTime)).getTime()/1000) * 1000 + _this.tradeData.autoCancelTime * 3600000;
      } else {
        end = _this.tradeData.autoConfirmReceivedTime * 1000;
      }
      let start = Date.now();
      let difference = end - start;
      if (difference > 0) {
        _this.timestamp = difference / 1000;
      } else {
        _this.timestamp = 0;
      }
    }, 800);
  },
  onLoad(){

  },
  mounted() {

  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods:{
    init(){
      var that = this;
      getOrderInfo({id:this.id}).then(function (res) {
        debugger
        if(res.code === 0){
          that.orderInfo = res.data;
          if (that.orderInfo.afterSales === 0) {
            switch (that.orderInfo.status) {
              case 1:
                // 支付
                that.orderInfo.statusImg = '/static/img/order/order-pay.png';
                break;
              case 2:
                // 发货
                that.orderInfo.statusImg = '/static/img/order/order-ship.png';
                break;
              case 3:
                // 收货
                that.orderInfo.statusImg = '/static/img/order/order-receipt.png';
                break;
              case 4:
                // 完成
                that.orderInfo.statusImg = '/static/img/order/order-success.png';
                break;
              case 5:
                that.orderInfo.statusImg = '/static/img/order/order-success.png';
                break;
              case 6:
                that.orderInfo.statusImg = '/static/img/order/order-close.png';
                break;
              case 7:
                that.orderInfo.statusImg = '/static/img/order/order-close.png';
                break;
              case 8:
                that.orderInfo.statusImg = '/static/img/order/order-close.png';
                break;
              default:
                that.orderInfo.statusImg = '/static/img/order/order-close.png';
                break;
            }
          } else if (that.orderInfo.afterSales === 1) {
            switch (that.orderInfo.status) {
              case 8:
                that.orderInfo.statusImg = "/static/img/order/order-complete.png";
                break;
            }
          }
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
    toPay(){
      var that = this;
      verifyPay({id:that.id}).then(function (res) {
        debugger
          if(res.code === 0){
            debugger
            if(res.data){
              that.$Router.push({
                path: '/pages/common/pay/method',
                query: {
                  orderId: that.id,
                }
              });
            }else {
              debugger
              freePay({id:that.id}).then((res)=>{
                debugger
                if (res.code === 0) {
                  that.$refs.uToast.show({
                    title: '支付成功',
                    type: 'success',
                  })
                  setTimeout(() => {
                    uni.redirectTo({
                      url: '/pages/common/order/list'
                    });
                  }, 500);
                }else{
                  uni.showToast({
                    title: res.msg,
                    duration: 2000,
                    icon: "none",
                  });
                }
              }).catch(function (e) {
                console.error(e);
              });
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
    getPayMethod(method){
      switch (method) {
        case 1:
          return '微信';
        case 2:
          return '支付宝';
        case 3:
          return '余额';
      }
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return '等待买家付款';
        case 2:
          return '等待卖家发货';
        case 3:
          return '等待买家收货';
        case 4:
          return '交易成功';
        case 5:
          return '已完成';
        case 6:
          return '已关闭';
        case 7:
          return '已关闭';
        case 8:
          return '已关闭';
        default:
          return '';
      }
    },
    // 倒计时
    start() {
      debugger
      // 避免可能出现的倒计时重叠情况
      let _this = this;
      this.clearTimer();
      if (this.timestamp <= 0) return;
      this.seconds = Number(this.timestamp);
      this.formatTime(this.seconds);
      this.timer = setInterval(function() {
        _this.seconds--;
        if (_this.seconds < 0) {
          return _this.end();
        }
        _this.formatTime(_this.seconds);
      }, 1000);
    },
    // 格式化时间
    formatTime(seconds) {
      seconds <= 0 && this.end();
      let [day, hour, minute] = [0, 0, 0];
      day = Math.floor(seconds / (60 * 60 * 24));
      hour = Math.floor(seconds / (60 * 60)) - day * 24;
      let showHour = null;
      showHour = Math.floor(seconds / (60 * 60));
      minute = Math.floor(seconds / 60) - hour * 60 - day * 24 * 60;
      showHour = showHour < 10 ? '0' + showHour : showHour;
      minute = minute < 10 ? '0' + minute : minute;
      if (this.status !== 202) {
        this.h = showHour;
      } else {
        this.d = day;
        this.h = hour;
      }
      this.i = minute;
    },
    end: function() {
      this.clearTimer();
    },
    // 清除定时器
    clearTimer() {
      if (this.timer) {
        // 清除定时器
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
}
</script>

<style lang="scss">

.order-goods {
  .item {
    padding: 20rpx 24rpx;
  }
  .goods-footer {
    height: 70rpx;
    align-items: flex-start;
    padding: 0 24rpx;
    .plain {
      border: 1px solid #999;
      height: 52rpx;
      line-height: 52rpx;
      font-size: 26rpx;
    }
  }
}

.order-details {
  position: relative;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.order-details .header-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 260rpx;
  background-color: #FF0505;
  z-index: 0;
}

.order-details .goods .status {
  height: 88rpx;
  padding: 0 20rpx;
}

.order-details .main {
  position: relative;
  z-index: 1;
}

.order-details .contain {
  margin: 0 20rpx 20rpx;
  border-radius: 14rpx;
  background-color: #fff;
}

.order-details .header {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.order-details .img-line {
  height: 1.5px;
  width: 100%;
  display: block;
}

.order-details .address-wrap {
  height: 164rpx;
  padding: 0 24rpx;
}

.order-details .order-info {
  padding: 12rpx 20rpx;
}

.order-details .order-info .item {
  padding: 12rpx 24rpx;
}

.order-details .order-info .item .title {
  width: 140rpx;
  flex: none;
}

.order-details .price>view {
  height: 60rpx;
  padding: 0 24rpx;
}

.order-details .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  padding: 0 24rpx;
  box-sizing: content-box;
  //padding-bottom: env(safe-area-inset-bottom);
  background: #FFFFFF;
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
}

.footer .plain {
  border: 1px solid #BBBBBB;
}

.footer .plain.red {
  border: 1px solid #00ff00;
}
</style>
