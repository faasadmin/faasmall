<!--售后信息-->
<template>
  <view style="padding:10rpx 20rpx">
    <view style="border-radius: 20rpx;background-color: #ffffff;padding: 40rpx">
      <view>{{ afterSaleInfo.status | getStatusText(afterSaleInfo) }}</view>
      <view v-if="afterSaleInfo.status !== 1 && afterSaleInfo.status !== 3">
        {{ afterSaleInfo.status | getStatusTime(afterSaleInfo) }}
      </view>
    </view>
    <!--换货物流-->
    <view v-if="afterSaleInfo.type === 2 && afterSaleInfo.status === 10" style="border-radius: 20rpx;background-color: #ffffff;padding: 40rpx;margin-top: 20rpx">
      <view>换货物流</view>
      <view style="padding: 20rpx;display: flex;align-items: center;">
        <view v-if="exchangeLogistics.status">
          <text style="margin-right: 20rpx;">
            {{ afterSaleInfo.merchantFreightInfo.type === 1 ? afterSaleInfo.merchantFreightInfo.logisticsCompany : '无物流' }}
          </text>
          <view v-if="afterSaleInfo.merchantFreightInfo.type === 1">
            <text>{{ afterSaleInfo.merchantFreightInfo.logisticsSn }}</text>
            <button @click="copyContent(afterSaleInfo.merchantFreightInfo.logisticsSn)">复制</button>
          </view>
        </view>
        <view v-else>
          <text class="iconfont icon-daishouhuo"></text>
          <view style="display: flex;flex: 1;align-items: center" @click="navigateToLogistics(exchangeLogistics.logisticsSn, exchangeLogistics.mobile, exchangeLogistics.logisticsCompany, '换货物流')">
            <view v-if="exchangeLogistics.state !== 0" style="flex: 1;">
              {{ exchangeLogistics.message }}
            </view>
            <view v-else style="flex: 1;padding-right: 32rpx;">
              <view style="-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;display: -webkit-box;">{{ exchangeLogistics.content }}</view>
              <view class="ml-1" style="height: 36rpx;line-height: 36rpx;font-size: 24px;color: #999999;">{{ exchangeLogistics.time }}</view>
            </view>
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
      </view>
    </view>
    <!--退货物流-->
    <view
        style="border-radius: 20rpx;background-color: #ffffff;padding: 40rpx;margin-top: 20rpx"
        v-if="
          afterSaleInfo.status === 6 ||
          afterSaleInfo.status === 8 ||
          ((afterSaleInfo.type === 2 || afterSaleInfo.type === 1) && afterSaleInfo.status === 10)
        "
    >
      <view>退货物流</view>
      <view style="padding: 20rpx;">
        <view v-if="returnLogistics.status" style="display: flex;align-items: center;">
          <text style="margin-right: 20rpx;">{{ afterSaleInfo.userFreightInfo.logisticsCompany }}</text>
          <text>{{ afterSaleInfo.userFreightInfo.logisticsSn }}</text>
          <button @click="copy(afterSaleInfo.userFreightInfo.logisticsSn)">复制</button>
        </view>
        <view v-else style="display: flex;align-items: center;">
          <text class="iconfont icon-daishouhuo"></text>
          <view
              style="display: flex;flex: 1;align-items: center"
              @click="navigateToLogistics(returnLogistics.logisticsSn, returnLogistics.mobile, returnLogistics.name, '退货物流')"
          >
            <view v-if="returnLogistics.status !== 0" style="flex: 1;">
              {{ returnLogistics.message }}
            </view>
            <view v-else style="flex: 1;padding-right: 32rpx;">
              <view style="-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;display: -webkit-box;">{{ returnLogistics.content }}</view>
              <view class="ml-1" style="height: 36rpx;line-height: 36rpx;font-size: 24px;color: #999999;">{{ returnLogistics.time }}</view>
            </view>
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
      </view>
    </view>
    <!--退货地址-->
    <view v-if="afterSaleInfo.status === 5 || afterSaleInfo.status === 7" style="border-radius: 20rpx;background-color: #ffffff;padding: 40rpx;margin-top: 20rpx">
      <view>退货地址</view>
      <view>
        <text>{{ afterSaleInfo.refundAddress.contact }}</text>
        <text class="ml-1">{{ afterSaleInfo.refundAddress.mobile }}</text>
      </view>
      <view>
        {{ afterSaleInfo.refundAddress.province }}{{ afterSaleInfo.refundAddress.city }}{{ afterSaleInfo.refundAddress.district
        }}{{ afterSaleInfo.refundAddress.address }}
      </view>
    </view>
    <!--拒绝理由-->
    <view v-if="afterSaleInfo.status === 2" style="border-radius: 20rpx;background-color: #ffffff;padding: 40rpx;margin-top: 20rpx">
      <view>拒绝理由</view>
      <view>{{ afterSaleInfo.refuseReason }}</view>
    </view>
    <!--商品信息-->
    <view style="margin-top: 20rpx;padding: 30rpx 30rpx; background-color: #ffffff;border-radius: 20px;">
      <view> 商品信息 </view>
      <view v-for="(item, index) in afterSaleInfo.goodList" :key="index" style="margin-top:20rpx;">
        <view @click="navigateTo('/pages/common/good/info?id=' + item.id)" style="display: flex;flex-direction: row">
          <u-image
              width="160"
              height="160"
              :src="item.goodThumbnail"
          ></u-image>
          <view style="padding: 0 20rpx">
            <view>
              <view style="-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;display: -webkit-box;">{{ item.goodName }}</view>
              <view>{{ item.showStandardParam }}</view>
              <view>
                <text>x{{ item.goodQuantity }}</text>
              </view>
            </view>
            <view>
              <view v-if="Number(item.totalAmount) > Number(item.payAmount)">
                <view>
                  <text>优惠后</text>
                  <text>￥{{ Math.floor((item.payAmount / item.goodQuantity) * 100) / 100 }}</text>
                </view>
                <view>￥{{ item.goodSellingPrice }}</view>
              </view>
              <view v-else>
                <view>￥{{ item.goodSellingPrice }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--订单参数-->
    <view style="margin-top: 20rpx;padding: 30rpx 30rpx; background-color: #ffffff;border-radius: 20px;">
      <view style="display: flex;justify-content: space-between">
        <view>售后方式</view>
        <view>
          {{ afterSaleInfo.type === 0 ? '仅退款' : afterSaleInfo.type === 1 ? '退货退款' : afterSaleInfo.type === 2 ? '换货' : '' }}
        </view>
      </view>
      <view style="display: flex;justify-content: space-between">
        <view>{{ afterSaleInfo.type === 2 ? '换货数量' : '退款数量' }}</view>
        <view>{{ afterSaleInfo.refundNumber }}</view>
      </view>
      <view v-if="afterSaleInfo.type !== 2">
        <view v-if="afterSaleInfo.orderType === 3" style="display: flex;justify-content: space-between">
          <view>退还积分</view>
          <view style="text-align: right;">{{ afterSaleInfo.returnIntegral }}积分</view>
        </view>
        <view style="display: flex;justify-content: space-between">
          <view>退款金额</view>
          <view>
            <view style="text-align: right;">¥{{ afterSaleInfo.refundAmount }}</view>
            <view v-if="Number(afterSaleInfo.returnFreight) > 0">(包含运费￥{{ afterSaleInfo.returnFreight }})</view>
          </view>
        </view>
        <view style="display: flex;justify-content: space-between">
          <view>退款原因</view>
          <view>{{ afterSaleInfo.returnReason }}</view>
        </view>
      </view>
      <view v-if="afterSaleInfo.userNote">
        <view>问题描述</view>
        <view>
          <text>{{ afterSaleInfo.userNote }}</text>
        </view>
      </view>
    </view>
    <!--凭证图片-->
    <view v-if="afterSaleInfo.imgs.length > 0" style="margin-top: 20rpx;padding: 30rpx 30rpx; background-color: #ffffff;border-radius: 20px;">
      <view>凭证图片</view>
      <view style="margin-top: 10rpx">
        <image
            :src="item"
            mode="aspectFill"
            style="display: block;border-radius: 8px;width: 150rpx;height: 150rpx;"
            v-for="(item, index) in afterSaleInfo.imgs"
            :key="index"
        ></image>
      </view>
    </view>
    <!--订单信息-->
    <view style="margin-top: 20rpx;padding: 30rpx 30rpx; background-color: #ffffff;border-radius: 20px;">
      <view>
        <view style="display: flex;justify-content: space-between;align-items: center">
          <view>售后订单号</view>
          <view style="display: flex;">
            <view>{{ afterSaleInfo.afterSn }}</view>
            <button class="u-reset-button" style="margin-left: 10rpx" @click="copyContent(afterSaleInfo.afterSn)">复制</button>
          </view>
        </view>
        <view style="display: flex;align-items:center;justify-content: space-between">
          <view>申请时间</view>
          <view>{{ afterSaleInfo.createTime}} </view>
        </view>
        <view v-if="afterSaleInfo.auditTime" style="display: flex;align-items:center;justify-content: space-between">
          <view>审核时间</view>
          <view>{{ afterSaleInfo.auditTime}}</view>
        </view>
        <view v-if="afterSaleInfo.returnTime && (afterSaleInfo.type === 1 || afterSaleInfo.type === 0)" style="display: flex;align-items:center;justify-content: space-between">
          <view>退款时间</view>
          <view>{{ afterSaleInfo.returnTime}}</view>
        </view>
        <view v-if="afterSaleInfo.exchangeTime && afterSaleInfo.type === 2" style="display: flex;align-items:center;justify-content: space-between">
          <view>换货时间</view>
          <view>{{ afterSaleInfo.exchangeTime}} </view>
        </view>
      </view>
      <view style="border-top: 1rpx solid #e5e5e5;height: 88rpx;position: relative;display: flex;justify-content: space-between;align-items: center;margin-top: 20rpx">
        <!-- #ifndef H5 -->
        <view style="position: absolute;width: 1px;height: 40rpx;border: 1px solid #d7d7d7;left: 50%;top: 50%;transform: translate(-50%, -50%);"></view>
        <button class="u-reset-button" style="height: 56rpx;flex: 1;margin-right: 2rpx;">
          <text>联系卖家</text>
        </button>
        <!-- #endif -->
        <button style="height: 56rpx;flex: 1;margin-left: 2rpx;" @click.stop="makePhoneCall" class="u-reset-button">
          <text>呼叫卖家</text>
        </button>
      </view>
    </view>

    <view v-if="isBottom">
      <!--空格-->
      <view class="safe-area-inset-bottom">
        <view style="height: 96rpx;"></view>
      </view>
      <!--操作-->
      <view class="safe-area-inset-bottom" style="width: 100%;position: fixed;bottom: 0;left:0;z-index: 1; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);background-color: #ffffff;">
        <view style="height: 96rpx;padding: 20rpx;display: flex;justify-content: flex-end">
          <button class="u-reset-button" style="background: #fff;border: 0.5px solid #ccc;border-radius: 13px;padding: 10px;display: flex;align-items: center;justify-content: center;" v-if="afterSaleInfo.status === 1 || afterSaleInfo.status === 3" @click="showModal = true">
            撤回申请
          </button>
          <button class="u-reset-button" style="background: #fff;border: 0.5px solid #ccc;border-radius: 13px;padding: 10px;display: flex;align-items: center;justify-content: center;" v-if="afterSaleInfo.status === 2" @click="reapply">再次申请</button>
          <button
              class="u-reset-button"
              style="background: #fff;border: 0.5px solid #ccc;border-radius: 13px;padding: 10px;display: flex;align-items: center;justify-content: center;"
              v-if="afterSaleInfo.status === 5 || afterSaleInfo.status === 7"
              @tap="
                navigateTo(
                  '/pages/common/order/afterSale/alter_sale_return?id=' + afterSaleInfo.id + '&mobile=' + afterSaleInfo.refundAddress.mobile
                )
              "
          >
            填写退货信息
          </button>
        </view>
      </view>
      <u-popup v-model="showModal" mode="center">
        <view style="display:flex;flex-direction:column;width: 510rpx;height: 357rpx;background: #FFFFFF;border-radius: 16rpx;">
          <view style="border-bottom: 2rpx solid #E5E5E5;color: #222222;text-align: center;padding: 24rpx;flex: 1">
            <view style="margin-top: 32rpx;font-size: 32rpx;">撤回售后申请</view>
            <text style="font-size: 26rpx;margin-top:20rpx;display: inline-block;">
              撤销申请后，售后将被关闭，
              如后续仍有问题，可继续申请售后，
              是否确认撤销？
            </text>
          </view>
          <view style="height: 88rpx;position: relative;display: flex;justify-content: space-between;align-items: flex-end;">
            <view style="width: 2rpx;height: 88rpx;background: #E5E5E5;position: absolute;top: 0;left: 50%;"></view>
            <button class="u-reset-button faas-btn faas-cancel" @click="showModal=false;">取消</button>
            <button class="u-reset-button faas-btn faas-sure" @click="cancelAfter">确定</button>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";
import {afterSaleOrderCancel, getAfterSaleOrder, singleOrderAfterApply} from "@/faasmall/api/order";
import {getExpressInfo} from "@/faasmall/api/express";
// 时间格式化
import timeFormat from 'uview-ui/libs/function/timeFormat.js'
export default {
  name: "after_sale_apply",
  data() {
    return {
      showModal:false,
      //售后订单商品ID
      afterOrderGoodId: null,
      //售后订单主键
      afterOrderId: null,
      //售后订单编号
      orderSn: null,
      isTask: false,
      status: null,
      afterSaleInfo:{

      },
      //退货物流
      returnLogistics: {
        status: 0
      },
      //换货物流
      exchangeLogistics: {
        status: 0
      }
    };
  },
  filters: {
    getStatusText: function (status, info) {
      let str = '';
      let type = info.type;
      switch (status) {
        case 1:
          str = '待卖家审核';
          break;
        case 2:
          str = '卖家已拒绝售后申请';
          break;
        case 3:
          str = '待卖家审核';
          break;
        case 4:
          str = '售后申请已通过，等待退款';
          break;
        case 5:
          str = '售后申请已通过，请填写退货信息';
          break;
        case 6:
          str = '等待卖家收货且退款';
          break;
        case 7:
          str = '售后申请已通过，请填写退货信息';
          break;
        case 8:
          str = '等待卖家收货且发货';
          break;
        case 10:
          if (type === 2) {
            str = '换货成功';
          } else if (type === 0 || type === 1) {
            str = '退款成功';
          }
          break;
        case 11:
          str = '已完成(已拒绝)';
          break;
      }
      return str;
    },
    getStatusTime: function (status, info) {
      function getTime(dateTime) {
        if (!dateTime) return;
        return timeFormat(dateTime, 'yyyy-mm-dd hh:MM:ss');
      }
      switch (status) {
        case 2:
          return getTime(info.refuseTime);
        case 4:
          return getTime(info.auditTime);
        case 5:
          return getTime(info.auditTime);
        case 6:
          return getTime(info.exchangeTime);
        case 7:
          return getTime(info.auditTime);
        case 8:
          return getTime(info.exchangeTime);
        case 10:
          return getTime(info.auditTime);
        case 11:
          return getTime(info.finishTime);
      }
    }
  },
  computed: {
    ...mapGetters(['shopData','subscribeData']),
    isBottom: function () {
      let status = this.afterSaleInfo.status;
      return status === 1 || status === 2 || status === 3 || status === 5 || status === 7;
    },
  },
  async onLoad(options) {
    let that = this;
    that.afterOrderGoodId = parseInt(options.afterOrderGoodId);
    that.afterOrderId = parseInt(options.afterOrderId);
    that.orderSn = options.orderSn;
    await that.getAfterSaleInfo(this.orderSn,this.afterOrderId,this.afterOrderGoodId);
  },
  methods:{
    makePhoneCall: function () {
      uni.makePhoneCall({
        phoneNumber: this.shopData.mobile
      });
    },
    copyContent(content){
      this.$u.func.copyValue({ content });
    },
    async getAfterSaleInfo(orderSn,afterOrderId,afterOrderGoodId){
      let that = this;
      getAfterSaleOrder({orderSn:orderSn ,afterOrderId:afterOrderId,afterOrderGoodId:afterOrderGoodId}).then((res)=>{
        this.afterSaleInfo = res.data;
        // 换货物流
        if (res.data.type === 2 && res.data.status === 10) {
          if (res.data.merchantFreightInfo.type === 1) {
            let logisticsSn = res.data.merchantFreightInfo.logisticsSn;
            let mobile = res.data.refundAddress.mobile;
            let logisticsCode = res.data.merchantFreightInfo.logisticsCode;
            let logisticsCompany = res.data.merchantFreightInfo.logisticsCompany;
            getExpressInfo({sn:logisticsSn,code:logisticsCode}).then(function (res) {
              debugger
              if (res.code === 0 && res.data.trackList > 0) {
                that.exchangeLogistics = res.data.trackList[res.data.trackList- 1];
              } else {
                that.exchangeLogistics.message = res.msg ? res.msg:"暂无物流信息";
              }
              that.exchangeLogistics.logisticsSn = logisticsSn;
              that.exchangeLogistics.mobile = mobile;
              that.exchangeLogistics.logisticsCompany = logisticsCompany;
              that.exchangeLogistics.state = res.data.status;
              that.loading = false;
            }).catch(function (err) {
              if (err.status === 403) {
                that.exchangeLogistics.status = 403;
              }
              that.loading = false;
            });
          }
        }
        debugger
        if (res.data.status === 6 || res.data.status === 8 || ((res.data.type === 2 || res.data.type === 1) && res.data.status === 10)) {
          // 退货物流
          that.loading = true;
          let logisticsSn = res.data.userFreightInfo.logisticsSn;
          let mobile = res.data.userFreightInfo.mobile;
          let logisticsCompany = res.data.userFreightInfo.logisticsCompany;
          let logisticsCode = res.data.userFreightInfo.logisticsCode;
          getExpressInfo({sn:logisticsSn,code:logisticsCode}).then(function (res) {
            debugger
            if (res.code === 0 && res.data.trackList.length > 0) {
              that.returnLogistics = res.data.trackList[res.data.trackList- 1];
            } else {
              that.returnLogistics.message = res.msg ? res.msg:"暂无物流信息";
            }
            debugger
            that.returnLogistics.logisticsSn = logisticsSn;
            that.returnLogistics.mobile = mobile;
            that.returnLogistics.logisticsCompany = logisticsCompany;
            that.returnLogistics.status = res.data.status;
            that.loading = false;
            console.info(that.returnLogistics);
            debugger
          }).catch(function (err) {
            debugger
                that.returnLogistics.status = err.status;
                that.loading = false;
           });
        } else {
          that.loading = false;
        }
      }).catch(error=>{
        console.error(error);
      })
    },
    navigateTo(url) {
      if (this.afterSaleInfo.orderType && this.afterSaleInfo.orderType === 3) {
        url = url + '&isTask=1';
      }
      uni.navigateTo({ url: url });
    },
    navigateToLogistics(no, mobile, name, title) {
      uni.navigateTo({
        url: '/pages/common/order/logistics?no=' + no + '&name=' + name + '&mobile=' + mobile + '&title=' + title
      });
    },
    cancelAfter() {
      afterSaleOrderCancel({id:this.afterSaleInfo.id}).then((res)=>{
        uni.navigateBack({
          delta: 1
        });
      }).catch(function (err) {
        console.error(err);
      });
    },
    reapply: function () {
      let _this = this;
      singleOrderAfterApply({orderSn:_this.afterSaleInfo.orderSn,afterSalesOrder:_this.afterSaleInfo}).then(function (res) {
        _this.afterSaleInfo.status = res.status;
      }).catch(function (err) {
        console.error(err)
      });
    },
  }
}
</script>

<style scoped lang="scss">
/* start--iPhoneX底部安全区定义--start */
.safe-area-inset-bottom {
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.faas-hover-btn {
  transform: translate(1upx, 1upx);
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
.faas-btn {
  width: 254px;
  height: 86rpx;
  border: none;
  background: #FFFFFF;
}
.faas-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
}
.faas-sure {
  color: #FF0505;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
