<template>
  <view>
    <scroll-view class="swiper-scroll" :refresher-background='headerColor' @scroll='pagescroll' scroll-y="true"
                 :scroll-top='scrollIndex' :scroll-anchoring='true' scroll-with-animation lower-threshold='500' @scrolltolower="getNextPage"
                 :refresher-threshold='75' :refresher-triggered='triggeredstate' :refresher-enabled='freshStatus && refresher'
                 @refresherrefresh='refresh' @refresherrestore="onRestore" refresher-default-style='none' :bounce='false'
                 @refresherpulling="pulling">
      <view class="body-wrapper">
        <view class="head-container">
          <view class="ellipse" :style="'background:'+ headerColor +';'"></view>
        </view>
        <view class="loading-img" :style="'margin-top:'+(topHeight-77)+'px;'">
          <view class="img-box">
            <image src="/static/img/home/loading.gif" mode="aspectFill"></image>
          </view>
        </view>
        <view class="top-body-container">
          <view class="column-container">
            <view class="banner-container" v-if="topBannerList.length>0">
              <swiper class="swiper-box" :current="swpidx" @change="changeColor" :autoplay="true" :interval="3000" :duration="500" :indicator-dots="true" :indicator-active-color="'#fff'" circular>
                <swiper-item v-for="(items,index) in topBannerList" :key='index'>
                  <view class="swiper-item" @click="toPage(items)">
                    <image :src="items.imgUrl" mode="aspectFit"></image>
                  </view>
                </swiper-item>
              </swiper>
            </view>

            <!-- 一行一个banner -->
            <view class="single-banner-container" v-if="singleLineList.length>0">
              <swiper class="swiper-box" :autoplay="true" :interval="5000" :duration="300" circular>
                <swiper-item v-for="(items,index) in singleLineList" :key='index'>
                  <view class="single-banner-item" @click="toPage(items)">
                    <image :src="items.imgUrl" mode="aspectFit"></image>
                  </view>
                </swiper-item>
              </swiper>
            </view>
            <!-- 一行多个banner -->
            <view class="double-banner-container" v-if="doubleLineList.length>0">
              <block v-for="(items,index) in doubleLineList" :key='index'>
                <view class="double-banner-item" @click="toPage(items)">
                  <image :src="items.imgUrl" mode="aspectFill" lazy-load="true"></image>
                </view>
              </block>
            </view>
            <!-- 金刚区 -->
            <view class="jk-container" v-if="navbarShowList.length > 0">
              <swiper class="swiper-type" :indicator-dots="navbarList.length > 10 ? true : false" indicator-color="#eaeaea"
                      indicator-active-color="#FE3A33" :duration="500" :style="sliderH">
                <swiper-item v-for="(sliderItem, index) in navbarShowList" :key="index">
                  <view class="jk-list">
                    <view class="jk-list-item" v-for="(item, idx) in sliderItem" :key="idx" @click="toPage(item)">
                      <image :src="item.imgUrl" :lazy-load="true" mode="aspectFit"></image>
                      <view class="desc">{{ item.name }}</view>
                    </view>
                  </view>
                </swiper-item>
              </swiper>
            </view>
          </view>
        </view>
        <view class="bottom-body-container">
          <view class="swiper-container" v-if="bottomBannerList.length>0">
            <swiper class="swiper-box" :autoplay="true" :interval="3000" :duration="300" circular>
              <swiper-item v-for="(items,index) in bottomBannerList" :key='index'>
                <view class="swiper-item" @click="toPage(items)">
                  <image :src="items.imgUrl" mode="widthFix"></image>
                </view>
              </swiper-item>
            </swiper>
          </view>
          <!-- 新品推荐 -->
          <view class="new-product-container" v-if="latestList.length>0">
            <view class="title-text">
              新品推荐
            </view>
            <view class="scroll-container">
              <scroll-view class="scroll-goods-box" scroll-x scroll-with-animation>
                <view class="scroll-goods-content">
                  <view class="goods-items" v-for="(items,index) in latestList" :key="index" @tap="toGood(items)">
                    <view class="items-container">
                      <view class="image-content">
                        <image :src="items.thumbnail" mode="aspectFill" :lazy-load="true"></image>
                      </view>
                      <view class="good-box">
                        <view class="good-name-box">
                          {{items.name}}
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
              </scroll-view>
            </view>
          </view>
          <!-- 热销榜单 -->
          <view class="sell-well-container">
            <view class="head-title-container">
              <view class="head-icon-box">
                <image src="@/static/img/home/top.png" mode=""></image>
              </view>
              <view class="head-title-box">
                热销榜单
              </view>
            </view>
            <view class="sell-well-good-wraper">
              <scroll-view class="scroll-good-box" scroll-x scroll-with-animation>
                <view class="scroll-good-content">
                  <view class="goods-items" v-for="(items,index) in randomList" :key='index'>
                    <view class="items-container" @tap="toGood(items)">
                      <view class="image-content">
                        <image :src="items.thumbnail" mode="aspectFill"></image>
                      </view>
                      <view class="goods-info-content">
                        <view class="goods-name-box">
                          {{items.name}}
                        </view>
<!--                        <view class="coupons-container">
                          <view class="coupons-content">
                            <view class="coupons-value">
                              {{items.couponPrice}}元券
                            </view>
                          </view>
                        </view>-->
                        <view class="goods-price-container">
                          <view class="now-price-content">
                            <view class="rmb-icon">
                              ￥
                            </view>
                            <view class="now-price">
                              {{items.sellingPrice}}
                            </view>
                          </view>
                          <view class="old-price-content">
                            <view class="old-price">
                              ￥{{items.linePrice}}
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </scroll-view>

              <view class="more-favorite-good">
                <view>
                  更多好物~
                </view>
              </view>
            </view>
          </view>
        </view>


        <view class="like-good-container">
          <!-- 猜你喜欢 -->
          <view>
            猜你喜欢
          </view>
          <view class="like-good-wraper" v-if="bottomGoodsList.length>0">
            <block v-for="(items,index) in bottomGoodsList" :key="index">
              <view class="goods-items-cards" @tap="toGood(items)">
                <view class="goods-pic-container">
                  <image :src="items.thumbnail" mode="aspectFill"></image>
                </view>
                <view class="goods-info-container">
                  <view class="trade-name-container">
                    <view class="trade-name">
                      {{items.name}}
                    </view>
                  </view>
                  <view class="goods-sales-container">
                    <view class="left-price-box">
                      <span class='rmb'>￥</span>
                      <span class='price'>{{items.sellingPrice || 0}}</span>
                    </view>
                    <view class="right-price-box">
                      已售{{items.sales}}
                    </view>
                  </view>

                </view>
              </view>
            </block>
          </view>
          <u-loadmore :status="loadStatus" :icon-type="iconType"
                      :loading-text="loadingText"
                      :loadmore-text="loadmoreText"
                      :nomore-text="nomoreText" />
        </view>
      </view>
    </scroll-view>
    <faasmall-slide-top v-if="scrollTop>1000" @toTop='scrollToTop'></faasmall-slide-top>
  </view>
</template>

<script>
import {getCategoryList} from "@/faasmall/api/category";
import {getBannerList} from "@/faasmall/api/banner";
import {getGoodRandom, getGoodLatest, getGoodPage} from "@/faasmall/api/good";
import {getNavitageList} from "@/faasmall/api/navigate";
export default {
  props: {
    topHeight: {
      type: Number,
      default: 90
    },
    refresher: {
      type: Boolean
    },
    fixedClass: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data() {
    return {
      loadStatus: 'loadmore',
      iconType: 'flower',
      loadingText: '努力加载中',
      loadmoreText: '轻轻上拉',
      nomoreText: '实在没有了',
      pageHeight: '',
      headerColor: '#FF0505',
      topBannerList: [],
      singleLineList: [],
      doubleLineList: [],
      bottomBannerList: [],
      navbarShowList: [],
      navbarList: [],
      sliderH: '',
      scrollTop: 0,
      scrollIndex: 0,
      latestList:[],
      randomList:[],
      bottomCurrent: 1,
      bottomGoodsList: [],
      currentPage: 1,
      triggeredstate: true,
      swpidx: 0,
      freshStatus: true,
    }
  },
  watch: {
    navbarList(nval, oval) {
      let index = 0;
      while (index < nval.length) {
        this.navbarShowList.push(nval.slice(index, (index += 10)));
      }

      if (this.navbarList.length > 5) {
        this.sliderH = 'height:345rpx;';
      } else {
        this.sliderH = 'height:160rpx;';
      }
    },
    headerColor: {
      handler(nvl, ovl) {
        this.$emit('passColor', nvl)
      },
      immediate: true
    }
  },
  created() {
    this._freshing = false;
    uni.$emit('initpage')
    this.getBannerInfo();
    this.getHomeMenuList();
    this.getGoodsRandom();
    this.getGoodsLatest();
    this.getGuessYouLikeGoodsList();
  },
  mounted() {
    this.$emit('scrolltoTop')
    this.fixedClass = false;
    setTimeout(() => {
      this.getFixedHeight()
    }, 1500)
  },
  methods: {
    pulling(e) {},
    refresh(e) {
      this.triggeredstate = true
      if (this._freshing) return;
      this._freshing = true;
      this.getBannerInfo();
      this.getGoodsRandom();
      this.getGoodsLatest();
      setTimeout(()=>{
        this.triggeredstate = false;
        this._freshing = false;
      },8000)
    },
    onRestore() {
      this.swpidx = 0
      console.log('下拉被终止');
    },
    pagescroll(e) {
      this.$emit('scrollNum', e.detail.scrollTop)
      this.scrollTop = e.detail.scrollTop
      if (!e.detail.scrollTop > 0) {
        setTimeout(() => {
          this.freshStatus = true
        })
      } else {
        // this.freshStatus = false
      }
    },
    scrollToTop() {
      this.scrollIndex = this.scrollTop
      this.$nextTick(() => {
        this.scrollIndex = 0
      })
    },
    onAbort() {
      console.log('refushstop');
    },
    getBannerInfo() {
      // banner数据
      getBannerList().then((res)=>{
        if(this.$isNotEmpty(res.data)){
          this.topBannerList = res.data;
          this.headerColor = res.data[0].color;
          setTimeout(() => {
            this.triggeredstate = false;
            this._freshing = false;
          }, 300)
        }
      }).catch(error=>{
        console.error(error)
      })
    },
    getHomeMenuList() {
      // 金刚区
      getNavitageList().then((res)=>{
        this.navbarList = res.data;
      }).catch(error=>{
        console.error(error);
      })
    },
    getGoodsRandom() {
      getGoodRandom().then((res)=>{
        this.randomList = res.data;
      }).catch(error=>{
        console.error(error);
      })
    },
    getGoodsLatest(){
      getGoodLatest().then((res)=>{
        this.latestList = res.data;
      }).catch(error=>{
        console.error(error);
      })
    },
    getGuessYouLikeGoodsList() {
      var that = this;
      getGoodPage({pageNo:1,pageSize:10}).then((res)=>{
        if (res.data.list.length < 10) {
          this.loadingState = false
          this.loadStatus = 'nomore'
        } else {
          this.currentPage++
          this.loadStatus = 'loading'
          this.loadingState = true
        }
        that.bottomGoodsList = res.data.list;
      }).catch(error=>{
        console.error(error)
      })
    },
    getNextPage() {
      var that = this;
      if (this.loadingState) {
        this.loadingState = false
        getGoodPage({pageNo:this.currentPage,pageSize:10}).then((res)=>{
          if (res.data.list.length < 10) {
            this.loadingState = false
            this.loadStatus = 'nomore'
          } else {
            this.currentPage++
            this.loadStatus = 'loading'
            this.loadingState = true
          }
          that.bottomGoodsList = that.bottomGoodsList.concat(res.data.list)
        }).catch(error=>{
          console.error(error)
        })
      }
    },
    getFixedHeight(e) {
      uni.createSelectorQuery().in(this).select('.like-good-container').boundingClientRect(data => {
        this.$emit('pushfixed', data.top)
      }).exec();
    },
    changeColor(e) {
      this.swpidx = e.detail.current
      this.topBannerList.forEach((itm, idx) => {
        if (idx === e.detail.current) {
          this.headerColor = itm.color
        }
      })
    },
    toPage(info) {
      debugger
      if (info.type === "0") {
        //this.$routerTo(info.url,false);
        this.$router.push({ path: info.jumpUrl });
      } else if (info.type === "1") {
        uni.navigateTo({
          url: '../webView/webView?url=' + info.jumpUrl
        })
      }
    },
    toGood(info) {
      uni.navigateTo({
        url: 'pages/common/good/info?id=' + info.id
      })
    },
  }
}
</script>
<style lang="scss">
.swiper-scroll{
  width: 100%;
  height: 100vh;
  .body-wrapper {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    .head-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 380rpx;
      position: absolute;
      box-sizing: border-box;
      .ellipse {
        width: 130%;
        height: 100%;
        border-radius: 0 0 50% 50%;
      }
    }
    .loading-img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 150rpx;
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
    .top-body-container {
      width: 100%;
      background-color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .column-container {
        width: 100%;
        z-index: 10;
        .banner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: 100%;
          height: 280rpx;
          padding: 0 32rpx;
          margin-bottom: 20rpx;
          /deep/.swiper-box {
            width: 100%;
            height: 100%;
            .swiper-item {
              width: 100%;
              height: 100%;
              border-radius: 12rpx;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              image {
                width: 100%;
                height: 100%;
              }
            }
            .uni-swiper-dot {
              width: 20rpx;
              height: 6rpx;
              border-radius: 3rpx;
            }
          }
        }
        .single-banner-container {
          width: 100%;
          height: 190rpx;
          padding: 0 32rpx;
          margin-bottom: 20rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          .swiper-box {
            width: 100%;
            height: 100%;
            .single-banner-item {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              image {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .double-banner-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          flex-wrap: wrap;
          padding: 0 32rpx;
          margin-bottom: 20rpx;
          box-sizing: border-box;
          .double-banner-item {
            width: 340rpx;
            height: 135rpx;
            overflow: hidden;
            border-radius: 8rpx;
            margin-bottom: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 100%;
              height: 100%;
            }
          }
        }
        /deep/.jk-container {
          width: 100%;
          .swiper-type {
            width: 100%;
            .jk-list {
              width: 100%;
              flex-wrap: wrap;
              display: flex;
              align-items: flex-start;
              .jk-list-item {
                width: 150rpx;
                margin-bottom: 30rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                image {
                  width: 80rpx;
                  height: 80rpx;
                  margin-bottom: 10rpx;
                }
                .desc {
                  font-size: 28rpx;
                  font-weight: 400;
                  color: #333333;
                }
              }
            }
          }
          .uni-swiper-dot {
            width: 20rpx;
            height: 6rpx;
            border-radius: none;
          }
        }
      }
    }
    .bottom-body-container {
      width: 100%;
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .swiper-container {
        box-sizing: border-box;
        width: 100%;
        height: 260rpx;
        padding: 0 32rpx;
        background-color: #FFFFFF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .swiper-box {
          width: 100%;
          height: 100%;
          .swiper-item {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .new-product-container {
        width: 100%;
        background-color: #FFFFFF;
        border-radius: 12rpx;
        padding: 0 32rpx;
        margin-bottom: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title-text {
          width: 100%;
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          margin: 20rpx 0;
        }
        .scroll-container {
          width: 100%;
          height: 340rpx;
          display: flex;
          align-items: center;
          .scroll-goods-box {
            width: 100%;
            height: 100%;
            .scroll-goods-content {
              white-space: nowrap;
              .goods-items {
                display: inline-block;
                width: 220rpx;
                height: 340rpx;
                border-radius: 8rpx;
                overflow: hidden;
                .items-container {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  .image-content {
                    width: 200rpx;
                    height: 200rpx;
                    border-radius: 8rpx;
                    overflow: hidden;
                    margin-top: 10rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    image {
                      width: 100%;
                      height: 100%;
                    }
                  }
                  .good-box {
                    width: 100%;
                    height: 120rpx;
                    padding: 0 10rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                    .good-name-box {
                      width: 100%;
                      line-height: 34rpx;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      font-size: 24rpx;
                      font-weight: 400;
                      color: #444444;
                      margin-top: 5rpx;
                    }
                    .coupons-container {
                      width: 100%;
                      margin-top: 10rpx;
                      .couponbac-content {
                        width: 160rpx;
                        height: 30rpx;
                        //background: url(../static/images/goods/quanbg.png) no-repeat;
                        background-size: 100% 100%;
                        border-radius: 5rpx;
                        .coupons-value {
                          font-size: 20rpx;
                          font-weight: 500;
                          color: #FF4242;
                          white-space: nowrap;
                          margin-left: 30rpx;
                        }
                      }
                    }
                    .good-price-container {
                      width: 100%;
                      display: flex;
                      align-items: flex-end;
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
                  }
                }
              }
            }
          }
        }
      }
      //热销榜单
      .sell-well-container {
        width: 100%;
        height: 600rpx;
        background: linear-gradient(-90deg, #FF0505, #E01230);
        padding: 0 22rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        .head-title-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .head-icon-box {
            width: 500rpx;
            height: 53rpx;
            margin-top: 20rpx;
            margin-bottom: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .head-title-box {
            font-size: 32rpx;
            font-weight: bold;
            font-style: italic;
            color: #FFFFFF;
            margin-bottom: 25rpx;
          }
        }
        .sell-well-good-wraper {
          width: 100%;
          background: #F7F7F7;
          display: flex;
          flex-direction: column;
          align-items: center;
          .scroll-good-box {
            width: 100%;
            margin-top: 20rpx;
            .scroll-good-content {
              padding-left: 10rpx;
              white-space: nowrap;
              .goods-items {
                width: 220rpx;
                margin-right: 10rpx;
                border-radius: 8rpx;
                display: inline-block;
                overflow: hidden;
                background-color: #FFFFFF;
                .items-container {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  .image-content {
                    width: 220rpx;
                    height: 220rpx;
                    margin-top: 10rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    image {
                      width: 100%;
                      height: 100%;
                    }
                  }

                  .goods-info-content {
                    width: 100%;
                    padding: 0 10rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                    .goods-name-box {
                      width: 100%;
                      line-height: 34rpx;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      font-size: 24rpx;
                      font-weight: 400;
                      color: #444444;
                      margin-top: 5rpx;
                    }

                    .coupons-container {
                      width: 100%;
                      margin-top: 10rpx;
                      display: flex;
                      align-items: center;
                      .coupons-content {
                        width: 100rpx;
                        height: 30rpx;
                        //background: url(../static/images/goods/couponbac.png)no-repeat;
                        background-size: 100% 100%;
                        border-radius: 5rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .coupons-value {
                          font-size: 20rpx;
                          font-weight: 500;
                          color: #FF4242;
                          white-space: nowrap;
                        }
                      }
                    }

                    .goods-price-container {
                      width: 100%;
                      display: flex;
                      align-items: flex-end;
                      .now-price-content {
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
                      .old-price-content {
                        display: flex;
                        align-items: flex-end;
                        margin-left: 10rpx;
                        .old-price {
                          line-height: 34rpx;
                          text-decoration: line-through;
                          font-size: 20rpx;
                          font-weight: 400;
                          color: #999999;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          .more-favorite-good {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 60rpx;
            font-size: 24rpx;
            font-weight: 400;
            color: #999999;
          }
        }
      }

      .Tiktok-container {
        width: 100%;
        height: 475rpx;
        padding: 0 32rpx;
        background-color: #FFFFFF;

        .titlebar-container {
          width: 100%;
          height: 90rpx;

          .left-content {
            .titletext {
              font-size: 32rpx;
              font-weight: 500;
              color: #333333;
            }

            .bubble-box {
              width: 200rpx;
              height: 25rpx;
              margin-left: 5rpx;
              background: linear-gradient(-90deg, #7619EC, #A429F3);
              border-radius: 12rpx 12rpx 12rpx 0px;
              font-size: 20rpx;
              font-weight: 400;
              color: #FFFFFF;
            }
          }

          .right-arrowContent {
            font-size: 24rpx;
            font-weight: 400;
            color: #999999;
          }
        }

        .goodsTopList {
          width: 100%;
          height: 340rpx;

          .scrollgoods-box {
            width: 100%;
            height: 340rpx;

            .scrollList-content {
              height: 360rpx;
              white-space: nowrap;

              .goods-items {
                width: 220rpx;
                height: 340rpx;
                border-radius: 8rpx;
                margin-right: 10rpx;
                overflow: hidden;
                background-color: #FFFFFF;
                display: inline-block;

                .items-container {
                  width: 100%;
                  height: 100%;

                  .image-content {
                    width: 220rpx;
                    height: 220rpx;
                    position: relative;

                    .playback-volume {
                      position: absolute;
                      z-index: 1;
                      top: 14rpx;
                      left: 14rpx;
                      background: rgba(0, 0, 0, 0.5);
                      padding: 5rpx 15rpx;
                      border-radius: 15rpx;
                      font-size: 20rpx;
                      font-weight: 500;
                      color: #FFFFFF;

                      span {
                        font-size: 28rpx;
                      }
                    }

                    .suspend {
                      position: absolute;
                      top: 90;
                      left: 90;
                      width: 40rpx;
                      height: 40rpx;
                    }
                  }

                  .goodsinfo-content {
                    width: 100%;
                    height: 120rpx;

                    .goodsName-box {
                      width: 100%;
                      line-height: 34rpx;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      font-size: 24rpx;
                      font-weight: 400;
                      color: #444444;
                      margin-top: 5rpx;
                    }

                    .coupons-container {
                      width: 100%;
                      margin-top: 10rpx;
                      .couponbac-content {
                        width: 100rpx;
                        height: 30rpx;
                        background-size: 100% 100%;
                        .coupons-value {
                          font-size: 20rpx;
                          font-weight: 500;
                          color: #FF4242;
                          white-space: nowrap;
                        }
                      }
                    }

                    .price-info-container {
                      width: 100%;

                      .nowPrice-content {
                        .rmbicon {
                          line-height: 34rpx;
                          font-size: 20rpx;
                          font-weight: 400;
                          color: #FF4242;
                        }

                        .nowprice {
                          font-size: 28rpx;
                          font-weight: 400;
                          color: #FF4242;
                        }
                      }

                      .oldPrice-content {
                        margin-left: 10rpx;

                        .oldprice {
                          line-height: 34rpx;
                          text-decoration: line-through;
                          font-size: 20rpx;
                          font-weight: 400;
                          color: #999999;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .like-good-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .like-good-wraper {
        margin-top: 20rpx;
        width: 100%;
        padding: 0 32rpx;
        flex-wrap: wrap;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .goods-items-cards {
          width: 335rpx;
          //height: 490rpx;
          background-color: #FFFFFF;
          padding: 10rpx;
          margin-bottom: 20rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          .goods-pic-container {
            width: 310rpx;
            height: 310rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .goods-info-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .trade-name-container {
              width: 100%;
              margin-top: 10rpx;
              display: flex;
              align-items: flex-start;
              .trade-name {
                width: 240rpx;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 28rpx;
                font-weight: 400;
                color: #333333;
              }
            }
            .goods-sales-container {
              width: 100%;
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              .left-price-box {
                display: flex;
                align-items: flex-end;
                .rmb {
                  font-size: 20rpx;
                  font-weight: 600;
                  color: #FF4242;
                  line-height: 32rpx;
                }
                .price {
                  font-size: 28rpx;
                  line-height: 34rpx;
                  font-weight: 600;
                  color: #FF4242;
                }
              }
              .right-price-box {
                font-size: 20rpx;
                font-weight: 400;
                color: #999999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
