<template>
  <view>
    <faasmall-navbar :backText="title"></faasmall-navbar>
    <view class="sort-bar-container row-center-between border-box">
      <block v-for="(items,index) in sortList" :key="index">
        <view class="sort-container row-center-center" :class="sortCurrent===index?'sort-container-active':''" @click="selectSort(index)">
          <view class="sort-name">
            {{items.sortName}}
          </view>
          <view class="sort-box" v-if="index===3">
            <image v-if="sortCurrent!==3 " :src="$FILE_URL + '/file/img/sort/sort.svg'" mode=""></image>
            <block v-else>
              <image v-if="priceUp" :src="$FILE_URL + '/file/img/sort/asce.svg'" mode=""></image>
              <image v-else :src="$FILE_URL + '/file/img/sort/desc.svg'" mode=""></image>
            </block>
          </view>
        </view>
      </block>
    </view>
    <view class="good-list-container">
      <faasmall-good-list  :list="goodList" :type="goodsType"></faasmall-good-list>
      <!-- 空白页 -->
      <u-empty v-if="isEmpty === true && goodList.length === 0" text="暂无数据" mode="list"></u-empty>
      <u-loadmore :status="loadStatus" :icon-type="iconType" :load-text="loadText" @loadmore="getGoodList"/>
    </view>
  </view>
</template>

<script>
import {getGoodPage} from "../../../faasmall/api/good";

export default {
  name: "list",
  data(){
    return {
      goodsType:'double',
      title:'商品分类',
      sortType:0,
      priceUp: false,
      sortCurrent:0,
      isEmpty:false,
      //加载更多标志
      loadMoreFlag:false,
      goodList: [],
      loadStatus: 'loadmore',
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      sortList: [{
        sortName: '人气',
        type: 'mood'
      },
        {
          sortName: '最新',
          type: 'newest'
        },
        {
          sortName: '销量',
          type: 'salesvolume'
        },
        {
          sortName: '价格',
          type: 'price'
        }
      ],
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
    }
  },
  onLoad(options) {
    if(options){
      this.params.categoryId = options.categoryId
      this.title = options.title
    }
    this.getGoodList()
  },
  onReachBottom() {
    if(this.loadMoreFlag){
      this.getGoodList()
    }
  },
  onPullDownRefresh() {
    this.params.pageNo = 1
    this.goodList = []
    this.getGoodList()
  },
  methods:{
    getGoodList(){
      debugger
      this.loadStatus = 'loading';
      getGoodPage(this.params).then((res)=>{
        uni.stopPullDownRefresh()
        if(res.code === 0){
          if(res.data.list.length === 0){
            this.isEmpty = true;
            this.loadStatus = 'nomore'
            this.loadMoreFlag = false;
          }else if (res.data.list.length < 10) {
            this.loadStatus = 'nomore'
            this.loadMoreFlag = false;
          } else {
            this.params.pageNo++;
            this.loadStatus = 'loading'
            this.loadMoreFlag = true;
          }
          if (this.params.pageNo > 1) {
            this.goodList = this.goodList.concat(res.data.list);
          } else {
            this.goodList = res.data.list;
          }
        }
      }).catch(error=>{
        console.error(error)
      })
    },
    toGood(info) {
      uni.navigateTo({
        url: 'pages/common/good/info?id=' + info.id
      })
    },
    selectSort(idx) {
      this.sortCurrent = idx
      this.params.pageNo = 1
      this.loadMore = false
      //0 人气 1最新 2销量 3 价格
      if (idx !== 3) {
        if(idx === 1){
          this.params.priceSort = 0; //价格
          this.params.salesSort = 0;  //销量
          this.params.newProdcutSort = 1; //新品优先
        }else if(idx === 2){
          this.params.priceSort = 0; //价格
          this.params.salesSort = 1;  //销量
          this.params.newProdcutSort = 0; //新品优先
        }else {
          this.params.priceSort = 0; //价格
          this.params.salesSort = 0;  //销量
          this.params.newProdcutSort = 0; //新品优先
        }
      } else {
        this.priceUp = !this.priceUp;
        if (this.priceUp) {
          this.params.priceSort = 1; //价格
          this.params.salesSort = 0;  //销量
          this.params.newProdcutSort = 0; //新品优先
        } else {
          this.params.priceSort = 2; //价格
          this.params.salesSort = 0;  //销量
          this.params.newProdcutSort = 0; //新品优先
        }
      }
      this.$nextTick(() => {
        this.getGoodList();
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.sort-bar-container {
  z-index: 10;
  position: fixed;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #FFFFFF;
  padding: 0 50rpx;
  border-top: 1rpx solid #F0F1F7;

  .sort-container {
    width: 90rpx;
    .sort-name {
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
    }
    .sort-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25rpx;
      height: 35rpx;
      margin-left: 5rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
  }
  .sort-container-active {
    .sort-name {
      color: #FF4242;
    }
  }
}

.good-list-container {
  width: 100%;
  height: 100%;
  margin-top: 120rpx;
}
</style>