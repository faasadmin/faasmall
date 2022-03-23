<template>
  <view>
    <faasmall-navbar :is-back="true" title="地址管理"></faasmall-navbar>
    <view style="padding: 20rpx;">
      <view class="item mt-1" v-for="(item, index) in addressList" :key="item.id" style="border-radius: 10rpx;" @tap="selectAddress(item)">
        <view class="top" style="position: relative">
          <view class="name">{{ item.consignee }}</view>
          <view class="phone">{{ item.mobile }}</view>
          <view class="tag">
            <text v-for="(tag, index) in item.tags" :key="tag" :class="{red:tag === '默认'}">{{ tag }}</text>
          </view>
          <view class="row-center-center" v-if="selectAddressId === item.id" style="position: absolute;right: 0px;">
            <text class="iconfont icon-gou"></text>
          </view>
        </view>
        <view class="bottom">
          {{ item.address }}
          <u-icon name="edit-pen" @click="jump('/pages/common/address/edit', { id: item.id })" :size="40" color="#999999"></u-icon>
        </view>
      </view>
    </view>
    <view class="addSite">
      <!-- 微信小程序和微信H5 -->
      <button
          class="u-reset-button sync-wxaddress u-m-20 u-flex u-row-center u-col-center"
          @tap="getWXaddress"
          v-show="platform == 'wxMiniProgram' || platform == 'wxOfficialAccount'"
      >
        <text class="u-iconfont uicon-weixin-fill u-p-r-10" style="color:#09bb07;font-size: 40rpx;"></text>
        导入微信地址
      </button>
      <view class="add" @tap="jump('/pages/common/address/edit')">
        <u-icon name="plus"  color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
      </view>
    </view>
  </view>
</template>

<script>

import {getAddressList} from "@/faasmall/api/address";

export default {
  components:{

  },
  data() {
    return {
      platform: this.$platform.get(),
      type:'',
      selectAddressId:'',
      addressList: []
    };
  },
  onLoad() {
    this.type = this.$Route.query.type;
    this.initData();
  },
  methods: {
    // 路由跳转
    jump(path, parmas) {
      this.$Router.push({
        path: path,
        query: parmas
      });
    },
    initData() {
      getAddressList().then((res)=>{

        this.addressList = res.data;
      }).catch(error=>{
        console.error(error);
      })
    },
    toAddAddress(){
      uni.navigateTo({
        url: '/pages/mine/address/edit'
      });
    },
    selectAddress(item){

      if(this.type==='select'){
        this.selectAddressId=item.id;
        uni.$emit('SHIPPING_ADDRESS', { addressData: JSON.stringify(item) });
        this.$Router.back();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  padding: 40rpx 20rpx;
  background: #FFFFFF;
  .top {
    display: flex;
    font-weight: bold;
    font-size: 34rpx;
    .phone {
      margin-left: 60rpx;
    }
    .tag {
      display: flex;
      font-weight: normal;
      align-items: center;
      text {
        display: block;
        width: 60rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #ffffff;
        font-size: 20rpx;
        border-radius: 6rpx;
        text-align: center;
        margin-left: 30rpx;
        background-color:rgb(49, 145, 253);
      }
      .red{
        background-color:red
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;
    color: #999999;
  }
}
.addSite {
  display: flex;
  justify-content: space-around;
  width: 600rpx;
  line-height: 100rpx;
  position: absolute;
  bottom: 30rpx;
  left: 80rpx;
  background-color: red;
  border-radius: 60rpx;
  font-size: 30rpx;
  .add{
    display: flex;
    align-items: center;
    color: #ffffff;
    .icon{
      margin-right: 10rpx;
    }
  }
}
</style>
