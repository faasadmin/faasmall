<template>
    <view class="submit-container">
      <u-toast ref="uToast" />
      <view class="container">
        <submit-address :address-data="addressData"></submit-address>
        <submit-product :good-list="orderInfo.goodsData"></submit-product>
        <submit-expense @apply="couponPreview" :good-list="goodList" :member-coupon-id="memberCouponId" :coupon-reduced="orderInfo.couponReduced" :freight-amount="orderInfo.freightAmount" :good-amount="orderInfo.goodAmount"></submit-expense>
        <submit-comments :comments="comments"></submit-comments>
      </view>
      <view style="height: 10rpx"></view>
      <submit-button
          @submit="submitOrders"
          :pay-amount="orderInfo.payAmount"
          :disabled="disabled"
          :quantity="orderInfo.quantity"
      ></submit-button>
    </view>
</template>

<script>
import vkDataInputNumberBox from '../../../components/vk-data-input-number-box/vk-data-input-number-box';
import {getPre, submitOrders} from "@/faasmall/api/order";
import {getDefaultAddress} from "@/faasmall/api/address";
import submitAddress from './components/submit-address.vue';
import submitProduct from './components/submit-product.vue';
import {
  getSystemInfo,
  isEmpty,
  isNotEmpty
} from "@/faasmall/utils/faasmall";
import SubmitExpense from "@/pages/common/order/components/submit-expense";
import SubmitComments from "@/pages/common/order/components/submit-comments";
import SubmitButton from "@/pages/common/order/components/submit-button";
import $platform from "@/faasmall/utils/platform";
export default {
  components:{
    SubmitButton,
    SubmitComments,
    SubmitExpense,
    vkDataInputNumberBox,
    submitAddress,
    submitProduct,
  },
  name: "submit",
  data(){
    return{
      disabled:true,
      //商品列表
      goodList:[],
      //订单信息
      orderInfo:{
        goodsData:[],
      },
      //留言
      comments:'',
      //商品总计
      totalNum:0,
      //来源
      source:'',
      //订单类型
      type:1,
      //平台
      platform: $platform.get(),
      //地址
      addressData:{},
      //用户使用的优惠卷
      memberCouponId:null,
    }
  },
  onLoad(){
    this.goodList = this.$Route.query.goodList;
    this.source = this.$Route.query.source;
    this.type = this.$Route.query.type ? 1: this.$Route.query.type;
    this.init();
  },
  onShow(){
    // 收货地址
    uni.$on('SHIPPING_ADDRESS', res => {
      debugger
      if (res.addressData) {
        this.addressData = JSON.parse(res.addressData);
      }
      console.log(this.addressData);
      this.getPreOrder();
      res.addressData && uni.$off('SHIPPING_ADDRESS');
    });
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    if(isNotEmpty(currPage.comments)){
      let res = currPage.comments;
      console.log(res)//为传过来的值
      this.comments = res;
    }
  },
  computed:{

  },
  methods:{
    init(){
      uni.showLoading({
        title: '加载中...',
        mask: true
      });
      this.getDefAddress();
      uni.hideLoading();
      // this.getPreOrder();
      // return Promise.all([this.getDefAddress(),this.getPreOrder()]).then(() => {
      //   uni.hideLoading();
      // });
    },
    couponPreview: function (memberCouponId) {
      this.memberCouponId = memberCouponId;
      this.getPreOrder();
    },
    // 路由跳转
    jump(path, parmas) {
      this.$Router.push({
        path: path,
        query: parmas
      });
    },
    //默认收货地址
     getDefAddress(){
       let _this = this;
       getDefaultAddress().then((res)=>{
         debugger
         if (res.code === 0 && res.data) {
           _this.addressData = res.data;
         }
         _this.getPreOrder();
       }).catch(function(err) {
         console.info(err);
       })
    },
    //获取订单信息
    getPreOrder(){
      let _this = this;
      debugger
      getPre({
        goodList:_this.goodList,
        memberCouponId: _this.memberCouponId,
        addressId: _this.addressData.id,
        source:_this.source,
        platform:_this.platform,
        type: _this.type
      }).then((res)=>{
        debugger
        if (res.code === 0) {
          _this.disabled = false;
          _this.orderInfo = res.data;
        }
      }).catch(function (err) {
        _this.disabled = true;
        console.info(err);
      })
    },
    submitOrders(){
      if(this.$isEmpty(this.addressData.id)){
        this.$refs.uToast.show({
          title: '收货地址不能为空',
          type: 'error',
        })
        return;
      }
      submitOrders({
        goodList:this.goodList,
        memberCouponId: this.memberCouponId,
        addressId:this.addressData.id,
        message:this.message,
        source:this.source,
        platform:this.platform,
        type: this.type
      }).then((res)=>{
        if(res.code === 0){
          if(this.$isNotEmpty(res.data.error)){
            this.$refs.uToast.show({
              title: res.msg,
              type: 'error',
            })
            return;
          }
          if(res.data.pay){
            this.$Router.replace({
              path: res.data.pay ? `/pages/common/pay/method` : `/pages/common/pay/result`,
              query: {
                orderId: res.data.id,
                orderSn: res.data.orderSn,
                payState: res.data.pay ? 'pay':'success'
              }
            });
          }
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'error',
          })
        }
      }).catch(error=>{
        console.error(error)
      })
    },
    addAddress(){
      uni.navigateTo({
        url: '/pages/common/address/list'
      });
    }
  }
}
</script>

<style scoped>
.submit-container{
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}
</style>