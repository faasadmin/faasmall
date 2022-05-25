<template>
  <view>
    <u-toast ref="uToast"></u-toast>
    <scroll-view class="scroll-goods-box" scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadData">
      <!-- 空白页 -->
      <u-empty v-if="empty === true && exchangeList.length === 0" text="暂无数据" mode="list"></u-empty>
      <view class="scroll-goods-content">
        <view class="goods-double row-center-between">
          <navigator v-for="(item, index) in exchangeList" :key="index" class="item bg-white mt-2" hover-class="none" open-type="navigate"
                     :url="'/pages/common/good/info?task=true&id=' + item.goodId">
            <view class="goods-img" style="width: 347rpx;height:347rpx;">
              <faasmall-custom-image :lazy-load="true" width="347rpx" height="347rpx" radius="10rpx" lazy-load :src="item.thumbnail"></faasmall-custom-image>
            </view>
            <view class="goods-info">
              <view class="goods-name line2">{{item.goodName}}</view>
              <view class="mt-2" style="color: #ff0000">
                <text class="iconfont icon-jifen"></text><text>{{item.taskIntegral}}</text>+￥<text>{{item.taskPrice}}</text>
              </view>
            </view>
          </navigator>
        </view>
      </view>
      <u-loadmore :status="loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadData"/>
    </scroll-view>
  </view>
</template>

<script>
import {getExchangePage} from "@/faasmall/api/integral";

export default {
  name: "exchange",
  data(){
    return{
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      currentPage: 1,
      loadingType: 'loadmore',
      empty:true,
      exchangeList: []
    }
  },
  onShow(){

  },
  onLoad(){
    this.loadData();
  },
  methods:{
    toGood(info) {
      uni.navigateTo({
        url: 'pages/common/good/info?id=' + info.id
      })
    },
    loadData(){
      let that = this;
      getExchangePage({pageNo:this.currentPage,pageSize:10}).then((res)=>{
        if(res.code === 0){
          if (res.data.list.length === that.exchangeList.length) {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            that.loadingType = 'nomore';
            that.empty = true;
          } else {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            that.loadingType = 'loadmore';
            that.currentPage++;
            that.empty=false;
          }
          if (that.currentPage > 1) {
            this.exchangeList = this.exchangeList.concat(res.data.list);
          } else {
            this.exchangeList = res.data.list;
          }
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'error',
          })
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.goods-double {
  flex-wrap: wrap;
  padding: 0 20rpx;
  align-items: stretch;
  .item {
    width: 347rpx;
    border-radius: 10rpx;
    .goods-info {
      padding: 10rpx;
    }
  }
}

</style>