<!-- 充值记录 -->
<template>
  <view>
    <view class="wallet-log-box u-p-b-30">
      <view class="log-list" v-for="item in rechargeLog" :key="item.id">
        <view class="head u-flex u-col-center u-row-between">
          <view class="title">{{item.operateType}}充值</view>
          <view class="num">{{ item.balance }} 元</view>
        </view>
        <view class="time-box item  u-flex u-col-center u-row-between">
          <view class="item-title u-flex u-col-center"><text class="u-iconfont uicon-order u-m-r-10"></text>充值单号
          </view>
          <view class="time">{{item.serialSn}}</view>
        </view>
        <view class="time-box item  u-flex u-col-center u-row-between">
          <view class="item-title u-flex u-col-center"><text class="u-iconfont uicon-clock u-m-r-10"></text>充值时间
          </view>
          <view class="time">{{$u.timeFormat(item.createtime, 'yyyy.mm.dd hh:MM:ss')}}</view>
        </view>
      </view>
      <!-- 更多 -->
      <u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
      <!-- 空置页 -->
      <faasmall-empty v-if="isEmpty" marginTop="300rpx" tipText="暂无数据~"></faasmall-empty>
    </view>
  </view>
</template>

<script>
import {getBalanceLogPage} from "@/faasmall/api/wallet";

export default {
  components: {},
  data() {
    return {
      rechargeLog: [],
      loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
      currentPage: 1,
      lastPage: 1,
      isEmpty: false,
    };
  },
  computed: {},
  onLoad() {
    this.getLog();
  },
  // 触底加载更多
  onReachBottom() {
    if (this.currentPage < this.lastPage) {
      this.currentPage += 1;
      this.getLog();
    }
  },
  methods: {
    // 确认提交表单
    getLog() {
      let that = this;
      that.loadStatus = 'loading';
      getBalanceLogPage({pageNo:that.currentPage,pageSize:10,type:1}).then(res => {
        if (res.code === 0) {
          that.rechargeLog = [...that.rechargeLog, ...res.data.pageResult.list];
          that.isEmpty = !that.rechargeLog.length;
          that.lastPage = res.data.total / 10;
          that.loadStatus = that.currentPage < that.lastPage ? 'loadmore' : 'nomore';
        }
      });
    }
  }
};
</script>

<style lang="scss">
// 记录卡片
.log-list {
  min-height: 213rpx;
  background: #ffffff;
  margin-bottom: 10rpx;
  padding-bottom: 10rpx;

  .head {
    padding: 0 35rpx;
    height: 80rpx;
    border-bottom: 1rpx solid #eee;
    margin-bottom: 20rpx;

    .title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }

    .num {
      font-size: 28rpx;
      font-weight: 500;
      color: #7063d2;
    }
  }

  .item {
    padding: 0 30rpx 10rpx;

    .item-icon {
      color: #c0c0c0;
      font-size: 36rpx;
      margin-right: 8rpx;
    }

    .item-title {
      width: 180rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #c0c0c0;
    }

    .status-text {
      font-size: 24rpx;
      font-weight: 500;
      color: #05c3a1;
    }

    .time {
      font-size: 24rpx;
      font-weight: 400;
      color: #c0c0c0;
    }
  }
}
</style>