<template>
  <view>
    <view>
      <view class="border-bottom" style="background: #FFFFFF;padding: 20rpx;">
        <view style="height: 120rpx;width: 100%;display: flex;justify-content: center;align-items: center">
          <u-button :class="{ active: dateTypeIndex === 1 }" size="mini" @click="btnChange(1)">全部</u-button>
          <u-button :class="{ active: dateTypeIndex === 2 }" size="mini" @click="btnChange(2)">今日</u-button>
          <u-button :class="{ active: dateTypeIndex === 3 }" size="mini" @click="btnChange(3)">昨日</u-button>
          <u-button :class="{ active: dateTypeIndex === 4 }" size="mini" @click="btnChange(4)">本月</u-button>
        </view>
        <view>
          <view @tap="showCalendar=!showCalendar">
            <view v-if="calendarFlag" style="display: flex;align-items: center;justify-content: center;">
              {{beginTime}} 至 {{endTime}}
            </view>
            <view v-else style="display: flex;justify-content: center;align-items: center;height: 60rpx;width: 100%;background: #F5F5F7">
              <view>自定义</view>
              <view>></view>
            </view>
          </view>
        </view>
        <u-calendar v-model="showCalendar" :mode="mode" @change="calendarChange"></u-calendar>
      </view>
      <view>
        <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreOrder">
          <!-- 空白页 -->
          <u-empty v-if="this.empty === true && this.orderlList.length === 0" text="暂无数据" mode="list"></u-empty>
          <view class="list-wrap">
            <view class="list-item border-bottom" v-for="(item, index) in this.orderlList" :key="index" >
              <view>
                <text>订单号：{{item.orderSn}}</text>
              </view>
              <view class="row-center-between">
                <view><u-image :src="item.avatar"  width="80rpx" height="80rpx" shape="circle"></u-image></view>
                <view><text>{{item.userName}}</text></view>
                <view><text>{{item.levelName}}</text></view>
                <view>
                  <u-button size="mini">待结算</u-button>
                </view>
              </view>
              <view class="row-center-between">
                <view>
                  <u-image :src="item.thumbnail"  width="160rpx" height="160rpx"></u-image>
                </view>
                <view class="col-center-between">
                    <view>{{item.goodName}}</view>
                    <view class="row-center-between">
                      <view>{{item.goodSku}}</view>
                      <view>x{{item.goodNum}}</view>
                    </view>
                </view>
              </view>
              <view class="row-center-between">
                <view>商品金额：￥{{item.goodPrice}}</view>
                <view>商品佣金：￥{{item.goodCommission}}</view>
              </view>
            </view>
          </view>
          <u-loadmore :status="this.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"/>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import {getDistributionOrderPage} from "@/faasmall/api/distribution";
import {getToDayBegin, getToDayEnd, format, getMonthFirstDay, getMonthLastDay} from "@/faasmall/utils/faasmall";
export default {
  name: "order",
  data(){
    return{
      dateTypeIndex:0,
      mode: 'range',
      calendarFlag:false,
      showCalendar:false,
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      //开始日期
      beginTime: '',
      //结束日期
      endTime: '',
      loadingType: 'loadmore',
      page: 1,
      total: 0,
      empty:false,
      orderlList: []
    }
  },
  onLoad(){
    this.loadData();
  },
  methods:{
    // tabs通知swiper切换
    btnChange(index) {
      debugger
      this.dateTypeIndex = index;
      if(index === 1){
        this.beginTime = '';
        this.endTime = '';
      }else if(index === 2){
        this.beginTime = getToDayBegin();
        this.endTime = getToDayEnd();
      }else if(index === 3){
        var today = new Date();
        today.setDate(today.getDate() - 1);
        debugger
        var yesterday = format(today,"yyyy-MM-dd");
        //this.beginTime =  yesterday + " 00:00:00";
        this.beginTime =  yesterday;
        this.endTime = yesterday;
      }else if(index === 4){
        //this.beginTime =  getMonthFirstDay() + " 00:00:00";
        //this.endTime = getMonthLastDay() + " 59:59:59";
        this.beginTime =  getMonthFirstDay();
        this.endTime = getMonthLastDay();
      }
      this.orderlList = [];
      this.loadData('tabChange');
    },
    loadMoreOrder() {
      this.loadData();
    },
    loadData(source){
      let page = this.page;
      debugger
      if (source === 'tabChange' && this.empty === true) {
        //tab切换只有第一次需要加载数据
        return;
      }
      if (this.loadingType === 'loading') {
        //防止重复加载
        return;
      }
      if (this.loadingType === 'nomore') {
        return;
      }
      this.loadingType = 'loading';
      getDistributionOrderPage({'pageNo':page,'pageSize':10,beginTime:this.beginTime,endTime:this.endTime}).then((res)=>{
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            this.orderlList.push(item);
          });
          this.total = res.data.total;
          if (res.data.list.length === this.orderlList.length) {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            this.loadingType = 'nomore';
            this.empty = true;
          } else {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            this.loadingType = 'loadmore';
            this.page = this.page + 1;
          }
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(error=>{
        console.error(error)
      })
    },
    calendarChange(data){
      // this.beginTime = data.startDate + " 00:00:00";
      // this.endTime = data.endDate + " 59:59:59";
      this.beginTime = data.startDate;
      this.endTime = data.endDate;
      this.calendarFlag = true;
    }
  }
}
</script>

<style scoped>
.active{
  color: #fff;
  background-color: #3c9cff;
  border-color: #3c9cff;
  border-width: 1px;
  border-style: solid;
}
</style>