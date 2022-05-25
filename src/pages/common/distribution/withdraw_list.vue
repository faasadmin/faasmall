<template>
  <view>
    <view>
      <faasmall-month-select  :value="monthShow" @currentMonth="onSelectMonth"/>
      <view class="border-bottom">
        <u-tabs-swiper ref="uTabs" active-color="#FF0505" :list="tabList" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
      </view>
      <view style="height: 60rpx;width: 100%;display: flex;align-items: center;justify-content: center">
        <view @tap="monthShow = !monthShow">
          <text>{{toMonth}} <text :class="[monthShow?'icon-shang':'icon-xiala','iconfont']"></text></text>
        </view>
      </view>
      <swiper :style="{'height': scrollHeight+'px'}" duration="300" :current="tabCurrentIndex"  style="height: 100%;"  @change="changeSwiper">
        <swiper-item  class="tab-content" v-for="(tabItem,tabIndex) in tabData" :key="tabIndex">
          <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreWithdraw">
            <!-- 空白页 -->
            <u-empty v-if="tabItem.empty === true && tabItem.withdrawList.length === 0" text="暂无数据" mode="list"></u-empty>
            <view class="list-wrap">
              <view class="list-item border-bottom" v-for="(item, index) in tabItem.withdrawList" :key="index" >
                <view class="row-center-between">
                  <view class="col-center-between">
                    <view>{{item.title}}</view>
                    <view>{{item.account}}</view>
                    <view>{{item.time}}</view>
                  </view>
                  <view class="col-center-between">
                      <view><u-button size="mini">{{item.tip}}</u-button></view>
                      <view>￥{{item.amount}}</view>
                      <view>手续费￥{{item.handlingFee}}</view>
                  </view>
                </view>
              </view>
            </view>
            <u-loadmore :status="tabItem.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreWithdraw"/>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import {isNotEmpty} from "@/faasmall/utils/faasmall";
import {getWithdrawPage} from "@/faasmall/api/withdraw";
import {getToMonth} from "@/faasmall/utils/faasmall";
export default {
  name: "withdraw",
  data(){
    return{
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      toMonth: getToMonth(),
      monthShow:false,
      scrollHeight:'',
      tabCurrentIndex: 0,
      month:'',
      tabList:[
        {
          status: '1',
          name: '全部',
          count: 0
        }, {
          status: '2',
          name: '待审核',
          count: 0
        }, {
          status: '3',
          name: '待打款',
          count: 0
        }, {
          status: '4',
          name: '已打款',
          count: 0
        }, {
          status: '5',
          name: '已拒绝',
          count: 0
        }
      ],
      tabData: [{
        status: '1',
        text: '全部',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        withdrawList: []
      },{
        status: '2',
        text: '待审核',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        withdrawList: []
      },{
        status: '3',
        text: '待打款',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        withdrawList: []
      },{
        status: '4',
        text: '已打款',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        withdrawList: []
      },{
        status: '5',
        text: '已拒绝',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        withdrawList: []
      }],
    }
  },
  mounted(){
    let that = this;
    let info = uni.createSelectorQuery().select(".scrollbox");
    info.boundingClientRect(function(data) {
      if(isNotEmpty(data) && isNotEmpty(data.height)){
        that.scrollHeight = data.height+10
      }
    }).exec()
    console.log(that.scrollHeight)
  },
  onShow(){

  },
  onLoad(){
    this.init();
  },
  methods:{
    init(){
      this.loadData();
    },
    // tabs通知swiper切换
    tabsChange(index) {
      debugger
      this.tabCurrentIndex = index;
      this.loadData('tabChange');
    },
    //swiper 切换
    changeSwiper(e) {
      this.tabCurrentIndex = e.target.current;
      this.loadData('tabChange');
    },
    loadMoreWithdraw() {
      let index = this.tabCurrentIndex;
      this.tabData[index].page = this.tabData[index].page + 1;
      this.loadData();
    },
    loadData(source){
      //这里是将订单挂载到tab列表下
      let index = this.tabCurrentIndex;
      let navItem = this.tabData[index];
      let status = navItem.status;
      let page = navItem.page;
      if (source === 'tabChange' && navItem.empty === true) {
        //tab切换只有第一次需要加载数据
        return;
      }
      if (navItem.loadingType === 'loading') {
        //防止重复加载
        return;
      }
      if (navItem.loadingType === 'nomore') {
        return;
      }
      navItem.loadingType = 'loading';
      debugger
      getWithdrawPage({'pageNo':page,'pageSize':10,'status':status,'month':this.month}).then((res)=>{
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            navItem.withdrawList.push(item);
          });
          navItem.total = res.data.total;
          if (res.data.list.length === navItem.withdrawList.length) {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            navItem.loadingType = 'nomore';
          } else {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            navItem.loadingType = 'loadmore';
          }
          this.$set(navItem, 'empty', true);
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
    onSelectMonth(months){
      console.log(months)
      this.month = months[0].value + '-' + months[1].value;
      console.log(this.month)
    }
  }
}
</script>

<style scoped>

</style>