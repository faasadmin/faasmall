<template>
  <view class="fixed-wraper">
    <view class="fixed-content">
      <view>
        <swiper class="swiper" :current="pageCurrent" :style="{'height':scrollHeight + 'px'}">
          <!--  我的优惠卷  -->
          <swiper-item class="swiper-item" @touchmove.stop>
            <view class="tabs-swiper-wrap">
              <view class="border-bottom head-box">
                <u-tabs-swiper ref="uTabs" active-color="#FF0505" :list="tabList" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
              </view>
              <swiper :current="tabCurrentIndex" duration="300" @change="changeSwiper" :style="{'height':(scrollHeight-60) + 'px'}">
                <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in tabData" :key="tabIndex">
                  <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadMoreMemberCoupon" :style="{'height':(scrollHeight-60) + 'px'}">
                    <!-- 空白页 -->
                    <u-empty v-if="tabItem.empty === true && tabItem.couponList.length === 0" text="暂无数据" mode="list"></u-empty>
                    <!-- 优惠卷列表 -->
                    <view class="content_box" style="padding: 20rpx">
                      <faasmall-coupon-list v-for="(item, index) in tabItem.couponList" :key="index" :item="item" theme="#ff0000" />
                    </view>
                    <u-loadmore :status="tabItem.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreMemberCoupon"/>
                  </scroll-view>
                </swiper-item>
              </swiper>
            </view>
          </swiper-item>
          <!--  优惠卷中心  -->
          <swiper-item class="swiper-item" @touchmove.stop >
            <view class="bottom-footer">
              <scroll-view scroll-y :style="{'height':(scrollHeight-20)+ 'px'}" @scrolltolower="loadMoreCouponCenter">
                <!-- 空白页 -->
                <u-empty v-if="couponCenterData.empty === true && couponCenterData.couponList.length === 0" text="暂无数据" mode="list"></u-empty>
                <view class="content_box disss">
                  <faasmall-coupon-list v-for="(item, index) in couponCenterData.couponList" :key="index" :item="item" theme="#ff0000" source="member_center"/>
                </view>
                <u-loadmore :status="couponCenterData.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreCouponCenter"/>
              </scroll-view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="fixed-footer" style="background: #FFFFFF;padding: 20rpx 120rpx">
      <view class="row-center-between navbar-botton">
        <view class="flex flex-column justify-between align-center"  :class="[pageCurrent === 0 ? 'selected' : '']" @tap="couponPageSelect(0)">
          <view><text class="iconfont icon-youhuiquan"></text></view>
          <view><text>我的优惠卷</text></view>
        </view>
        <view class="flex flex-column justify-between align-center" :class="[pageCurrent === 1 ? 'selected' : '']" @tap="couponPageSelect(1)">
          <view><text class="iconfont icon-youhui"></text></view>
          <view><text>优惠卷中心</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getCouponList, getCouponPage} from "@/faasmall/api/coupon";
import {getMemeberCouponPage} from "@/faasmall/api/member";

export default {
  data() {
    return {
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      scrollHeight:'',
      // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
      tabCurrentIndex: 0, // tabs组件的current值，表示当前活动的tab选项
      pageCurrent: 0,
      tabList:[
        {
          status: '1',
          name: '未使用',
          total: 0
        }, {
          status: '2',
          name: '已使用',
          total: 0
        },{
          status: '3',
          name: '已失效',
          total: 0
        }
      ],
      tabData: [{
        status: '1',
        text: '未使用',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        couponList: [],
        tempList:[],
      },{
        status: '2',
        text: '已使用',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        couponList: [],
        tempList:[],
      },{
        status: '3',
        text: '已失效',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        couponList: [],
        tempList:[],
      }],
      //优惠卷中心
      couponCenterData:{
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        couponList: [],
        tempList:[],
      }
    };
  },
  onLoad(options) {
    this.loadData();
  },
  mounted(){
    let info = uni.createSelectorQuery().in(this).select('.fixed-content').boundingClientRect()
    info.exec(res => {
      this.scrollHeight = res[0].height;
      console.log(this.scrollHeight)
    })
  },
  methods: {
    //加载更多事件
    loadMoreMemberCoupon() {
      let index = this.tabCurrentIndex;
      this.tabData[index].page = this.tabData[index].page + 1;
      this.loadData();
    },
    loadMoreCouponCenter(){
      this.couponCenterData.page = this.couponCenterData.page+1;
      this.loadCouponCenter();
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
      getMemeberCouponPage({'pageNo':page,'pageSize':10,'platform':this.platform,'status':status}).then((res)=>{
        if(res.code === 0){
          debugger
          let list = res.data.list;
          list.forEach(item => {
            if(item.expireType === 2){
              navItem.tempList.push(item);
              var currentTime = new Date();
              var endTime= item.endTime.replace("-","/");//替换字符，变成标准格式
              endTime= new Date(Date.parse(endTime));
              if(currentTime < endTime){
                navItem.couponList.push(item);
              }
            }else {
              navItem.couponList.push(item);
            }
          });
          navItem.total = res.data.total;
          debugger
          if (res.data.total === navItem.tempList.length) {
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
    loadCouponCenter(){
      let page = this.couponCenterData.page;
      debugger
      if (this.couponCenterData.empty === true) {
        return;
      }
      if (this.couponCenterData.loadingType === 'loading') {
        //防止重复加载
        return;
      }
      if (this.couponCenterData.loadingType === 'nomore') {
        return;
      }
      getCouponPage({'pageNo':page,'pageSize':10}).then((res)=>{
          if(res.code === 0){
            let list = res.data.list;
            debugger
            if(res.data.list === 0){
              this.$set(this.couponCenterData, 'empty', true);
            }
            debugger
            list.forEach(item => {
              this.couponCenterData.tempList.push(item);
              if(item.expireType === 2){
                var currentTime = new Date();
                var endTime= item.endTime.replace("-","/");//替换字符，变成标准格式
                endTime= new Date(Date.parse(endTime));
                if(currentTime < endTime){
                  this.couponCenterData.couponList.push(item);
                }
              }else {
                this.couponCenterData.couponList.push(item);
              }
            });
            this.couponCenterData.total = res.data.total;
            console.log(this.couponCenterData.tempList.length)
            debugger
            if (res.data.total === this.couponCenterData.tempList.length) {
              //判断是否还有数据， 有改为 more， 没有改为noMore
              this.couponCenterData.loadingType = 'nomore';
            } else {
              //判断是否还有数据， 有改为 more， 没有改为noMore
              this.couponCenterData.loadingType = 'loadmore';
            }
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: "none",
            });
          }
      }).catch(error=>{
        console.error(error);
      })
    },
    //swiper 切换
    changeSwiper(e) {
      this.tabCurrentIndex = e.target.current;
      this.loadData('tabChange');
    },
    // tabs通知swiper切换
    tabsChange(index) {
      this.tabCurrentIndex = index;
      this.loadData('tabChange');
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
    // swiper滑动结束，分别设置tabs和swiper的状态
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.tabCurrentIndex = current;
    },
    couponPageSelect(index){
      this.pageCurrent = index;
      if(this.couponCenterData.couponList.length == 0){
        this.loadCouponCenter();
      }
    },
  }
};
</script>

<style lang="scss">
page {
  height:100%; /*这里也要定义，重要*/
  width:100%;
}
.selected{
  color: #FF2C3C;
}
.fixed-bottom{
  .navbar-botton{
    padding: 20rpx 100rpx;
    height: 150rpx;
    background: #FFFFFF;
  }
}
swiper{
  //height: 100vh;
  //flex: 1;
}
.coupon-nav {
  background: #fff;
  height: 100rpx;
  .nav-item {
    flex: 1;
    .item-title {
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 76rpx;
    }

    .nav-line {
      width: 120rpx;
      height: 4rpx;
      background: #fff;
    }

    .line-active {
      // background: rgba(230, 184, 115, 1);
      background: #FF4A26;
    }
  }
}
.bottom-footer{
  padding: 20rpx;
}
</style>