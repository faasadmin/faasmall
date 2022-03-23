<template>
    <view>
      <faasmall-navbar title="售后列表" :is-back="true"></faasmall-navbar>
      <view class="wrap">
        <view class="u-tabs-box">
          <u-tabs-swiper active-color="#FF0505" ref="uTabs" :list="tabList" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
        </view>
        <swiper class="swiper-box" :current="tabCurrentIndex" @change="changeSwiper">
          <swiper-item class="swiper-item">
            <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreOrder">
              <view class="page-box">
                <view class="order" v-for="(res, index) in tabData[0].orderList" :key="res.id">
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
        </swiper>
      </view>
    </view>
</template>

<script>
import {getMemberOrderAfterPage} from "@/faasmall/api/member";

export default {
  name: "after_sale",
  data(){
    return{
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
      getMemberOrderAfterPage({'pageNo':page,'pageSize':10,'status':status}).then((res)=>{
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

<style scoped>

</style>