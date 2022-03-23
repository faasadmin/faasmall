<template>
  <view class="goods-search">
    <view class="header-wrap">
      <u-sticky offset-top="0" h5-nav-height="0">
        <faasmall-navbar :is-back="true" title="全部商品"></faasmall-navbar>
        <view style="padding: 20rpx 20rpx 20rpx 20rpx;border-bottom: 0.5px solid #e6e6e6;background: #FFFFFF">
          <u-search placeholder="请输入关键字" :show-action="false"  @change="onSearch" @search="onSearch" @clear="clearSearch" v-model="searchVal"  bg-color="#F4F4F4"></u-search>
        </view>
      </u-sticky>
      <view class="content bg-white">
        <view v-if="hotList && hotList.length" class="search-words">
          <view class="title">热门搜索</view>
          <view class="words row wrap">
            <view v-for="(item, index) in hotList" :key="index" class="item br60  mr-2 mb-2 lighter sm line1" @tap="onSetKeyword(item)">{{item}}</view>
          </view>
        </view>
        <view v-if="historyList && historyList.length" class="search-words">
          <view class="title row-center-between">
            <view>历史搜索</view>
            <view class="xs muted mr-2" style="padding: 10rpx 20rpx" @tap="cleanSearchHistoryFun">清空</view>
          </view>
          <view class="words row-center-between wrap">
            <view v-for="(item, index) in historyList" :key="index" class="item br60  mr-2 mb-2 lighter sm line1" @tap="onSetKeyword(item)">{{item}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {cleanSearchHistory, getSearchInfo} from "@/faasmall/api/search";
export default {
  components: {},
  data() {
    return {
      searchVal: '',
      hotList:[],
      historyList:[],
    };
  },
  props: {},
  watch: {
  },
  computed: {
  },
  onLoad() {
    this.getSearch();
  },
  methods: {
    getSearch(){
      getSearchInfo().then((res)=>{
        this.hotList = res.data.hot;
        this.historyList = res.data.history;
      }).catch(error=>{
        console.error(error)
      })
    },
    // 键盘搜索,输入搜索
    onSearch() {
      this.getGoodsList();
    },
    // 清除搜索框
    clearSearch() {
      this.searchVal = '';
    },
    //清除搜索历史
    cleanSearchHistoryFun(){
      cleanSearchHistory();
    },
    onSetKeyword(item){
      this.searchVal = item
      this.getGoodsList();
    },
    getGoodsList(){
      //跳转界面
      this.$router.push({ path: '/pages/common/good/list', query: { keywords: this.searchVal } });
    },
  }
};
</script>
<style lang="scss">
.search-words {
  padding: 20rpx;
  .title {
    padding: 10rpx 0;
  }
  .words {
    .item {
      line-height: 52rpx;
      height: 52rpx;
      padding: 0 24rpx;
      background-color: #F5F5F5;
    }
  }
}

.goods-list {
  overflow: hidden;
}
</style>
