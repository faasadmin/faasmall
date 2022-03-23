<template>
  <view>
    <faasmall-navbar title="我的积分" :is-back="true"></faasmall-navbar>
    <view class="bg-wrap">
        <view class="p-2 row-center-between bg-container">
          <view>
            <text class="iconfont icon-comment"></text>{{integral}}
          </view>
          <view>
            去使用
            <text class="iconfont icon-page-next1"></text>
          </view>
        </view>
    </view>
    <view class="tabs-swiper-wrap">
      <view class="border-bottom">
        <u-tabs-swiper ref="uTabs" :list="tabList" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
      </view>
      <swiper :style="{'height': scrollHeight+'px'}" duration="300" :current="tabCurrentIndex"  style="height: 100%;"  @change="changeSwiper">
        <swiper-item  class="tab-content" v-for="(tabItem,tabIndex) in tabData" :key="tabIndex">
          <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreIntegral">
            <!-- 空白页 -->
            <u-empty v-if="tabItem.empty === true && tabItem.integralList.length === 0" text="暂无数据" mode="list"></u-empty>
            <view class="list-wrap">
              <view class="list-item border-bottom" v-for="(item, index) in tabItem.integralList" :key="index" >
                 <view class="col" style="height: 100%!important;">
                    <text>{{item.title}}</text>
                    <text>{{item.createTime}}</text>
                 </view>
                 <view>
                   <text>{{item.modeName}}{{item.extend}}</text>
                 </view>
              </view>
            </view>
            <u-loadmore :status="tabItem.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreIntegral"/>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import {getMemberInfo} from "@/faasmall/api/member";
import {getIntegralPage} from "@/faasmall/api/integral";
import {isNotEmpty} from "@/faasmall/utils/faasmall";
export default {
  name: "integral",
  data(){
    return{
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      scrollHeight:'',
      tabCurrentIndex: 0,
      tabList:[
        {
          status: '1',
          name: '全部',
          total: 0
        }, {
          status: '2',
          name: '收入',
          total: 0
        }, {
          status: '3',
          name: '支出',
          total: 0
        }
      ],
      tabData: [{
        status: '1',
        text: '全部',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        integralList: []
      },{
        status: '2',
        text: '收入',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        integralList: []
      },{
        status: '3',
        text: '支出',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        integralList: []
      }],
      integral:0,
    }
  },
  mounted(){
    let that = this;
    let info = uni.createSelectorQuery().select(".scrollbox");
    info.boundingClientRect(function(data) { //data - 各种参数
      // 　　　  　console.log(data.height)  // 获取元素宽度
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
      getMemberInfo().then((res)=>{
        if(res.code === 0){
          this.integral = res.data.integral;
        }else {
          this.messageerror(res.msg);
        }
      }).catch(err=>{
        console.error(err);
      })
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
    loadMoreIntegral() {
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
      getIntegralPage({'pageNo':page,'pageSize':10,'status':status}).then((res)=>{
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            navItem.integralList.push(item);
          });
          navItem.total = res.data.total;
          if (res.data.list.length === navItem.integralList.length) {
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
  }
}
</script>

<style lang="scss">
.bg-wrap{
  background-image: url("http://dummyimage.com/375x100");
  width: 100%;
  height: 200rpx;
  .bg-container{
    height: 100%;
  }
}
.tabs-swiper-wrap{

}
</style>