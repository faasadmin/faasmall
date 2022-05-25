<!-- 提现记录 -->
<template>
  <view>
    <!-- 记录卡片 -->
    <view class="wallet-log-box u-p-b-30">
      <view class="withdraw-list" v-for="item in withdrawLog" :key="item.id">
        <view class="head u-flex u-col-center u-row-between">
          <view class="title">提现至{{ item.type }}</view>
          <view class="num">{{ item.amount }} 元</view>
        </view>
        <view class="status-box item  u-flex u-col-center u-row-between">
          <view class="item-title">申请状态</view>
          <view class="status-text" :style="{ color: stausMap[item.status] }">{{ item.status }}</view>
        </view>
        <view class="time-box item  u-flex u-col-center u-row-between">
          <text class="item-title">账户信息</text>
          <view class="time u-ellipsis-1">{{ item.name }} - {{ item.account }}</view>
        </view>
        <view class="time-box item  u-flex u-col-center u-row-between">
          <text class="item-title">提现单号</text>
          <view class="time">{{ item.applySn }}</view>
        </view>
        <view class="time-box item  u-flex u-col-center u-row-between">
          <text class="item-title">手续费</text>
          <view class="time">{{ item.handlingFee }} 元</view>
        </view>
        <view class="time-box item  u-flex u-col-center u-row-between">
          <text class="item-title">申请时间</text>
          <view class="time">{{ $u.timeFormat(item.createTime, 'yyyy.mm.dd hh:MM:ss') }}</view>
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
import {getWithdrawLogPage} from "@/faasmall/api/wallet";

export default {
  components: {},
  data() {
    return {
      withdrawLog: [],
      loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
      currentPage: 1,
      lastPage: 1,
      isEmpty: false,
      stausMap: {
        0: '#999',
        1: '#414def',
        2: '#36095c',
        '-1': '#ED5B56'
      }
    };
  },
  computed: {},
  filters: {
    applyInfoFilter: function (value) {
      if (!value) return '-';
      return Object.values(value).join(' | ');
    }
  },
  onLoad() {
    debugger
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
      getWithdrawLogPage({'pageNo':that.currentPage,'pageSize':10}).then(res => {
        debugger
        if (res.code === 0) {
          debugger
          that.withdrawLog = [...that.withdrawLog, ...res.data.list];
          that.isEmpty = !that.withdrawLog.length;
          that.lastPage = res.data.total / 10;
          that.loadStatus = that.currentPage < that.lastPage ? 'loadmore' : 'nomore';
        }
      });
    }
  }
};
</script>

<style lang="scss">
.withdraw-list {
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
      color: #ff0000;
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
