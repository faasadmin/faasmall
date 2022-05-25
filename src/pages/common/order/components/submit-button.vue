<template>
  <view class="fixed-bottom">
    <view class="flex justify-between align-center" style="width: 90%">
      <view style="display: flex">
        <view>
          共{{quantity}}件
        </view>
        <view class="ml-1">
          实付金额￥{{payAmount}}
        </view>
      </view>
      <view>
        <!-- #ifdef MP-WEIXIN -->
        <u-button v-if="shopData.operatingStatus === 1" type="error" shape="square" :disabled="disabled" @click="submit">
          提交订单
        </u-button>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <faasmall-open-subscribe
            @open-subscribe-success="submit"
            :template-id="subTemplateId"
            v-if="shopData.operatingStatus === 1"
        >
          <u-button v-if="shopData.operatingStatus === 1"  :disabled="disabled" type="error" @click="submit"  shape="circle">提交订单</u-button>
        </faasmall-open-subscribe>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "submit-button",
  computed: {
    ...mapGetters(['shopData','subscribeData']),
    subTemplateId: function () {
      let tid = [];
      //付款成功通知 订单发货通知 积分变更提醒
      const { paySuccessTid, orderShipmentTid,pointsChangeTid } = this.subscribeData;
      paySuccessTid ? tid.push(paySuccessTid) : null;
      orderShipmentTid ? tid.push(orderShipmentTid) : null;
      pointsChangeTid ? tid.push(pointsChangeTid) : null;
      return tid;
    }
  },
  props: {
    disabled: {
      type: Boolean
    },
    payAmount: {
      type: Number
    },
    quantity:{
      type: Number
    }
  },
  methods:{
    submit: function () {
      debugger
      let that = this;
      if (this.disabled) return;
      // #ifdef MP-WEIXIN
      //是否开启消息推送
      if(that.subscribeData.status === 0){
        wx.requestSubscribeMessage({
          tmplIds: that.subTemplateId,
          success: function () {},
          fail: function () {},
          complete: function () {
            that.$emit('submit');
          }
        });
      } else {
        that.$emit('submit');
      }
      // #endif
      // #ifdef H5
      that.$emit('submit');
      // #endif
    }
  }
}
</script>

<style scoped lang="scss">
.fixed-bottom {
  position: fixed;
  bottom: var(--window-bottom);
  z-index: 1;
  height:100rpx;
  width:100%;
  background: #FFFFFF;
  display: flex;
  justify-content: center
}
</style>