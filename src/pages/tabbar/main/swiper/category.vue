<template>
  <scroll-view class="swiper-scroll" scroll-y="true" :scroll-top='scrollIndex' @scroll='pageScroll' scroll-with-animation lower-threshold='500'
               @scrolltolower='getNextPage' :refresher-threshold='75' :refresher-triggered='triggeredState' :refresher-enabled='freshStatus && refresher'
               @refresherrefresh='refresh' @refresherrestore="onRestore" refresher-default-style='none' :bounce='false'>
    <view class="category-page-wrapper">
      <!--加载图片-->
      <view :style="'padding-top:'+(topHeight-75)+'px;background-color: #FFFFFF; width: 100%;'">
        <view class="loading-img">
          <view class="img-box">
            <image :src="$FILE_URL + '/file/img/home/loading.gif'" mode="aspectFill"></image>
          </view>
        </view>
      </view>
      <!-- 分类 -->
      <view class="two-category-container">
        <view class="two-category-content-container">
          <block v-for="(items,index) in childClassifyList" :key="index">
            <view class="two-category-item" @tap="toPage(items)">
              <view class="itefaas-container">
                <view class="category-pic">
                  <image :src="items.img" mode="aspectFill"></image>
                </view>
                <view class="category-name-box">
                  <view>{{items.name}}</view>
                </view>
              </view>
            </view>
          </block>
        </view>
      </view>
      <!--内容-->
      <view class="category-good-container">
        <!-- 排序 -->
        <view class="sort-container">
          <block v-for="(items,index) in sortList" :key="index">
            <view class="sort-itefaas-container" :class="sortCurrent==index?'itefaas-container-active':''" @click="selectSort(index)">
              <view class="sort-name">
                {{items.sortName}}
              </view>
              <view class="sort-type" v-if="index==3">
                <image v-if="sortCurrent!=3 " :src="$FILE_URL + '/file/img/sort/sort.svg'" mode=""></image>
                <block v-else>
                  <image v-if="priceUp" :src="$FILE_URL + '/file/img/sort/asce.svg'" mode=""></image>
                  <image v-else :src="$FILE_URL + '/file/img/sort/desc.svg'" mode=""></image>
                </block>
              </view>
            </view>
          </block>
        </view>
        <view class="goods-container" v-if='loadFlag'>
          <view class="goods-list-wraper">
            <view class="goods-itefaas-container" v-for="(items,index) in goodsList" :key='index' @click="toGood(items)">
              <view class="itefaas-container">
                <view class="image-container">
                  <image :src="items.thumbnail" mode="aspectFill"></image>
                </view>
                <view class="goods-info-wraper">
                  <view class="goods-name-box">
                    <view class="goods-name">
                      <view class="goods-title">
                        {{items.name}}
                      </view>
                    </view>
                    <view class="good-price-container">
                      <view class="now-price-wraper">
                        <view class="rmb-icon">
                          ￥
                        </view>
                        <view class="now-price">
                          {{items.sellingPrice}}
                        </view>
                      </view>
                      <view class="old-price-wraper">
                        <view class="old-price">
                          ￥{{items.linePrice}}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <u-loadmore :status="loadStatus" :icon-type="iconType"
                      :loading-text="loadingText"
                      :loadmore-text="loadmoreText"
                      :nomore-text="nomoreText" />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import {getLevelCategroy} from "../../../../faasmall/api/category";
import {getGoodPage} from "../../../../faasmall/api/good";
import setting from "@/pages/common/tool/setting";

export default {
  props: {
    topHeight: {
      type: Number,
      default: 90
    },
    loadFlag: {
      type: Boolean,
      default: false
    },
    refresher:{
      type:Boolean
    },
    parentId: [Number, String],
  },
  data() {
    const _this = this
    return {
      $FILE_URL: _this.$FILE_URL,
      sortCurrent: 0,
      //金额排序
      priceUp: false,
      //二级分类
      childClassifyList: [],
      //排序列表
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
      //商品列表
      goodsList: [],
      //加载更多
      loadMore: false,
      //当前页面
      currentPage: 1,
      //加载状态
      loadStatus: 'loadmore',
      iconType: 'flower',
      loadingText: '努力加载中',
      loadmoreText: '轻轻上拉',
      nomoreText: '实在没有了',
      //滚动下标
      scrollIndex: 0,
      //触发状态
      triggeredState: true,
      //刷新状态
      freshStatus: true,
      params: {
        categoryId:this.parentId,
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
  created() {
    this.currentPage = 1
    this.loadMore = false
    this.loadStatus = 'loading'
    if (this.loadFlag) {
      if (this.parentId) {
        this.getClassifyList()
        this.getGoodList();
      }
    }
  },
  watch: {
    loadFlag(nval, oval) {
      if (nval) {
        this.currentPage = 1
        this.loadMore = false
        this.getClassifyList()
        this.getGoodList();
      }
    }
  },
  methods: {
    refresh(e) {
      this.triggeredState = true
      if (this._freshing) return;
      this._freshing = true;
      this.goodsList = [];
      this.currentPage = 1;
      this.loadMore = false;
      this.loadStatus = 'loading';
      this.getClassifyList();
      this.getGoodList();
    },
    onRestore() {
      console.log('下拉被终止')
      uni.stopPullDownRefresh()
    },
    pageScroll(e) {
      this.$emit('scrollNum', e.detail.scrollTop)
      if (!e.detail.scrollTop > 0) {
        setTimeout(() => {
          this.freshStatus = true
        })
      } else {
        // this.freshStatus = false
      }
    },
    onAbort() {
      console.log('refushstop');
    },
    getGoodList() {
      var that = this;
      this.params.pageNo = 1;
      getGoodPage(this.params).then((res) => {
        if (res.code === 0){
          if (res.data.list.length < 20) {
            this.loadingState = false
            this.loadStatus = 'normal'
          } else {
            this.loadStatus = 'loading'
            this.loadingState = true
          }
          setTimeout(() => {
            this.triggeredState = false;
            this._freshing = false;
          }, 100)
          that.goodsList = res.data.list;
        }
      })
    },
    //下一页
    getNextPage() {
      this.params.pageNo = this.currentPage;
      getGoodPage(this.params).then((res) => {
        if (res.code === 0){
          if (res.data.list.length < 20) {
            this.loadingState = false
            this.loadStatus = 'normal'
          } else {
            this.currentPage = this.currentPage++;
            this.loadStatus = 'loading'
            this.loadingState = true
          }
          setTimeout(() => {
            this.triggeredState = false;
            this._freshing = false;
          }, 100)
          if (this.currentPage > 1) {
            this.goodsList = this.goodsList.concat(res.data.list);
          } else {
            this.goodsList = res.data.list;
          }
        }
      })
    },
    //获取分类列表
    getClassifyList() {
      debugger
      //根据一级获取所有子集分类
      getLevelCategroy({
        level: 2,
        parentId: this.parentId
      }).then((res)=>{
        debugger
        if (res.code !== 0){
          this.$u.toast(res.msg);
        }
        this.childClassifyList = res.data;
      }).catch(error=>{
        console.error(error);
      })
    },
    selectSort(idx) {
      this.sortCurrent = idx
      this.currentPage = 1
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
    toGood(info) {
      uni.navigateTo({
        url: 'pages/common/good/info?id=' + info.id
      })
    },
    toPage(info) {
      //跳转界面
      uni.navigateTo({
        url:  '/pages/common/category/list?categoryId=' + info.id + '&title=' + info.name
      })
    }
  }
}
</script>

<style lang="scss">
.category-page-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  .loading-img {
    width: 100%;
    height: 150rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .img-box {
      width: 208rpx;
      height: 126rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .two-category-container {
    width: 100%;
    background-color: #FFFFFF;
    .two-category-content-container {
      flex-wrap: wrap;
      margin-top: 20rpx;
      padding: 0 5rpx;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .two-category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 185rpx;
        .itefaas-container {
          margin-bottom: 40rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          .category-pic {
            width: 95rpx;
            height: 95rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .category-name-box {
            font-size: 24rpx;
            font-weight: 400;
            color: #333333;
            margin-top: 15rpx;
          }
        }
      }
    }
  }

  .category-good-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    .sort-container {
      width: 100%;
      height: 100rpx;
      background-color: #FFFFFF;
      padding: 0 50rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      .sort-itefaas-container {
        width: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .sort-name {
          font-size: 24rpx;
          font-weight: 400;
          color: #333333;
        }
        .sort-type {
          width: 25rpx;
          height: 35rpx;
          margin-left: 5rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
      .itefaas-container-active {
        .sort-name {
          color: #FF4242;
        }
      }
    }
    .goods-container {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      .goods-list-wraper {
        width: 100%;
        flex-wrap: wrap;
        margin-top: 20rpx;
        padding: 0 14rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .goods-itefaas-container {
          width: 354rpx;
          margin-bottom: 20rpx;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          .itefaas-container {
            width: 354rpx;
            overflow: hidden;
            border-radius: 8rpx;
            background-color: #FFFFFF;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
            .image-container {
              width: 100%;
              height: 354rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              image {
                width: 100%;
                height: 100%;
              }
            }

            .goods-info-wraper {
              width: 100%;
              margin-top: 10rpx;
              padding: 0 10rpx 10rpx 10rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              box-sizing: border-box;
              .goods-name-box {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                .goods-name {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  .typeIcon-content {
                    width: 60rpx;
                    height: 24rpx;
                    margin-right: 5rpx;
                  }
                  .goods-title {
                    width: 250rpx;
                    font-size: 28rpx;
                    line-height: 34rpx;
                    font-weight: 400;
                    color: #333333;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  }
                }
                .good-price-container {
                  width: 100%;
                  display: flex;
                  align-items: flex-end;
                  justify-content: space-between;
                  .now-price-wraper {
                    display: flex;
                    align-items: flex-end;
                    .rmb-icon {
                      line-height: 34rpx;
                      font-size: 20rpx;
                      font-weight: 400;
                      color: #FF4242;
                    }
                    .now-price {
                      font-size: 28rpx;
                      font-weight: 400;
                      color: #FF4242;
                    }
                  }
                  .old-price-wraper {
                    margin-left: 10rpx;
                    display: flex;
                    align-items: flex-end;
                    .old-price {
                      line-height: 34rpx;
                      text-decoration: line-through;
                      font-size: 20rpx;
                      font-weight: 400;
                      color: #999999;
                    }
                  }
                }
                //goods-price
              }
            }
          }

        }
      }
    }
  }
}
</style>