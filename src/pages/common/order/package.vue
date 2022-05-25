<!--订单包裹信息-->
<template>
  <view>
    <view class="pack-head flex align-center">
      <text class="pack-head-text">{{ logisticsList.length + '个包裹已发出' }}</text>
    </view>
    <view
        class="pack-card flex flex-column"
        v-for="(item, index) in logisticsList"
        :key="index"
        @click="goLogistics(item)"
    >
      <view class="pack-card-head flex-shrink-0 flex">
        <view class="pack-card-head-left flex-column justify-around">
          <view class="logistics-top flex align-center">
            <text class="iconfont icon-kucun1"></text>
            <view class="logistics-top-text">{{ '包裹' + (index + 1) }}</view>
            <view class="logistics-top-text">{{ item.logisticsCompany + ' ' + item.logisticsSn }}</view>
          </view>
          <view class="logistics-down flex align-center">{{ item.type !== 2 ? item.message : '无需物流' }}</view>
        </view>
        <text class="pack-card-head-right flex align-center" :class="item.type !== 2 ? 'iconfont icon-page-next1' : ''"></text>
      </view>
      <view class="pack-card-footer flex-grow-1 flex flex-wrap">
        <view v-for="(good, lix) in item.goods" :key="lix" style="margin: 0 0 8rpx 8rpx; position: relative">
          <u-image :src="good.thumbnail" width="152" height="152"></u-image>
          <view class="pack-num flex justify-center align-center" v-show="good.goodQuantity !== 1">{{
              good.goodQuantity + '件'
            }}</view>
        </view>
      </view>
      <view class="pack-bottom flex-shrink-0 flex align-center">{{ '共' + item.goodQuantityTotal + '件商品' }}</view>
    </view>
  </view>
</template>

<script>
import {getOrderInfo} from "@/faasmall/api/order";
import {getExpressInfo} from "@/faasmall/api/express";

export default {
  data() {
    return {
      logisticsList: [],
      express: [],
      mobile: Number
    };
  },
  methods: {
    goLogistics(item){
      if(item.type !== 2){
        this.$Router.push({
          path: '/pages/common/order/logistics',
          query: {
            no:item.logisticsSn,
            name:item.logisticsCompany,
            mobile:this.mobile
          }
        });
      }
    },
    getPack(id) {
      getOrderInfo({id:id}).then(res => {
        this.logisticsList = res.data.logisticsList;
        this.mobile = res.data.buyer.mobile;
        for (let i = 0; i < this.logisticsList.length; i++) {
          if (this.logisticsList[i].type !== 2) {
            //获取物流信息
            getExpressInfo({sn:this.logisticsList[i].logisticsSn,company:this.logisticsList[i].logisticsCompany}).then(res => {
                  if(res.data.trackList && res.data.trackList.length > 0){
                    if (parseInt(res.data.status) === 0) {
                      this.$set(this.logisticsList[i], 'message', res.msg);
                    } else {
                      this.$set(this.logisticsList[i], 'message', res.data.trackList[0].content);
                      debugger
                    }
                  }
                }).catch(err => {
                  console.error(err);
                });
          }
        }
        return true;
      });
    },
  },
  onLoad(options) {
    this.getPack(parseInt(options.id));
  }
};
</script>

<style scoped lang="scss">
.icon-kucun1 {
  font-size: 24rpx;
  color: #bebebe;
}
.icon-page-next1 {
  font-size: 28rpx;
  color: #bebebe;
}
.pack {
  &-head {
    height: 80rpx;
    background-color: #fff5e1;
    &-text {
      margin-left: 32rpx;
      color: #f58e20;
      line-height: 14rpx;
    }
  }
  &-card {
    margin: 20rpx 20rpx 0rpx 20rpx;
    padding: 24rpx;
    width: 710rpx;
    max-height: 555rpx;
    min-height: 385rpx;
    background: #ffffff;
    border-radius: 16rpx;
    justify-content: space-between;
    .pack-card-head {
      height: 100rpx;
      border-bottom: 1rpx solid #e5e5e5;
      justify-content: space-between;
      &-left {
        .logistics-top {
          justify-content: flex-start;
          &-text {
            margin-left: 16rpx;
            color: #999999;
          }
        }
        .logistics-down {
          margin-left: 44rpx;
          color: #222222;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          line-height: 34rpx;
          margin-bottom: 10rpx;
        }
      }
    }
    .pack-card-footer {
      padding: 24rpx 0 16rpx 0;
      .pack-num {
        width: 152rpx;
        height: 40rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8rpx;
        z-index: 10;
        color: #ffffff;
        position: absolute;
        bottom: 0;
      }
    }
    .pack-bottom {
      height: 64rpx;
      color: #999999;
    }
  }
}
</style>