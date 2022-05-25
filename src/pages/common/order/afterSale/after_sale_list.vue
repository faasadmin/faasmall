<!--售后订单-->
<template>
    <view>
      <view class="wrap">
        <u-toast ref="uToast"></u-toast>
        <view class="u-tabs-box">
          <u-tabs-swiper active-color="#FF0505" ref="uTabs" :list="tabList" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        </view>
        <swiper class="swiper-box" :current="tabCurrentIndex" @change="changeSwiper">
          <swiper-item class="swiper-item">
            <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreOrder">
              <view class="page-box">
                <view class="order" v-for="(res, index) in tabData[0].orderList" :key="res.id" @click="$Router.push({path: '/pages/common/order/afterSale/after_sale_info',query: {afterOrderId:res.id,orderSn: res.order.orderSn,isTask:res.order.type === 3 ?1:0}})">
                  <view class="top">
                    <view class="left">
                      <view class="store">{{res.typeName}}</view>
                    </view>
                    <view class="right">{{res.statusName }}</view>
                  </view>
                  <view class="item" v-for="(item, index) in res.orderGoodList" :key="index">
                    <view class="left"><image :src="item.goodThumbnail" mode="aspectFill"></image></view>
                    <view class="content">
                      <view class="title u-line-2">{{ item.goodName }}</view>
                      <view class="type">{{item.showStandardParam}}</view>
                    </view>
                    <view class="right">
                      <view class="price">
                        ￥{{item.goodSellingPrice}}
                      </view>
                      <view class="number">x {{item.goodQuantity}}</view>
                    </view>
                  </view>
                  <view class="bottom">
                    <view class="evaluate btn" v-if="item.status >= 10" @click.stop="setClose(item)">删除记录</view>
                    <view @click.stop="$Router.push({path: '/pages/common/order/alter_sale_return',query: {id: item.id,mobile:item.refundAddress.mobile}})" class="evaluate btn" v-if="item.status === 5 || item.status === 7">填写退货信息</view>
                  </view>
                </view>
                <!-- 空白页 -->
                <u-empty v-if="tabData[0].empty === true && tabData[0].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                <u-loadmore :status="tabData[0].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
              </view>
            </scroll-view>
          </swiper-item>
          <swiper-item class="swiper-item">
            <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreOrder">
              <view class="page-box">
                <view class="order" v-for="(res, index) in tabData[1].orderList" :key="res.id">
                  <view class="top">
                    <view class="left">
                      <view class="store">{{res.typeName}}</view>
                    </view>
                    <view class="right">{{ res.statusName }}</view>
                  </view>
                  <view class="item" v-for="(item, index) in res.orderGoodList" :key="index">
                    <view class="left"><image :src="item.goodThumbnail" mode="aspectFill"></image></view>
                    <view class="content">
                      <view class="title u-line-2">{{ item.goodName }}</view>
                      <view class="type">{{item.standardParam}}</view>
                    </view>
                    <view class="right">
                      <view class="price">
                        ￥{{item.goodSellingPrice}}
                      </view>
                      <view class="number">x {{item.goodQuantity}}</view>
                    </view>
                  </view>
                  <view class="bottom">
                    <view class="evaluate btn" v-if="item.status >= 10" @click.stop="setClose(item)">删除记录</view>
                    <view @click.stop="$Router.push({path: '/pages/common/order/alter_sale_return',query: {id: item.id,mobile:item.refundAddress.mobile}})" class="evaluate btn" v-if="item.status === 5 || item.status === 7">填写退货信息</view>
                  </view>
                </view>
                <u-empty v-if="tabData[1].empty === true && tabData[1].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                <u-loadmore :status="tabData[1].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
              </view>
            </scroll-view>
          </swiper-item>
          <swiper-item class="swiper-item">
            <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreOrder">
              <view class="page-box">
                <view class="order" v-for="(res, index) in tabData[2].orderList" :key="res.id">
                  <view class="top">
                    <view class="left">
                      <view class="store">{{res.typeName}}</view>
                    </view>
                    <view class="right">{{ res.statusName }}</view>
                  </view>
                  <view class="item" v-for="(item, index) in res.orderGoodList" :key="index">
                    <view class="left"><image :src="item.goodThumbnail" mode="aspectFill"></image></view>
                    <view class="content">
                      <view class="title u-line-2">{{ item.goodName }}</view>
                      <view class="type">{{item.standardParam}}</view>
                    </view>
                    <view class="right">
                      <view class="price">
                        ￥{{item.goodSellingPrice}}
                      </view>
                      <view class="number">x {{item.goodQuantity}}</view>
                    </view>
                  </view>
                  <view class="bottom">
                    <view class="evaluate btn" v-if="item.status >= 10" @click.stop="setClose(item)">删除记录</view>
                    <view @click.stop="$Router.push({path: '/pages/common/order/alter_sale_return',query: {id: item.id,mobile:item.refundAddress.mobile}})" class="evaluate btn" v-if="item.status === 5 || item.status === 7">填写退货信息</view>
                  </view>
                </view>
                <u-empty v-if="tabData[2].empty === true && tabData[2].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                <u-loadmore :status="tabData[2].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
        <u-popup v-model="isDel" mode="bottom" :closeable="true" close-icon-pos="top-right">
          <view class=" server-modal">
            <view class="server-modal-box page_box">
              <view class="modal-head u-flex u-row-center u-col-center"><text class="head-title">确认要删除这条售后记录</text></view>
              <view class="modal-content content_box">

              </view>
              <view class="modal-foot u-flex u-row-center u-col-center">
                <button class=" u-reset-button serve-btn" @tap="deleteConfirm">确定</button>
              </view>
            </view>
          </view>
        </u-popup>
      </view>
    </view>
</template>

<script>
import {getOrderAfterPage, orderAfterDelete} from "@/faasmall/api/order";
export default {
  name: "after_sale",
  data(){
    return{
      isDel: false,
      item: null,
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      tabData:[
        {
          status: '0',
          text: '全部',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '1',
          text: '处理中',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '2',
          text: '已完成',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        }
      ],
      tabList: [
        {
          name: '全部',
          total: 0,
          count: 0,
          status: '0',
        },
        {
          name: '处理中',
          total: 0,
          count: 0,
          status: '1',
        },
        {
          name: '已完成',
          total: 0,
          count: 0,
          status: '2',
        }
      ],
      tabCurrentIndex: 0,
      tabsHeight: 0,
    }
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    setClose: function (item) {
      this.isDel = true;
      this.item = item;
    },
    deleteConfirm() {
      let _this = this;
      orderAfterDelete(this.item.id).then(function () {
            //撤回售后相当于删除,撤回后返回列表
            _this.list.forEach(function (item, index) {
              if (item.id === data.id) {
                _this.$delete(_this.list, index);
              }
            });
          this.$u.toast('删除订单成功');
          }).catch(function (err) {
            console.error(err);
          });
    },
    // 总件数
    totalNum(item) {
      let num = 0;
      item.map(val => {
        num += val.goodQuantity;
      });
      return num;
    },
    loadMoreOrder(){
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
      getOrderAfterPage({'pageNo':page,'pageSize':10,'status':status}).then((res)=>{
        debugger
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            navItem.orderList.push(item);
          });
          navItem.total = res.data.total;
          if (res.data.list.length === navItem.orderList.length) {
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
    //swiper 切换
    changeSwiper(e) {
      this.tabCurrentIndex = e.target.current;
      this.loadData('tabChange');
    },
    // tab栏切换
    tabsChange(index) {
      this.tabCurrentIndex = index;
      this.loadData('tabChange');
    },
  }
}
</script>

<style lang="scss" scoped>
.order {
  width: 710rpx;
  background-color: #ffffff;
  margin: 20rpx auto;
  border-radius: 20rpx;
  box-sizing: border-box;
  padding: 20rpx;
  font-size: 28rpx;
  .top {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .store {
        margin: 0 10rpx;
        font-size: 32rpx;
        font-weight: bold;
      }
    }
    .right {
      color: $mszf-theme-color;
    }
  }
  .item {
    display: flex;
    margin: 20rpx 0 0;
    justify-content: space-between;
    .left {
      margin-right: 20rpx;
      image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 10rpx;
      }
    }
    .content {
      flex: 1;
      .title {
        font-size: 28rpx;
        line-height: 50rpx;
      }
      .type {
        margin: 10rpx 0;
        font-size: 24rpx;
        color: $u-tips-color;
      }
      .delivery-time {
        color: $mszf-theme-color;
        font-size: 24rpx;
      }
    }
    .right {
      margin-left: 10rpx;
      padding-top: 20rpx;
      text-align: right;
      .decimal {
        font-size: 24rpx;
        margin-top: 4rpx;
      }
      .number {
        color: $u-tips-color;
        font-size: 24rpx;
      }
    }
  }
  .total {
    margin-top: 20rpx;
    text-align: right;
    font-size: 24rpx;
    .total-price {
      font-size: 32rpx;
    }
  }
  .bottom {
    display: flex;
    margin-top: 20rpx;
    padding: 0 10rpx;
    justify-content: flex-end;
    align-items: center;
    .btn {
      line-height: 52rpx;
      width: 160rpx;
      border-radius: 26rpx;
      border: 2rpx solid $u-border-color;
      font-size: 26rpx;
      text-align: center;
      color: $u-type-info-dark;
    }
    .evaluate {
      color: $mszf-theme-color;
      border-color: #FF0505;
    }
  }
}
.wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--window-top));
  width: 100%;
}
.swiper-box {
  flex: 1;
}
.swiper-item {
  height: 100%;
}
</style>