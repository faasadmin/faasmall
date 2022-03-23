<template>
    <view>
      <faasmall-navbar title="订单列表" :is-back="true"></faasmall-navbar>
      <u-toast ref="uToast" />
      <view >
        <view style="height: 80rpx;padding: 20rpx;background: #FFFFFF">
          <u-search placeholder="请输入商品名称/订单号搜索" @search="searchOrder" @custom="searchOrder" :show-action="true" v-model="keyword" :animation="true"></u-search>
        </view>
        <view class="wrap">
          <view class="u-tabs-box">
            <u-tabs-swiper  ref="uTabs" :list="tabList" active-color="#FF0505"  :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
          </view>
          <swiper class="swiper-box" :current="tabCurrentIndex" @change="changeSwiper">
            <swiper-item class="swiper-item">
              <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreMemberCoupon">
                <view class="page-box">
                  <view class="order" v-for="(res, index) in tabData[0].orderList" :key="res.id" @tap="toInfo(res.order)">
                    <view class="top">
                      <view class="left">
                        <view class="store">{{res.order.createTime}}</view>
                      </view>
                      <view class="right">{{ res.order.statusName }}</view>
                    </view>
                    <view class="item" v-for="(item, index) in res.goodList" :key="index">
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
                    <view class="total">
                      共{{ totalNum(res.goodList) }}件商品 合计:
                      <text class="total-price">
                        ￥ {{res.order.totalAmount}}
                      </text>
                    </view>
                    <view class="bottom" style="display: flex;justify-content: flex-end" v-if="(res.order.status === 4 && res.order.evaluate === 0) || res.order.status === 3 || res.order.status === 1">
                        <view style="display: flex">
                          <template v-if="res.order.status === 1">
                            <u-button class="ml-1" @click.stop="cancel(res.order.id)">取消订单</u-button>
                            <u-button class="ml-1" v-if="shopData.operatingStatus === 1" @click.stop="toPay(res.order.id)">立即支付
                            </u-button>
                            <u-button class="ml-1" v-else>已打样</u-button>
                          </template>
                          <u-button class="ml-1" v-else-if="res.order.status === 3" @click.stop="receipt(res.order.id)">确认收货
                          </u-button>
                          <u-button class="ml-1" v-else-if="res.order.status === 4 && res.order.evaluate === 0">评价晒单
                          </u-button>
                        </view>
                    </view>
                  </view>
                  <!-- 空白页 -->
                  <u-empty v-if="tabData[0].empty === true && tabData[0].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                  <u-loadmore :status="tabData[0].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
                </view>
              </scroll-view>
            </swiper-item>
            <swiper-item class="swiper-item">
              <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreMemberCoupon">
                <view class="page-box">
                  <view class="order" v-for="(res, index) in tabData[1].orderList" :key="res.id" @tap="toInfo(res.order)">
                    <view class="top">
                      <view class="left">
                        <view class="store">{{res.order.createTime}}</view>
                      </view>
                      <view class="right">{{ res.order.statusName }}</view>
                    </view>
                    <view class="item" v-for="(item, index) in res.goodList" :key="index">
                      <view class="left"><image :src="item.goodThumbnail" mode="aspectFill"></image></view>
                      <view class="content">
                        <view class="title u-line-2">{{ item.goodName }}</view>
                        <view class="type">{{item.standardParam}}</view>
                        <!--                        <view class="delivery-time">发货时间 xxxx</view>-->
                      </view>
                      <view class="right">
                        <view class="price">
                          ￥{{item.goodSellingPrice}}
                        </view>
                        <view class="number">x {{item.goodQuantity}}</view>
                      </view>
                    </view>
                    <view class="total">
                      共{{ totalNum(res.goodList) }}件商品 合计:
                      <text class="total-price">
                        ￥ {{res.order.totalAmount}}
                      </text>
                    </view>
                    <view class="bottom">
                      <view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
                      <view class="logistics btn">查看物流</view>
                      <view class="evaluate btn">评价</view>
                    </view>
                  </view>
                  <u-empty v-if="tabData[1].empty === true && tabData[1].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                  <u-loadmore :status="tabData[1].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
                </view>
              </scroll-view>
            </swiper-item>
            <swiper-item class="swiper-item">
              <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreMemberCoupon">
                <view class="page-box">
                  <view class="order" v-for="(res, index) in tabData[2].orderList" :key="res.id" @tap="toInfo(res.order)">
                    <view class="top">
                      <view class="left">
                        <view class="store">{{res.order.createTime}}</view>
                      </view>
                      <view class="right">{{ res.order.statusName }}</view>
                    </view>
                    <view class="item" v-for="(item, index) in res.goodList" :key="index">
                      <view class="left"><image :src="item.goodThumbnail" mode="aspectFill"></image></view>
                      <view class="content">
                        <view class="title u-line-2">{{ item.goodName }}</view>
                        <view class="type">{{item.standardParam}}</view>
                        <!--                        <view class="delivery-time">发货时间 xxxx</view>-->
                      </view>
                      <view class="right">
                        <view class="price">
                          ￥{{item.goodSellingPrice}}
                        </view>
                        <view class="number">x {{item.goodQuantity}}</view>
                      </view>
                    </view>
                    <view class="total">
                      共{{ totalNum(res.goodList) }}件商品 合计:
                      <text class="total-price">
                        ￥ {{res.order.totalAmount}}
                      </text>
                    </view>
                    <view class="bottom">
                      <view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
                      <view class="logistics btn">查看物流</view>
                      <view class="exchange btn">卖了换钱</view>
                      <view class="evaluate btn">评价</view>
                    </view>
                  </view>
                  <u-empty v-if="tabData[2].empty === true && tabData[2].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                  <u-loadmore :status="tabData[2].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
                </view>
              </scroll-view>
            </swiper-item>
            <swiper-item class="swiper-item">
              <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreMemberCoupon">
                <view class="page-box">
                  <view class="order" v-for="(res, index) in tabData[3].orderList" :key="res.id" @tap="toInfo(res.order)">
                    <view class="top">
                      <view class="left">
                        <view class="store">{{res.order.createTime}}</view>
                      </view>
                      <view class="right">{{ res.order.statusName }}</view>
                    </view>
                    <view class="item" v-for="(item, index) in res.goodList" :key="index">
                      <view class="left"><image :src="item.goodThumbnail" mode="aspectFill"></image></view>
                      <view class="content">
                        <view class="title u-line-2">{{ item.goodName }}</view>
                        <view class="type">{{item.standardParam}}</view>
                        <!--                        <view class="delivery-time">发货时间 xxxx</view>-->
                      </view>
                      <view class="right">
                        <view class="price">
                          ￥{{item.goodSellingPrice}}
                        </view>
                        <view class="number">x {{item.goodQuantity}}</view>
                      </view>
                    </view>
                    <view class="total">
                      共{{ totalNum(res.goodList) }}件商品 合计:
                      <text class="total-price">
                        ￥ {{res.order.totalAmount}}
                      </text>
                    </view>
                    <view class="bottom">
                      <view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
                      <view class="logistics btn">查看物流</view>
                      <view class="exchange btn">卖了换钱</view>
                      <view class="evaluate btn">评价</view>
                    </view>
                  </view>
                  <u-empty v-if="tabData[3].empty === true && tabData[3].orderList.length === 0" text="暂无数据" mode="list"></u-empty>
                  <u-loadmore :status="tabData[3].loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreOrder"></u-loadmore>
                </view>
              </scroll-view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
</template>

<script>
import {getMemeberOrderPage} from "@/faasmall/api/member";
import {mapGetters} from "vuex";
import {cancelOrder, freePay, receiptOrder, verifyPay} from "@/faasmall/api/order";

export default {
  name: "list",
  components:{

  },
  data() {
    return {
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      keyword:'',
      tabData:[
        {
          status: '',
          text: '全部',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '1',
          text: '待付款',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '2',
          text: '待发货',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '3',
          text: '待收货',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '5',
          text: '待评价',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        }
      ],
      tabDataBack:[
        {
          status: '',
          text: '全部',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '1',
          text: '待付款',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '2',
          text: '待发货',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '3',
          text: '待收货',
          loadingType: 'loadmore',
          page: 1,
          total: 0,
          empty:false,
          orderList: []
        },
        {
          status: '5',
          text: '待评价',
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
          status: '',
        },
        {
          name: '待付款',
          total: 0,
          count: 0,
          status: '1',
        },
        {
          name: '待发货',
          total: 0,
          count: 0,
          status: '2',
        },
        {
          name: '待收货',
          total: 0,
          count: 0,
          status: '3',
        },
        {
          name: '待评价',
          count: 0,
          total: 0,
          status: '5',
        }
      ],
      tabCurrentIndex: 0,
      tabsHeight: 0,
      dx: 0,
    };
  },
  onLoad() {
    if(this.$isNotEmpty(this.$Route.query.tabCurrentIndex)){
      this.tabCurrentIndex = this.$Route.query.tabCurrentIndex;
    }
    this.loadData();
  },
  computed: {
    ...mapGetters(['tradeData','shopData']),
    // 价格小数
    priceDecimal() {
      return val => {
        if (val !== parseInt(val)) return val.slice(-2);
        else return '00';
      };
    },
    // 价格整数
    priceInt() {
      return val => {
        if (val !== parseInt(val)) return val.split('.')[0];
        else return val;
      };
    }
  },
  methods: {
    toPay(id){
      debugger
      var that = this;
      verifyPay({id:id}).then(function (res) {
        debugger
        if(res.code === 0){
          debugger
          if(res.data){
            that.$Router.push({
              path: '/pages/common/pay/method',
              query: {
                orderId: 1,
                payState: 'success'
              }
            });
          }else {
            debugger
            freePay({id:id}).then((res)=>{
              debugger
              if (res.code === 0) {
                that.$refs.uToast.show({
                  title: '支付成功',
                  type: 'success',
                })
                setTimeout(() => {
                  uni.redirectTo({
                    url: '/pages/common/order/list'
                  });
                }, 500);
              }else{
                uni.showToast({
                  title: res.msg,
                  duration: 2000,
                  icon: "none",
                });
              }
            }).catch(function (e) {
              console.error(e);
            });
          }
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(function (e) {
        console.error(e);
      });
    },
    cancel(id){
      cancelOrder({id:id}).then((res)=>{
        if(res.code === 0){
          this.$refs.uToast.show({
            title: '取消成功',
            type: 'success',
          })
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    receipt(id){
      receiptOrder({id:id}).then((res)=>{
        if(res.code === 0){
          this.$refs.uToast.show({
            title: '取消成功',
            type: 'success',
          })
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    searchOrder(){
      this.tabData = JSON.parse(JSON.stringify(this.tabDataBack));
      this.loadData('search');
    },
    loadMoreOrder(){
      debugger
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
      getMemeberOrderPage({'pageNo':page,'pageSize':10,'platform':this.platform,'status':status,'keyword':this.keyword}).then((res)=>{
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
    loadMoreMemberCoupon() {
      let index = this.tabCurrentIndex;
      this.tabData[index].page = this.tabData[index].page + 1;
      this.loadData();
    },
    // 总价
    totalPrice(item) {
      let price = 0;
      item.map(val => {
        price += parseFloat(val.price);
      });
      return price.toFixed(2);
    },
    // 总件数
    totalNum(item) {
      let num = 0;
      item.map(val => {
        num += val.goodQuantity;
      });
      return num;
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
    transition({ detail: { dx } }) {
      this.$refs.uTabs.setDx(dx);
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.tabCurrentIndex = current;
    },
    toInfo(item){
      debugger
      //跳转界面
      this.$Router.push({ path: '/pages/common/order/info', query: { id: item.id } });
    }
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
    justify-content: space-between;
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
