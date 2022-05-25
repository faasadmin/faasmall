<!--售后申请-->
<template>
  <view style="padding: 20rpx;border-radius: 20rpx">
    <view v-for="(item, index) in goods" :key="index" style="display: flex;justify-content: space-between;padding: 20rpx;background: #FFFFFF">
      <view style="height: 160rpx;width: 160rpx">
        <u-image :src="item.thumbnail"  width="160rpx" height="160rpx"></u-image>
      </view>
      <view style="display: flex;flex-direction: column;padding: 0 20rpx">
        <view style="margin-top: 5rpx;word-break: break-all;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;overflow: hidden;">{{item.goodName}}</view>
        <view style="margin-top: 5rpx">{{item.goodSkuName}}</view>
        <view style="margin-top: 5rpx">x{{item.goodNumber}}</view>
      </view>
    </view>
    <view style="background: #FFFFFF;padding: 20rpx;border-radius: 20rpx;margin-top: 20rpx">
      <view style="height: 100rpx;border-bottom: 1rpx solid #e5e5e5;display: flex;align-items: center;justify-content: space-between;width: 100%">
        <view>售后方式</view>
        <view>{{data.type === 0 ? '仅退款' : data.type === 1 ? '退货退款' : data.type === 2 ? '换货' : '' }}</view>
      </view>
      <view v-if="data.type !== 2" style="height: 100rpx;border-bottom: 1rpx solid #e5e5e5;display: flex;align-items: center;justify-content: space-between;width: 100%">
        <view>退款原因</view>
        <view @tap="showReason" style="display: flex;">
          <view :class="data.returnReason ? 'item-label' : 'item-reason'">
            {{ data.returnReason ? data.returnReason : '请选择退款原因' }}
          </view>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view v-if="!isEntire" style="height: 100rpx;border-bottom: 1rpx solid #e5e5e5;display: flex;align-items: center;justify-content: space-between;width: 100%">
        <view>{{ data.type === 2 ? '换货数量' : '退款数量' }}</view>
        <vk-data-input-number-box v-model="data.returnNumber" :min="1" :max="goodsNumber" :step="1" :positive-integer="true"> </vk-data-input-number-box>
      </view>
      <view v-if="data.orderType === 3" style="height: 100rpx;border-bottom: 1rpx solid #e5e5e5;display: flex;align-items: center;justify-content: space-between;width: 100%">
        <view v-if="data.type !== 2" style="display: flex;flex-direction: column;justify-content: space-between">
          <view style="display: flex;justify-content: space-between">
            <view>退款金额</view>
            <view style="text-align: right;">¥{{ data.returnAmount }}</view>
          </view>
          <view>最多可退¥{{ data.returnAmount }}</view>
        </view>
        <view v-if="data.type !== 2" style="display: flex;flex-direction: column;justify-content: space-between;width: 100%">
          <view style="display: flex;justify-content: space-between">
            <view>退还积分</view>
            <view style="text-align: right;">{{ data.returnScore }}积分</view>
          </view>
          <view style="color: #999999;text-align: right;">最多可退{{ data.returnScore }}积分</view>
        </view>
      </view>
      <view v-else style="height: 100rpx;border-bottom: 1rpx solid #e5e5e5;display: flex;align-items: center;justify-content: space-between;width: 100%;padding: 10rpx 0">
        <view v-if="data.type !== 2" style="display: flex;flex-direction: column;width: 100%">
          <view style="display: flex;justify-content: space-between">
            <view>退款金额</view>
            <view style="text-align: right;">¥{{ data.returnAmount }}</view>
          </view>
          <view :class="[!isEntire && data.type === 0 ? 'justify-between' : 'justify-end']" style="display: flex;margin-top: 10rpx">
            <text v-if="!isEntire && data.type === 0"> 所有商品均已退款后，自动退运费 </text>
            <text style="display: flex"> 最多可退¥{{ data.returnAmount }}{{ isEntire ? `，包含运费￥${freightAmount}` : '' }} </text>
          </view>
        </view>
      </view>
      <view>
        <view style="display: flex;align-items: center;height: 80rpx">
          <text style="margin-right: 20rpx;">问题描述</text>
          <text style="color: #999999;">选填</text>
        </view>
        <view>
            <u-input
                :value="data.userNote"
                border="true"
                @input="changeText"
                height="260"
                type="textarea"
                autoHeight="true"
                maxlength="200"
                placeholder="请输入问题描述"></u-input>
        </view>
      </view>
      <view>
        <view style="margin: 10px 0px;">
          <text style="color: #222222">上传凭证</text>
          <text style="margin-left: 20rpx;color: #999999">({{data.imgs.length}}/4)</text>
          <text style="color: #999999;">选填</text>
        </view>
        <view>
          <u-upload max-count="4"
                    ref="uUpload"
                    :header="authorization"
                    :form-data="{'type':'feed_back'}"
                    action="http://127.0.0.1:8089/api/plugins/faas-mall-addons/api/common/upload"
                    @on-uploaded="beforeUpload"
                    @on-remove="beforeRemove"
          ></u-upload>
        </view>
      </view>
      <u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
        <view class="faas-box">
          <view class="faas-header row-center-center">
            <text class="faas-header-title">退款原因</text>
          </view>
          <view class="faas-body">
            <view
                class="faas-body-item row align-center"
                v-for="(item, index) in selectList"
                :key="index"
                @click="setSelect(item.value)"
                v-if="data.type === item.type || item.type < 0"
            >
              <view class="faas-item-select row-center-center">
                <text class="iconfont icon-gou" v-if="data.returnReason === item.value"></text>
              </view>
              <view class="faas-item-text" :class="data.returnReason === item.value ? 'faas-item-text-one' : ''">{{
                  item.value
                }}</view>
            </view>
          </view>
        </view>
      </u-popup>
      <!-- #ifdef MP-WEIXIN -->
      <u-button type="error"  :disabled="isSubmit" @click="submit">提交</u-button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <faasmall-open-subscribe @open-subscribe-success="submit" :template-id="templateIds">
        <button :disabled="isSubmit">提交</button>
      </faasmall-open-subscribe>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";
import {singleOrderAfterApply,wholeOrderAfterApply} from "@/faasmall/api/order";
import jwt from "@/faasmall/utils/cache/jwt";
import setting from '@/faasmall/common/config.js';
export default {
  name: "after_sale_apply",
  data() {
    return {
      authorization:{'Authorization': "Bearer " +  jwt.getAccessToken(),'appId': setting.APP_ID},
      goods: [],
      id: null,
      isTask: false,
      status: null,
      orderSn: '',
      isEntire:0,
      showModal: false,
      selectList: [
        {
          value: '拍错/多拍/不喜欢',
          type: -1
        },
        {
          value: '未按约定时间发货',
          type: 0
        },
        {
          value: '商品破损/少发',
          type: 1
        },
        {
          value: '商品与描述不符',
          type: 1
        },
        {
          value: '商家发错',
          type: 1
        },
        {
          value: '协商一致退款',
          type: -1
        },
        {
          value: '其他',
          type: -1
        }
      ],
      freightAmount:0,
      data:{
        //退款订单商品ID
        orderGoodId:'',
        //退款类型
        type: 2,
        //退/换货数量
        returnNumber: 1,
        //退款金额
        returnAmount: 0,
        //退款原因
        returnReason: '',
        //图片
        imgs: [],
        //问题描述
        userNote: ''
      }
    };
  },
  computed: {
    ...mapGetters(['shopData','subscribeData']),
    goodsNumber({ goods }) {
      let goodsNumber = 0;
      for (let i = 0; i < goods.length; i++) {
        goodsNumber += goods[i].goodNumber;
      }
      return goodsNumber;
    },
    payAmount({ goods }) {
      let payAmount = 0;
      for (let i = 0; i < goods.length; i++) {
        payAmount += Number(goods[i].payAmount);
      }
      return payAmount;
    },
    scoreAmount({ goods }) {
      let scoreAmount = 0;
      for (let i = 0; i < goods.length; i++) {
        scoreAmount += goods[i].goodIntegral;
      }
      return scoreAmount;
    },
    isSubmit: function () {
      return this.data.type !== 2 && !this.data.returnReason;
    },
    templateIds: function () {
      //售后状态通知
      let tmplIds = [this.subscribeData.afterSaleTid];
      if (this.data.type !== 2) {
        //退款成功通知
        tmplIds.push(this.subscribeData.refundSuccessTid);
      }
      tmplIds.push(this.subscribeData.pointsChangeTid);
      return tmplIds;
    }
  },
  watch: {
    'data.returnNumber': {
      handler(newVal) {
        this.data.returnAmount = Math.floor(parseFloat(this.payAmount / this.goodsNumber) * newVal * 100) / 100;
        this.data.returnScore = Math.floor(parseFloat(this.scoreAmount / this.goodsNumber) * newVal * 100) / 100;
        if (this.isEntire) {
          this.data.returnAmount = Math.floor((this.data.returnAmount + this.freightAmount) * 100) / 100;
          this.data.returnScore = Math.floor((this.data.returnScore + this.freightAmount) * 100) / 100;
          debugger
        }
      },
      deep: true,
      immediate: true
    }
  },
  onLoad(options) {
    debugger
    this.goods = JSON.parse(decodeURIComponent(decodeURIComponent(options.goods)));
    this.isTask = Number(options.isTask);
    this.isEntire = Number(options.isEntire);
    if (this.$isNotEmpty(options.freightAmount)) {
      this.freightAmount = Number(options.freightAmount);
    }
    let goodsNumber = 0;
    let payAmount = 0;
    let scoreAmount = 0;
    for (let i = 0; i < this.goods.length; i++) {
      goodsNumber += this.goods[i].goodNumber;
      payAmount += this.goods[i].payAmount;
      scoreAmount += this.goods[i].goodIntegral;
    }
    debugger
    this.data = {
      orderGoodId: this.goods[0].id,
      orderType: this.isTask ? 3 : 1,
      type: parseInt(options.type),
      returnNumber: goodsNumber,
      returnAmount: payAmount,
      returnScore: scoreAmount || 0,
      returnReason: '',
      imgs: [],
      userNote: '',
    };
    this.orderSn = options.orderSn
    console.info('商品数据：' + this.data);
  },
  methods:{
    showReason(){
      this.showModal = true;
    },
    beforeUpload(e) {
      this.data.imgs = [];
      e.forEach(item => {
        this.data.imgs.push(item.response.data.previewUrl);
      });
    },
    beforeRemove(index) {
      this.data.imgs.splice(index, 1);
    },
    setSelect: function (return_reason) {
      this.data.returnReason = return_reason;
      this.showModal = false;
    },
    changeText(e) {
      debugger
      let str = e;
      if (str.length > 200) {
        str = str.substring(0, 200);
      }
      this.data.userNote = str;
    },
    applyAfter(){
      //是否整单退款
      if(this.isEntire){
        wholeOrderAfterApply({orderSn:this.orderSn,returnReason:this.data.returnReason,imgs:this.data.imgs,userNote:this.data.userNote,type:this.data.type}).then(function () {
          uni.redirectTo({ url: '/pages/common/order/afterSale/after_sale_list' });
        }).catch(function (err) {
          console.error(err)
        });
      }else {
        singleOrderAfterApply({orderSn:this.orderSn,afterSalesOrder:this.data}).then(function () {
          uni.redirectTo({ url: '/pages/common/order/afterSale/after_sale_list' });
        }).catch(function (err) {
          console.error(err)
        });
      }
    },
    submit: function () {
      let _this = this;
      // #ifdef MP_WEIXIN
      if(_this.subscribeData.status === 0){
        wx.requestSubscribeMessage({
          tmplIds: _this.subTemplateId,
          success: function () {},
          fail: function () {},
          complete: function () {
            _this.applyAfter();
          }
        });
      } else {
        _this.applyAfter();
      }
      // #endif
      // #ifdef H5
      this.applyAfter();
      // #endif
    }
  }
}
</script>

<style scoped lang="scss">
.faas-box {
  height: 45vh;
}
.faas-header {
  position: relative;
}
.faas-header-title {
  color: #999999;
  margin: 32rpx 0;
}
.faas-body {
  height: calc(45vh - 100rpx);
  padding-left: 32rpx;
}
.faas-body-item {
  height: 80rpx;
}
.faas-item-select {
  width: 32rpx;
  height: 32rpx;
  margin-right: 32rpx;
}
.faas-item-text {
  color: #666666;
}
.faas-item-text-one {
  color: #222222;
}
.icon-gou {
  font-size: 32rpx;
  color: #FF0505;
}
</style>