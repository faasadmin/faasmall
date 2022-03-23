<template>
  <view class="goods-search">
    <view class="header-wrap">
      <u-sticky offset-top="0" h5-nav-height="0">
        <faasmall-navbar :is-back="true" :title="title"></faasmall-navbar>
        <view style="padding: 20rpx 20rpx 20rpx 20rpx;border-bottom: 0.5px solid #e6e6e6;background: #FFFFFF">
          <u-search placeholder="请输入关键字" :show-action="false" @focus="showHistory = true" :focus="showHistory" @change="onSearch" @search="onSearch" @clear="clearSearch" v-model="searchVal"  bg-color="#F4F4F4"></u-search>
          <!-- 筛选栏-->
          <good-filter v-show="!showHistory" @change="onFilter" @showType="showType"></good-filter>
        </view>
      </u-sticky>
      <view v-show="showHistory" class="content bg-white">
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
      <view v-show="!showHistory" class="content">
        <faasmall-good-list :list="goodsList" :type="goodsType"></faasmall-good-list>
        <!-- 空白页 -->
        <u-empty v-if="isEmpty === true && goodsList.length === 0" text="暂无数据" mode="list"></u-empty>
        <u-loadmore :status="loadStatus" :icon-type="iconType" :load-text="loadText" @loadmore="getGoodsList"/>
      </view>
    </view>
  </view>
</template>

<script>
import goodFilter from './components/good-filter.vue';
import {getGoodPage} from "@/faasmall/api/good";
import {cleanSearchHistory, getSearchInfo} from "@/faasmall/api/search";
import platform from "@/faasmall/utils/platform";
import jwt from '@/faasmall/utils/cache/jwt.js';
export default {
  components: {goodFilter},
  data() {
    return {
      headerH: 0,
      loadStatus: 'loadmore',
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      title:'搜索',
      goodsType: 'double',
      goodsList: [],
      isEmpty:false,
      searchVal: '',
      showHistory: false,
      params: {
        categoryId:0,
        pageNo: 1,
        keywords: '',
        pageSize: 10,
        priceSort: 0, //价格
        salesSort: 0, //销量
        newProdcutSort: 0, //新品优先
        platform: this.$platform.get(),
      },
      hotList:[],
      historyList:[],
    };
  },
  props: {},
  watch: {
    // 监听属性
    searchVal(value, old) {
      if (!value && !this.id) {
        this.showHistory = true
        this.title = '搜索';
      }
    },
    showHistory(value) {
      if (value) {
        this.getSearch();
      }
    }
  },
  computed: {

  },
  onLoad() {
    debugger
    if (this.$Route.query.id) {
      this.params.categoryId = this.$Route.query.id;
      this.getGoodsList();
    } else if (this.$Route.query.hasOwnProperty('keywords')) {
      this.params.keywords = this.$Route.query.keywords;
      this.searchVal = this.$Route.query.keywords;
      !this.$Route.query.keywords && this.getGoodsList();
    }else if (this.$Route.query.hasOwnProperty('search')) {
      this.showHistory = true;
    }else {
      this.getGoodsList();
    }
  },
  // 触底加载更多
  onReachBottom() {
    this.getGoodsList();
  },
  methods: {
    getSearch(){
      if(jwt.isLogin()){
        getSearchInfo().then((res)=>{
          this.hotList = res.data.hot;
          this.historyList = res.data.history;
        }).catch(error=>{
          console.error(error)
        })
      }
    },
    showType(e){
      this.goodsType = e.goodsType;
    },
    onFilter(e) {
      debugger
      this.params.priceSort = e.priceSort;
      this.params.salesSort = e.salesSort;
      this.params.newProdcutSort = e.newProdcutSort;
      this.goodsType = e.goodsType;
      this.goodsList = [];
      this.params.pageNo = 1;
      this.clear();
      this.loadStatus = 'loadmore';
      this.$u.debounce(this.getGoodsList);
    },
    // 键盘搜索,输入搜索
    onSearch() {
      this.loadStatus = 'loadmore';
      this.isEmpty = false;
      this.goodsList = [];
      this.params.pageNo = 1;
      this.params.keywords = this.searchVal;
      this.clear();
      this.$u.debounce(this.getGoodsList);
    },
    clear() {
      this.goodsList = [];
    },
    // 清除搜索框
    clearSearch() {
      this.searchVal = '';
      this.clear();
    },
    //清除搜索历史
    cleanSearchHistoryFun(){
      cleanSearchHistory().then(res => {
        if (res.code === 0) {
          this.getSearch();
        }
      });
    },
    onSetKeyword(item){
      this.searchVal = item
      this.showHistory = false
      this.getGoodsList();
    },
    getGoodsList(){
      this.title = '商品列表';
      this.showHistory = false
      // if (this.isEmpty === true) {
      //   //tab切换只有第一次需要加载数据
      //   return;
      // }
      if (this.loadStatus === 'loading') {
        //防止重复加载
        return;
      }
      if (this.loadStatus === 'nomore') {
        return;
      }
      this.loadStatus = 'loading';
      debugger
      getGoodPage(this.params).then((res)=>{
        if(res.code === 0){
          if (res.data.list.length < 10) {
            this.loadStatus = 'nomore'
            this.isEmpty = true;
          } else {
            this.params.pageNo += 1;
            this.loadStatus = 'loading'
          }
          this.goodsList= [...this.goodsList, ...res.data.list];
        }
      }).catch(error=>{
        console.error(error)
      })
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
