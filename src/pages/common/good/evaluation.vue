<!--全部评价-->
<template>
  <view class="faas-page-content">
    <view class="faas-top">
      <view class="faas-title">商品评价({{ tabCount.all }})</view>
      <view class="flex flex-wrap">
        <view
            class="faas-tab-item"
            @click="setTab(item.key)"
            v-for="(item, index) in tabs"
            :class="tabKey === item.key ? 'faas-tab-item-1' : 'faas-tab-item-0'"
            :key="index"
        >
          {{ item.name }}({{ tabCount[item.key] | setCount }})
        </view>
      </view>
    </view>
    <view>
      <view class="faas-item" v-for="item in list" :key="item.id">
        <view class="flex align-center justify-between">
          <view class="flex align-center">
            <!--#ifndef H5-->
            <image class="faas-item-avatar" :src="item.member.avatar" :lazy-load="true"></image>
            <!--#endif-->
            <!--#ifdef H5-->
            <img class="faas-item-avatar" v-lazy="item.member.avatar" />
            <!--#endif-->
            <text class="faas-item-name">{{ item.member.nickName }}</text>
          </view>
          <view class="flex">
            <!--#ifndef H5-->
            <text
                v-for="num in 5"
                :key="num"
                class="iconfont icon-pingjia1"
                :class="item.evaluate.star >= num + 1 ? 'faas-star-yes' : 'faas-star-no'"
            ></text>
            <!--#endif-->
            <!--#ifdef H5-->
            <text
                v-for="num in 5"
                :key="num"
                class="iconfont icon-pingjia1"
                :class="item.evaluate.star >= num ? 'faas-star-yes' : 'faas-star-no'"
            ></text>
            <!--#endif-->
          </view>
        </view>
        <view class="faas-item-body">
          <view class="faas-item-content">{{ item.evaluate.content }}</view>
          <view class="faas-item-param">{{ item.showStandardParam }}</view>
          <view class="faas-item-imgs flex flex-wrap" v-if="$isNotEmpty(item.evaluate.imgs)">
            <u-image
                height="210"
                width="210"
                mode="aspectFill"
                class="faas-item-img"
                @click="doPreviewImage(img, item.evaluate.imgs)"
                v-for="(img, imgIndex) in item.evaluate.imgs"
                :key="imgIndex"
                :src="img"
            ></u-image>
          </view>
          <view class="faas-item-time">{{ item.evaluate.createTime}}</view>
        </view>
        <view class="faas-item-footer" v-if="item.evaluate.reply">
          <text>商家：</text>
          <text class="faas-item-reply">{{ item.evaluate.reply }}</text>
        </view>
      </view>
    </view>
    <view class="faas-no-more" v-if="isLoading">加载中...</view>
    <view class="faas-no-more" v-if="isNoMore">没有更多评价了</view>
    <u-empty v-if="isNothing" text="暂无评价" mode="list"></u-empty>
  </view>
</template>

<script>
import {getEvaluateCount, getEvaluatePage} from "@/faasmall/api/evaluation";

export default {
  name: "evaluation",
  data() {
    return {
      tabs: [
        { key: 'all', name: '全部' },
        { key: 'img', name: '有图' },
        { key: 'good', name: '好评' },
        { key: 'middle', name: '中评'},
        { key: 'difference', name: '差评' }
      ],
      list: [],
      tabKey: 'all',
      goodsId: null,
      isNothing: false,
      isLoading: false,
      isNoMore: false,
      tabCount: {
        all: 0,
        good: 0,
        img: 0,
        middle: 0,
        difference: 0
      },
      page: {
        current: 1,
        count: 1,
        size: 10
      },
      loading: false
    };
  },
  methods: {
    // 切换状态
    setTab: function (active) {
      if (this.tabKey === active) return;
      if (this.loading) return;
      this.loading = true;
      let _this = this;
      this.tabKey = active;
      this.isNoMore = false;
      this.page.current = 1;
      this.list = [];
      this.getList().then(function (res) {
        _this.list = res.list;
        _this.loading = false;
        _this.isNothing = _this.list.length === 0;
      });
    },
    getList: function () {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getEvaluatePage({goodId:_this.goodsId,type:_this.tabKey,pageNo:_this.page.current,pageSize:_this.page.size}).then(function (res) {
            debugger
            let data = res.data;
            resolve(data);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
      });
    },
    getTabCount: function () {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getEvaluateCount(_this.goodsId).then(function (res) {
              resolve(res);
         }).catch(function (err) {
              console.error(err);
              reject(err);
        });
      });
    },
    doPreviewImage(img, images) {
      this.$u.doPreviewImage(img, images);
    }
  },
  onLoad(options) {
    let id = options.id ? parseInt(options.id) : null;
    this.goodsId = id;
    if (id) {
      let _this = this;
      Promise.all([this.getList(), this.getTabCount()])
          .then(function (res) {
            debugger
            _this.list = res[0].list;
            _this.tabCount = res[1].data;
            _this.isNothing = _this.list.length === 0;
          }).catch(function (err) {
            console.error(err);
          });
    }
  },
  onReachBottom() {
    let _this = this;
    this.isLoading = true;
    if (this.page.count > this.page.current) {
      this.page.current++;
      this.getList().then(function (res) {
        _this.list.push(...res);
        _this.isLoading = false;
      });
    } else {
      this.isLoading = false;
      this.isNoMore = true;
    }
  },
  filters: {
    setCount: function (count) {
      return count > 999 ? '999+' : count;
    }
  }
}
</script>

<style scoped lang="scss">
.faas-page-content {
  padding: 0 20rpx 20rpx 20rpx;
  overflow: hidden;
}

.faas-top {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-top: 20rpx;
}

.faas-tab-item {
  border-style: solid;
  border-width: 1rpx;
  border-radius: 28rpx;
  padding: 0 20rpx;
  margin: 0 16rpx 16rpx 0;
  height: 56rpx;
  line-height: 54rpx;
}

.faas-tab-item-0 {
  color: #222222;
  border-color: #d9d9d9;
  background-color: #ffffff;
}

.faas-tab-item-1 {
  color: #FF0505;
  border-color: #FF0505;
}

.faas-title {
  color: #666666;
  line-height: 36rpx;
  margin-bottom: 24rpx;
}

.faas-item {
  padding: 32rpx 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-top: 20rpx;
}

.faas-item:last-child {
  margin-bottom: 20rpx;
}

.faas-item-avatar {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  border-radius: 50%;
}

.faas-item-name {
  color: #222222;
}

.icon-pingjia1 {
  width: 20rpx;
  height: 20rpx;
}

.icon-pingjia1:not(:first-child) {
  margin-left: 8rpx;
}

.faas-star-no {
  color: rgba(229, 229, 229, 1);
}

.faas-star-yes {
  color: rgba(255, 199, 28, 1);
}

.faas-item-body {
  margin-top: 23rpx;
}

.faas-item-content {
  color: #222222;
  line-height: 1.3;
}

.faas-item-param {
  color: #999999;
  line-height: 1.3;
  margin: 20rpx 0 16rpx 0;
  display: inline-block;
}

.faas-item-imgs {
  margin-top: 4rpx;
}

.faas-item-img {
  margin: 0 16rpx 16rpx 0;
}

.faas-item-img:nth-child(3) {
  margin-right: 0;
}

.faas-item-img:nth-child(6) {
  margin-right: 0;
}

.faas-item-time {
  color: #999999;
  margin-top: 4rpx;
}

.faas-item-footer {
  width: 662rpx;
  background: #f7f7f7;
  border-radius: 16rpx;
  padding: 25rpx;
  margin-top: 20rpx;
  color: #222222;
}

.faas-item-reply {
  opacity: 0.65;
}

.faas-no-more {
  color: #999999;
  line-height: 1.3;
  text-align: center;
  margin-top: 40rpx;
}
</style>
