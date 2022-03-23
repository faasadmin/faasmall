<template>
  <view class="main-wrapper">
    <!-- 空白页 -->
    <!-- #ifdef APP-PLUS -->
    <u-no-network @retry="init"></u-no-network>
    <!-- #endif -->
    <view v-if="isConnected" class="fixed-container" :style="'background:'+ (categoryCurrent>0?'#EE1B14':(scrollTop>30?'#EE1B14;':bannerColor) +';')">
      <view class="search-container">
        <view class="search" @tap="$Router.push({ path: '/pages/common/good/list', query: { search: '' } })">
          <view class="p-2">
            <view class="iconfont icon-search"></view>
          </view>
          <view class="search-tip">
            <view>输入商品名或粘贴宝贝标题搜索</view>
          </view>
        </view>
      </view>
      <view class="category-navbar-container">
        <scroll-view class="category-scroll" scroll-x scroll-with-animation @scroll="rowScroll" :scroll-into-view="nowcurrentid" :scroll-left="scrollleftnum">
          <block v-for="(items,index) in categoryList" :key='index'>
            <view class="category-container">
              <view class="category-items" @click="cateChange(index)" :id="categoryCurrent==index?'category-items-active':''" :class="categoryCurrent==index?'category-items-active':''">
                <view class="category-name">
                  {{items.name}}
                </view>
                <view class="bottom-border"></view>
              </view>
            </view>
          </block>
        </scroll-view>
        <view class="category-icon-box" @click="showCateGoryModel()">
          <view class="iconfont icon-fenlei1"></view>
        </view>
      </view>
    </view>
    <!-- 弹框 -->
    <view class="category-model-wrapper" @touchmove.prevent>
      <view class="shadow" :class="categoryModel?'show-shadow':''" @click="closeModel()"></view>
      <view class="category-content" :style="'top:'+topHeight+'px'" :class="categoryModel?'show-category':''">
        <view class="category-list-box" v-if="categoryModel">
          <view class="category-name-bar">
            <view>选择分类</view>
          </view>
          <view class="list-container">
            <block v-for="(items,index) in categoryList" :key='index'>
              <view class="cate-items"  v-if="index!=0" @click="changeCurrent(index,items.cid)">
                <view class="img-box">
                  <image :src="items.img" mode="aspectFill" :lazy-load="true"></image>
                </view>
                <view class="category-name">
                  {{items.name}}
                </view>
              </view>
            </block>
          </view>
        </view>
      </view>
    </view>
    <view class="body-container">
      <swiper class="page-swiper" :disable-touch='canswiper' duration="200" :current='categoryCurrent' @change='changeCatepage' @transition='swiperTransition' @animationfinish='stopSwiper'>
        <swiper-item v-for="(items,index) in categoryList" :key='index' :current-item-id='items.cid'>
          <view v-if='index===0'>
            <index ref='indexPage' :refresher='refresher' :fixedClass='fixedClass' @scrolltoTop='scrollToTop' @scrolltoview='scrollToView'
                       @pushfixed='getFixed' @scrollNum='getScroll' :topHeight='topHeight' @passColor='getColor'></index>
          </view>
          <view v-else>
            <category v-if="index===categoryCurrent+1 || index===categoryCurrent-1 || index===categoryCurrent" :parentId='items.id'
                          :topHeight='topHeight' :refresher='refresher' :loadFlag='index===categoryCurrent'>
            </category>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import index from './swiper';
import category from './swiper/category.vue';
import {getLevelCategroy} from "@/faasmall/api/category";
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import jwt from '@/faasmall/utils/cache/jwt.js';
import {http} from "@/faasmall/utils/request/service";
import setting from "@/faasmall/common/config";
export default {
  components: {
    index,
    category
  },
  data() {
    return {
      isConnected: true, //是否有网
      isRefresh: true,
      shareShow: false,
      bannerColor: '',
      categoryModel: false,
      topHeight: 0,
      categoryCurrent: 0,
      current: 1,
      scrollTop: 0,
      fixedClass: false,
      refresher:true,
      categoryList: [],
      canswiper:false,
      scrollleftnum:0,
      rowLeft:0,
      nowcurrentid:''
    }
  },
  onLoad() {
    this.init();
  },
  onShow() {
    var that = this;
    jwt.isLogin() && this.getCartList();
    // 网络变化检测
    uni.onNetworkStatusChange(res => {
      that.isConnected = res.isConnected;
      res.isConnected && that.init();
    });
  },
  onReady() {
    this.getTopHeight()
  },
  watch: {},
  computed: {
    ...mapGetters(['shopData']),
  },
  methods: {
    ...mapActions(['faasmallInit', 'getCartList']),
    onPullDownRefresh() {
      //this.init();
    },
    //初始化数据
    init(){
      if(this.categoryList){
        this.getCategoryList();
      }
    },
    rowScroll(e){
      console.log(e);
      this.rowLeft = e.scrollLeft
    },
    currentScroll(left){
      this.nowcurrentid = ''
      this.scrollleftnum = this.rowLeft
      this.$nextTick(()=>{
        this.nowcurrentid = 'category-items-active'
      })
    },
    getCategoryList() {
      getLevelCategroy({level:1}).then((res)=>{
        var obj = {}
        obj.name = '推荐';
        this.categoryList = res.data;
        this.categoryList.unshift(obj);
      }).catch(error=>{
         console.error(error);
      })
    },
    // 页面样式处理
    getColor(color) {
      this.bannerColor = color;
    },
    getFixed(e) {
      this.fixedHeight = e
    },
    changeCurrent(idx, cid) {
      this.categoryCurrent = idx
      this.refresher = true
      this.closeModel()
    },
    scrollToView() {
      this.scrollindex = this.scrollTop
      this.$nextTick(() => {
        this.scrollindex = this.fixedHeight - (this.topHeight)
      });
    },
    scrollToTop() {
      this.scrollindex = 0
    },
    scrollMorePage() {
      if (this.categoryCurrent == 0) {
        this.$refs.indexPage[0].getNextPage()
      }
    },
    swiperTransition(){
      this.refresher = false
    },
    stopSwiper(){
      this.refresher = true
    },
    // 路由跳转
    goPath(url) {
      if (url == 'search') {
        uni.navigateTo({
          url: '../search/search'
        })
      } else if (url == 'officialNotice') {
        uni.navigateTo({
          url: './officialNotice'
        })
      }
    },
    showCateGoryModel() {
      this.categoryModel = !this.categoryModel
    },
    closeModel() {
      this.categoryModel = false
    },
    changeCatepage(e) {
      // 滑动切换
      console.log(e);
      this.bannerColor = '#EE1B14'
      this.categoryCurrent = e.detail.current
      this.currentScroll()
    },
    cateChange(idx) {
      // 分类点击
      this.closeModel()
      this.categoryCurrent = idx
    },
    getTopHeight() {
      // 获取顶部高度
      uni.createSelectorQuery().in(this).select('.fixed-container').boundingClientRect(data => {
        console.log("得到布局位置信息" + JSON.stringify(data));
        this.topHeight = data.height
      }).exec();
    },
    goDetail(info) {
      console.log(info);
      uni.navigateTo({
        url: '../goods/goodsDetail?info=' + encodeURIComponent(JSON.stringify(info))
      })
    },
    getScroll(e) {
      this.scrollTop = e
    },
  }
}
</script>

<style lang="scss">

.main-wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .body-container {
    width: 100%;
    .page-swiper {
      width: 100%;
      overflow: hidden;
      height: 100vh;
      .swiper-scroll {
        width: 100%;
        overflow: hidden;
        height: 100vh;
      }
    }
  }
  .fixed-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0 32rpx;
    z-index: 600;
    background-color: #EE1B14;
    .search-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      width: 100%;
      height: 100rpx;
      z-index: 100;
      .search {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 70rpx;
        background-color: #FFFFFF;
        border: 1rpx solid #EDEDED;
        border-radius: 35rpx;
        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28rpx;
          height: 28rpx;
          margin-left: 20rpx;
          font-size: 30rpx;
          font-weight: 400;
          color: #999999;
        }
        .search-tip {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          font-weight: 400;
          color: #999999;
          margin-left: 18rpx;
        }
      }
    }

    .category-navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 80rpx;

      .category-scroll {
        width: 640rpx;
        height: 60rpx;
        white-space: nowrap;
        display: flex;
        .category-container {
          display: inline-block;
          .category-items {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-right: 30rpx;
            .category-name {
              font-size: 28rpx;
              font-weight: 400;
              color: #FFFFFF;
            }
            .bottom-border {
              display: none;
              background-color: #FFFFFF;
              width: 65rpx;
              height: 4rpx;
              border-radius: 1rpx;
              margin-top: 5rpx;
            }
          }

          .category-items-active {
            .categoryname {
              font-size: 32rpx;
              font-weight: 400;
              color: #FFFFFF;
            }

            .bottom-border {
              display: block;
            }
          }
        }
      }

      .category-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32rpx;
        height: 32rpx;
        color: #FFFFFF;
        font-size: 32rpx;
        margin-bottom: 10rpx;
      }
    }
  }

  .category-model-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    .shadow {
      display: none;
    }
    .show-shadow {
      width: 100%;
      height: 100vh;
      display: block;
      background: rgba(0, 0, 0, 0.3);
    }

    .category-content {
      width: 100%;
      background-color: #FFFFFF;
      border-bottom-left-radius: 24rpx;
      border-bottom-right-radius: 24rpx;
      z-index: 600;
      position: absolute;
      max-height: 0vh;
      .category-list-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        .category-name-bar {
          display: flex;
          align-items: center;
          width: 100%;
          height: 60rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: #333333;
          padding: 0 32rpx;
        }

        .list-container {
          width: 100%;
          margin-top: 30rpx;
          padding: 0 5rpx;
          flex-wrap: wrap;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .cate-items {
            width: 185rpx;
            margin-bottom: 40rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            .img-box {
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
            .category-name {
              font-size: 24rpx;
              font-weight: 400;
              color: #333333;
              margin-top: 20rpx;
            }
          }
        }
      }
    }

    .show-category {
      transition: all 0.5s;
      max-height: 100vh;
    }
  }
}
</style>
