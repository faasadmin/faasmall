<!-- 我的钱包 -->
<template>
  <view class="wallet-wrap fixed-content">
    <!-- 钱包卡片 -->
    <view class="head_box u-flex u-row-center u-col-center">
      <view class="card-box">
        <view class="card-head u-flex u-col-center">
          <view class="card-title u-m-r-10">可提现金额（元）</view>
          <view @tap="showMoney = !showMoney" class="u-iconfont"
                :class="showMoney ? 'uicon-eye' : 'uicon-eye-off'" style="color: #fff;font-size: 46rpx;"></view>
        </view>
        <view class="money-num u-p-t-50">{{ showMoney ? memberData.balance || '0.00' : '*****' }}</view>
        <button v-if="walletData.rechargeSwitch ===1" class="u-reset-button topup-btn"
                @tap="$Router.push('/pages/common/wallet/recharge')">充值</button>
        <button class="u-reset-button withdraw-btn"
                @tap="$Router.push('/pages/common/wallet/withdraw')">提现</button>
      </view>
    </view>
    <!-- 筛选 -->
    <u-sticky offset-top="0" :enable="true">
      <view class="filter-box u-flex u-row-between">
        <button class="u-reset-button date-btn u-flex" @tap="showCalendar = true">
          {{ selDateText }}
          <text class="u-iconfont uicon-arrow-down-fill u-m-l-20" style="color: #e5e5e5"></text>
        </button>
        <view class="total-box">收入￥{{ incomeMoney || '0.00' }} 支出￥{{ expendMoney || '0.00' }}</view>
      </view>
    </u-sticky>
    <view>
      <view class="border-bottom head-box">
        <u-tabs-swiper ref="uTabs" active-color="#FF0505" :list="tabList" :current="tabCurrentIndex" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
      </view>
      <swiper :current="tabCurrentIndex" duration="300" @change="changeSwiper" :style="{'height':(scrollHeight-60) + 'px'}">
        <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in tabData" :key="tabIndex">
          <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadMoreWalletCoupon" :style="{'height':(scrollHeight-60) + 'px'}">
            <!-- 空白页 -->
            <u-empty v-if="tabItem.empty === true && tabItem.walletList.length === 0" text="暂无数据" mode="list"></u-empty>
            <!-- 优列表 -->
            <view class="content_box" style="padding: 20rpx">
              <!-- 钱包记录 -->
              <view class="wallet-list u-flex" v-for="item in tabItem.walletList" :key="item.id">
                <image class="head-img u-m-r-20" :src="item.img" mode=""></image>
                <view class="list-content">
                  <view class="title-box u-flex u-row-between">
                    <text class="title u-ellipsis-1">{{ item.typeName }}{{ item.title ? '-' + item.title : '' }}</text>
                    <view class="money">
                      <text v-if="item.mode === 1" class="add">+{{ item.balance }}</text>
                      <text v-else class="minus">-{{ item.balance }}</text>
                    </view>
                  </view>
                  <text class="time">{{ $u.timeFormat(item.createtime, 'yyyy-mm-dd hh:MM') }}</text>
                </view>
              </view>
            </view>
            <u-loadmore :status="tabItem.loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreWalletCoupon"/>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 日期选择 -->
    <u-calendar v-model="showCalendar" ref="uCalendar" safeAreaInsetBottom mode="range" start-text="开始"
                end-text="结束" active-bg-color="#7063d2" active-color="#fff" range-bg-color="#e5e2ff" range-color="#7063d2"
                :customStyle="{ background: 'linear-gradient(90deg, #A36FFF, #5336FF)', boxShadow: '0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34)' }"
                @change="selDate"></u-calendar>
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import {getBalanceLogPage} from "@/faasmall/api/wallet";
export default {
  components: {},
  data() {
    return {
      isEmpty: false,
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      scrollHeight:'',
      tabCurrentIndex: 0, //默认
      tabList:[
        {
          status: 0,
          name: '全部',
          total: 0
        }, {
          status: 1,
          name: '收入',
          total: 0
        },{
          status: 2,
          name: '支出',
          total: 0
        }
      ],
      tabData: [{
        mode: '',
        name: '全部',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        walletList: [],
      },{
        mode: 1,
        name: '收入',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        walletList: [],
      },{
        mode: 2,
        name: '支出',
        loadingType: 'loadmore',
        page: 1,
        total: 0,
        empty:false,
        walletList: [],
      }],
      showMoney: true,
      //日期选择
      showCalendar: false,
      selDateText: '',
      propsDate: '', //日期参数
      incomeMoney: '', //收入
      expendMoney: '', //支出
      loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters(['isLogin', 'memberData','walletData'])
  },
  onShow() {
    this.isLogin && this.getMemberData();
    this.getToday();
  },
  onLoad(){
    this.loadData();
  },
  mounted(){
    let info = uni.createSelectorQuery().in(this).select('.fixed-content').boundingClientRect()
    info.exec(res => {
      this.scrollHeight = res[0].height;
      console.log(this.scrollHeight)
    })
  },
  methods: {
    ...mapActions(['getMemberData']),
    //加载更多事件
    loadMoreWalletCoupon() {
      let index = this.tabCurrentIndex;
      this.tabData[index].page = this.tabData[index].page + 1;
      this.loadData();
    },
    //  今天
    getToday() {
      let now = new Date();
      let dateText = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
      this.selDateText = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
      this.propsDate = `${dateText}-${dateText}`;
    },
    //swiper 切换
    changeSwiper(e) {
      this.tabCurrentIndex = e.target.current;
      this.loadData('tabChange');
    },
    // tabs通知swiper切换
    tabsChange(index) {
      this.tabCurrentIndex = index;
      this.loadData('tabChange');
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    // 日期选择
    selDate(e) {
      this.currentPage = 1;
      this.lastPage = 1;
      this.selDateText = `${e.startYear}.${e.startMonth}.${e.startDay}-${e.endYear}.${e.endMonth}.${e.endDay}`;
      let dateText = `${e.startYear}/${e.startMonth}/${e.startDay}-${e.endYear}/${e.endMonth}/${e.endDay}`;
      this.propsDate = dateText;
      this.getWalletLog();
      this.$refs.uCalendar.init();
    },
    // 钱包明细
    loadData(source) {
      let _this = this;
      //这里是将订单挂载到tab列表下
      let index = this.tabCurrentIndex;
      let navItem = this.tabData[index];
      let mode = navItem.mode;
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
      getBalanceLogPage({pageNo:page,pageSize:10,status:0,mode:mode}).then((res)=>{
        debugger
        if(res.code === 0){
          debugger
          let list = res.data.pageResult.list;
          if(list.length > 0){
            list.forEach(item => {
              navItem.walletList.push(item)
            });
            navItem.total = res.data.pageResult.total;
            _this.incomeMoney = res.data.income;
            _this.expendMoney = res.data.expend;
            debugger
            if (res.data.pageResult.total === navItem.walletList.length) {
              //判断是否还有数据， 有改为 more， 没有改为noMore
              navItem.loadingType = 'nomore';
            } else {
              //判断是否还有数据， 有改为 more， 没有改为noMore
              navItem.loadingType = 'loadmore';
            }
          }
          this.$set(navItem, 'empty', true);
          console.info(_this.tabData)
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
    }
  }
};
</script>

<style lang="scss">
.wallet-list {
  padding: 30rpx;
  background-color: #ffff;
  border-bottom: 1rpx solid #eeeeee;

  .head-img {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background: #ccc;
  }

  .list-content {
    justify-content: space-between;
    align-items: flex-start;
    flex: 1;

    .title {
      font-size: 28rpx;
      color: #333;
      width: 400rpx;
    }

    .time {
      color: #c0c0c0;
      font-size: 22rpx;
    }
  }

  .money {
    font-size: 28rpx;
    font-weight: bold;

    .add {
      color: #ff0013;
    }
    .minus {
      color: #333333;
    }
  }
}

.head_box {
  width: 750rpx;
  background-color: #fff;
  padding: 30rpx 0;
  .card-box {
    width: 690rpx;
    min-height: 300rpx;
    padding: 40rpx;
    background: url($FILE_URL + '/file/img/wallet/balance_bg.png') no-repeat;
    background-size: 100% 100%;
    box-shadow: 1rpx 5rpx 16rpx 0 rgb(255, 18, 35);
    border-radius: 30rpx;
    overflow: hidden;
    position: relative;
    .card-head {
      color: #fff;
      font-size: 30rpx;
    }

    .money-num {
      font-size: 70rpx;
      line-height: 70rpx;
      font-weight: 500;
      color: #ffffff;
    }

    .reduce-num {
      font-size: 26rpx;
      font-weight: 400;
      color: #ffffff;
    }

    .withdraw-btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      background: #ffffff;
      border-radius: 30px;
      font-size: 24rpx;
      font-weight: 500;
      color: #ff1223;
      position: absolute;
      right: 30rpx;
      top: 40rpx;
    }

    .topup-btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 30px;
      font-size: 24rpx;
      font-weight: 500;
      color: #fff;
      border: 1px solid #fff;
      position: absolute;
      right: 180rpx;
      top: 40rpx;
    }
  }
}

.filter-box {
  height: 120rpx;
  padding: 0 30rpx;
  background-color: #f6f6f6;

  .date-btn {
    background-color: #fff;
    line-height: 54rpx;
    border-radius: 27rpx;
    padding: 0 20rpx;
    font-size: 24rpx;
    font-weight: 500;
    color: #666666;
  }

  .total-box {
    font-size: 24rpx;
    font-weight: 500;
    color: #999999;
  }
}
.u-reset-button {
  padding: 0;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  background-color: transparent;
  color: inherit;
  transform: translate(0rpx, 0rpx);
}
.u-reset-button.button-hover {
  transform: translate(1upx, 1upx);
}

.u-reset-button::after {
  border: none;
}
</style>
