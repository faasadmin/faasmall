<template>
  <view>
    <!-- 空白页 -->
    <view>
      <view class="border-bottom" style="background: #FFFFFF">
        <u-tabs-swiper active-color="#FF0505" v-if="tabList && tabList.length > 0" ref="uTabs" :list="tabList" name="name" count="count" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        <view style="display: flex;justify-content: space-between;align-items: center;padding: 20rpx">
          <view>
            <text>今日新增{{tabList[this.tabCurrentIndex].addedToday ===''?0:tabList[this.tabCurrentIndex].addedToday}}人</text>
          </view>
          <view>
            <text>今日流失{{tabList[this.tabCurrentIndex].outflowToday ===''?0:tabList[this.tabCurrentIndex].outflowToday}}人</text>
          </view>
        </view>
      </view>
      <swiper :style="{'height': scrollHeight+'px'}" duration="300" :current="tabCurrentIndex"  style="height: 100%;"  @change="changeSwiper">
        <swiper-item  class="tab-content" v-for="(tabItem,tabIndex) in tabData" :key="tabIndex">
          <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreOffLine">
            <!-- 空白页 -->
            <u-empty v-if="tabItem.empty === true && tabItem.offlineList.length === 0" text="暂无数据" mode="list"></u-empty>
            <view style="display: flex;background: #FFFFFF;">
              <view class="border-bottom" v-for="(item, index) in tabItem.offlineList" :key="index" style="width: 100%;display: flex;flex-direction: column;justify-content: space-between;padding: 20px;height:120px;align-items: center;">
                <view style="display: flex;justify-content: space-between;align-items: center;width: 100%">
                  <view style="display: flex;justify-content: flex-start;">
                    <view>
                      <u-image :src="item.avatar"  width="80rpx" height="80rpx" shape="circle"></u-image>
                    </view>
                    <view>
                      <view>{{item.userName}}</view>
                      <view>{{item.joinTime | timeFormat('yyyy-mm-dd') }}</view>
                    </view>
                  </view>
                  <view>
                    邀请：{{item.inviteNumber}}人
                  </view>
                </view>
                <view style="display: flex;width: 100%;justify-content: space-between">
                  <view style="display: flex;flex-direction:column;align-items: center;justify-content: center">
                      <view>￥{{item.goodAmount}}</view>
                      <view>商品金额</view>
                  </view>
                  <view style="height: 100%;width: 1px;background:#F2F2F2"></view>
                  <view style="display: flex;flex-direction:column;align-items: center;justify-content: center">
                    <view>{{item.orderNumber}}</view>
                    <view>订单总数</view>
                  </view>
                  <view style="height: 100%;width: 1px;background:#F2F2F2"></view>
                  <view style="display: flex;flex-direction:column;align-items: center;justify-content: center">
                    <view>￥{{item.contributionCommission}}</view>
                    <view>贡献佣金</view>
                  </view>
                </view>
              </view>
            </view>
            <u-loadmore :status="tabItem.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOffLine"/>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import {
  getDistributionOfflineCollect,
  getDistributionOfflinePage,
  getDistributionOrderPage
} from "@/faasmall/api/distribution";
import {isNotEmpty} from "@/faasmall/utils/faasmall";
import {mapGetters} from "vuex";

export default {
  name: "offline",
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
      tabList:[{
        name:'暂无',
        //今日新增
        addedToday:'',
        //今日流失
        outflowToday:'',
      }],
      tabData: [{
        status: '1',
        text: '一级',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        offlineList: []
      },{
        status: '2',
        text: '二级',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        offlineList: []
      },{
        status: '3',
        text: '三级',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        offlineList: []
      }],
    }
  },
  onLoad(){
    getDistributionOfflineCollect().then((res)=>{
      debugger
      if(res.code === 0){
        if(res.data.length > 0){
          this.tabList = res.data;
        }
      }
    }).catch(err=>{
      console.log(err);
    })
    this.loadData();
  },
  computed: {
    ...mapGetters(['isLogin','memberInfo','shopData','distributionOtherData']),
  },
  mounted(){
    console.info(this.shopData);
    console.info(this.$store.state.faasmall.distributionOther.twoOffline);
    console.info(this.distributionOtherData.twoOffline);
    debugger
    this.tabData[0].text = this.distributionOtherData.oneOffline;
    this.tabData[1].text = this.distributionOtherData.twoOffline;
    this.tabData[2].text = this.distributionOtherData.threeOffline;
    debugger
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
  methods:{
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
    loadMoreOffLine() {
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
      var parentIds = this.tabList[index].offline;
      debugger
      getDistributionOfflinePage({'pageNo':page,'pageSize':10,parentIds:parentIds}).then((res)=>{
        debugger
        if(res.code === 0){
          let list = res.data.list;
          debugger
          if(list.length > 0){
            list.forEach(item => {
              navItem.offlineList.push(item);
            });
            navItem.total = res.data.total;
            if (res.data.list.length === navItem.offlineList.length) {
              //判断是否还有数据， 有改为 more， 没有改为noMore
              navItem.loadingType = 'nomore';
            } else {
              //判断是否还有数据， 有改为 more， 没有改为noMore
              navItem.loadingType = 'loadmore';
            }
            this.$set(navItem, 'empty', true);
          }else {
            this.$set(navItem, 'empty', true);
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
  }
}
</script>

<style scoped>

</style>