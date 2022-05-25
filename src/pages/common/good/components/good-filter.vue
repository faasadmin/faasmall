<template>
  <view class="flex flex-row justify-between navbar">
    <view class="navbar-item" @tap="tabClick(0)">
      <text class="navbar-item-title" >综合</text>
      <view class="line" :class="{ 'line-active': filterIndex === 0 }"></view>
    </view>
    <view class="navbar-item" @tap="tabClick(1)">
      <text class="navbar-item-title">销量</text>
      <view class="line" :class="{ 'line-active': filterIndex === 1 }"></view>
    </view>
    <view class="navbar-item" @tap="tabClick(2)">
      <view class="flex">
        <text class="navbar-item-title">价格</text>
        <view class="p-box ml-1">
          <view
              class="iconfont icon-shang"
              :style="{ fontSize: '20rpx', lineHeight: '18rpx', color: priceSort === 1 && filterIndex === 2 ? '#FF0505' : '#333' }"
          ></view>
          <view
              class="iconfont icon-xiala"
              :style="{ fontSize: '20rpx', lineHeight: '18rpx', color: priceSort === 2 && filterIndex === 2 ? '#FF0505' : '#333' }"
          ></view>
        </view>
        <view class="line" :class="{ 'line-active': filterIndex === 2 }"></view>
      </view>
    </view>
    <view class="navbar-item" @tap="tabClick(3)">
      <text class="navbar-item-title">新品</text>
      <view class="line" :class="{ 'line-active': filterIndex === 3 }"></view>
    </view>
    <view class="navbar-item">
      <view class="tag row-center" @tap="changeType">
        <image class="img-sm" :src="goodsType === 'one' ?  doubleSelect : oneSelect"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "good-filter",
  data(){
    return{
      goodsType: 'one',
      filterIndex: 0,
      priceSort: 0, //价格
      salesSort: 0, //销量
      newProdcutSort: 0, //新品优先,
      doubleSelect: this.$FILE_URL + '/file/img/common/icon_double.png',
      oneSelect: this.$FILE_URL + '/file/img/common/icon_one.png',
    }
  },
  computed: {
    filterData() {
      const data = {
        priceSort: this.priceSort,
        salesSort: this.salesSort,
        newProdcutSort: this.newProdcutSort,
        goodsType: this.goodsType,
      };
      return data;
    }
  },
  methods:{
    changeType() {
      this.goodsType = this.goodsType === 'one' ? 'double' : 'one'
      debugger
      this.$emit('showType', this.filterData);
    },
    tabClick(index) {
      debugger
      this.filterIndex = index;
      index === 1 ? (this.salesSort = 1) : (this.salesSort = 0);
      index === 2 ? (this.priceSort = this.priceSort === 1 ? 2 : 1) : (this.priceSort = 0);
      index === 3 ? (this.newProdcutSort = 1) : (this.newProdcutSort = 0);
      this.$emit('change', this.filterData);
    },
  }
}
</script>

<style lang="scss">
.navbar{
  height: 80rpx;
  background: #FFFFFF;
  position: relative;
  z-index: 999;
  .navbar-item{
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
    font-size: 30rpx;
    position: relative;
    .navbar-item-title{
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
    }
    .line {
      width: 110rpx;
      height: 4rpx;
      background: transparent;
      position: absolute;
      bottom: 0;
      z-index: 2;
    }

    .line-active {
      background: #FF0505;
    }

    .p-box {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>