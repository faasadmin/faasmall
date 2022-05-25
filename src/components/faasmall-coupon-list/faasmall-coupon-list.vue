<template>
  <view class="coupon-item row-center-between" @tap="selectCoupon">
    <view class="box-con">
      <view class="box-text" v-if="item.type===1">满减卷</view>
      <view class="box-text" v-else>折扣卷</view>
    </view>
    <view class="coupon-money" style="display: flex;flex-direction: column;height: 100%;justify-content: space-between;">
      <view class="flex">
        <view style="display: flex;flex-direction:column;justify-content: center;align-items: center">
          <view :style="{color:theme}">￥{{item.discountPrice}}</view>
          <view>
            <template v-if="Number(item.thresholdPrice) > 0"> 满{{ Number(item.thresholdPrice) }}可用 </template>
            <template v-else> 无门槛使用 </template>
          </view>
        </view>
        <view style="margin-left: 20rpx">
          <view style="display: flex;flex-direction: column">
            <text>{{item.name}}</text>
            <text>{{ item.specifyType === 1 ? '全部商品可用' : '部分商品可用' }}</text>
          </view>
        </view>
      </view>
      <view>
        <view class="end_time">有效期：{{ item.beginTime | timeFormat('yyyy-mm-dd') }} - {{ item.endTime | timeFormat('yyyy-mm-dd') }}</view>
      </view>
    </view>
    <view class="row-center-center" style="height: 100%">
      <view v-if="isShowCheck">
        <u-checkbox class='round orange' :class="item.checked?'checked':''"  shape="circle" v-model="item.checked?true:false" :disabled="item.disable"></u-checkbox>
      </view>
      <view v-else>
        <view v-if="source === 'member_center'">
          <!-- #ifdef MP-WEIXIN -->
          <text @tap="receiveCoupon(item.id)">立即领取</text>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <faasmall-open-subscribe @open-subscribe-success="receiveCoupon" :template-id="templateIds" :digital="item.id">
            <text>立即领取</text>
          </faasmall-open-subscribe>
          <!-- #endif -->
        </view>
        <view v-else>
          <text v-if="item.status === 1" @tap="$Router.push({ path: '/pages/common/coupon/info', query: { id:item.couponId} })">立即使用</text>
          <u-image v-else :src="item.status | img()" style="width: 60px;height: 60px" />
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import {receiveCoupon} from "@/faasmall/api/member";
import {mapGetters} from "vuex";

export default {
  components: {

  },
  data() {
    return {

    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    // 是否有勾选框
    isShowCheck: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    },
    types: {
      type: String,
      default: ''
    },
    source:{
      type: String,
      default: 'my_coupon'
    },
    theme: {
      type: String,
      default: '#FF4A26'
    },
    solid: {
      type: String,
      default: '#ffffff'
    },
    color: {
      type: String,
      default: '#FF4A26'
    },
  },
  computed: {
    ...mapGetters(['subscribeData']),
    templateIds: function() {
      return [this.subscribeData.couponExpiresTid];
    },
  },
  filters: {
    img: function (type) {
      if (type === 1) {
        return this.$FILE_URL + '/file/img/coupon/coupon-used-icon.png';
      } else if (type === 2) {
        return this.$FILE_URL + '/file/img/coupon/coupon-expired-icon.png';
      } else if (type === 3) {
        return this.$FILE_URL + '/file/img/coupon/coupon-unable-icon.png';
      }
    },
    setNumber: function (num) {
      return Number(num);
    }
  },
  methods: {
    // 查看优惠券使用范围
    gotoDetails() {
      console.log('优惠券使用范围')
    },
    selectCoupon() {
      let that = this;
      if (that.isShowCheck) {
        that.$bus.$emit('updateChecked', that.index);
      }
    },
    //领取优惠卷
    receiveCoupon(couponId){
      receiveCoupon({id:couponId}).then((res)=>{
        if(res.code === 0 ){
          this.$refs.uToast.show({
            title: '领取成功',
            type: 'success'
          })
        }
      }).catch(err=>{
        console.error(err)
      })
    },
    // 路由跳转
    jump(path, parmas) {
      this.$Router.push({
        path: path,
        query: parmas
      });
    },
  }
}
</script>

<style lang='scss'>
.coupon-item {
  width: 100%;
  /* height: auto; */
  height: 131px;
  /* display: table; */
  border-radius: 10upx;
  /* padding: 0 30upx; */
  padding: 15px 5px 15px 15px;
  margin-bottom: 22upx;
  border: 1px solid #FFFFFF;
  position: relative;
  background-color: #FFFFFF;

  .box-con {
    width: 85px;
    height: 50px;
    overflow: hidden;
    position: absolute;
    top: -3px;
    right: -3px;
  }

  .box-text {
    color: white;
    text-align: center;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -faas-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    position: relative;
    padding: 2px 0;
    left: 37px;
    top: 4px;
    width: 65px;
    background-color: #00801C;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#ff503e), to(#ff2f50));
    background-image: -webkit-linear-gradient(top, #ff503e, #ff2f50);
    background-image: -moz-linear-gradient(top, #ff503e, #ff2f50);
    background-image: -faas-linear-gradient(top, #ff503e, #ff2f50);
    background-image: -o-linear-gradient(top, #ff503e, #ff2f50);
    -webkit-box-shadow: 0px 0px 3px #ff1b40;
    -moz-box-shadow: 0px 0px 3px #ff1b40;
    box-shadow: 0px 0px 3px #ff1b40;
  }

  .box-text:before,
  .box-text:after {
    content: "";
    position: absolute;
    bottom: -3px;
  }

  .box-text:before {
    left: 0;
  }

  .box-text:after {
    right: 0;
  }


  .coupon-money {
    width: 465upx;
    height: auto;
    /* display: table;
     */
    /* float: left; */
    text-align: left;
    padding: 26upx 0;
    border-style: none dotted none none;
    border-color: #eeeeee;

    .nick {
      width: 100%;
      height: 50upx;
      line-height: 30upx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }

    .tit {
      width: 100%;
      height: 50upx;
      line-height: 50upx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }

    .demand {
      width: 100%;
      height: 30upx;
      line-height: 30upx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }

    .layof {
      width: 100%;
      height: 48upx;
      line-height: 30upx;
      font-size: 44upx;
      color: #FF4A26;
      font-weight: bold;
    }

    .end_time {
      width: 100%;
      height: 30upx;
      line-height: 30upx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }
  }

  .get-btn {
    width: 146upx;
    height: 52upx;
    line-height: 50upx;
    /* position: absolute;
    top: 50%;
    right: 20upx; */
    margin-top: -26upx;
    text-align: center;
    border-radius: 60upx;
    color: #FF4A26;
    border: 1px solid #FF4A26;
    font-size: $uni-font-size-sm;
    /* float: right; */
  }
}

.coupon-item:after {
  width: 40upx;
  height: 20upx;
  position: absolute;
  left: 470upx;
  top: -1px;
  border-radius: 0 0 40upx 40upx;
  content: "";
  display: block;
  background: #F5F5F7;
  border: 1px solid #eeeeee;
  border-top: 0px;
}

.coupon-item:before {
  width: 40upx;
  height: 20upx;
  position: absolute;
  left: 470upx;
  bottom: -1px;
  border-radius: 40upx 40upx 0 0;
  content: "";
  display: block;
  background: #F5F5F7;
  border: 1px solid #eeeeee;
  border-bottom: 0px;
}
</style>
