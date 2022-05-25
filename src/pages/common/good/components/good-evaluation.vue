<!--商品评价-->
<template>
  <!-- 商品评价只展示5个 -->
  <view class="comment-wrapper mt-1">
    <view class="comment-title-wrapper" @tap="navigateTo">
      <text class="comment-num">商品评价({{count}})</text>
      <text class="comment-more">查看全部 <text class="iconfont icon-page-next1"></text></text>
    </view>
    <scroll-view v-if="count > 0" class="comment-content-wrapper" scroll-x="true">
      <view class="comment-item" v-for="(item, index) in list" :key="index">
        <view class="comment-item-left">
          <view class="head-content-wrapper">
            <view class="head-icon-content">
              <image class="head-icon" lazy-load="true" :src="item.member.avatar"></image>
            </view>
            <view class="head-name">{{ item.member.nickName }}</view>
            <view class="flex">
              <!--#ifndef H5-->
              <text
                  v-for="stars in 5"
                  :key="stars"
                  class="iconfont icon-pingjia1"
                  :class="item.evaluate.star >= stars + 1 ? 'faas-star-yes' : 'faas-star-no'"
              ></text>
              <!--#endif-->
              <!--#ifdef H5-->
              <text
                  v-for="stars in 5"
                  :key="stars"
                  class="iconfont icon-pingjia1"
                  :class="item.evaluate.star >= stars ? 'faas-star-yes' : 'faas-star-no'"
              ></text>
              <!--#endif-->
            </view>
          </view>
          <view class="comment-content">{{ item.evaluate.content }}</view>
        </view>
        <view class="comment-item-right">
          <image class="product-img" v-if="item.evaluate.imgs" lazy-load="true" :src="item.evaluate.imgs[0]"></image>
        </view>
      </view>
    </scroll-view>
    <view v-else>
      <view class="row-center-center"><text>暂无评论</text></view>
    </view>
  </view>
</template>

<script>
import {getEvaluateCount, getEvaluatePage} from "@/faasmall/api/evaluation";

export default {
  name: "good-evaluation",
  props: {
    goodsId: {
      type: Number,
    },
  },
  computed: {

  },
  data() {
    return {
      count: 0,
      list:[
        {
          evaluate: [],
          member: {}
        }
      ],
    };
  },
  mounted() {
    let _this = this;
    Promise.all([this.getTabCount(), this.getEvaluation()])
        .then(function (res) {
          debugger
          _this.count = res[0].data.all;
          _this.list = res[1];
        }).catch(function (err) {
          console.error(err);
        });
  },
  methods: {
    navigateTo: function navigateTo() {
      uni.navigateTo({ url: "/pages/common/good/evaluation?id=" + this.goodsId });
    },
    getEvaluation: function () {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getEvaluatePage({goodId:_this.goodsId,type:"all",pageNo:1,pageSize:5}).then(function (res) {
          debugger
          if (res.data.list.length > 0) {
            resolve(res.data.list);
          }
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
    },
  },
}
</script>

<style scoped lang="scss">
.comment-wrapper {
  padding: 36rpx 26rpx 26rpx;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  .comment-title-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 26rpx;
    color: #333333;
    margin-bottom: 33rpx;

    .comment-num {
      font-weight: bold;
    }

    .comment-more {
      font-weight: 500;
    }
  }

  .comment-content-wrapper {
    white-space: nowrap;
    .comment-item {
      display: inline-flex;
      width: 600rpx;
      height: 180rpx;
      flex-direction: row;
      margin-right: 20rpx;
      background-color: #f4f4f4;
      border-radius: 10rpx;
      overflow: hidden;

      :last-child {
        margin-right: 0;
      }

      .comment-item-left {
        flex: 1;
        display: flex;
        height: 100%;
        flex-direction: column;
        padding: 27rpx 31rpx 26rpx 26rpx;
        box-sizing: border-box;
        overflow: hidden;

        .head-content-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          height: 43rpx;
          margin-bottom: 27rpx;

          .head-icon-content {
            width: 43rpx;
            height: 43rpx;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 17rpx;

            .head-icon {
              width: 100%;
              height: 100%;
            }
          }

          .head-name {
            flex: 1;
            color: #999999;
            font-size: 24rpx;
            font-weight: 500;
            line-height: 40rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .comment-content {
          width: 100%;
          height: 57rpx;
          line-height: 28rpx;
          font-size: 26rpx;
          font-weight: 500;
          white-space: normal;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      .comment-item-right {
        height: 100%;
        width: 180rpx;
        flex: 0 0 180rpx;

        .product-img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.icon-pingjia1 {
  width: 20rpx;
  height: 20rpx;
  margin-left: 8rpx;
}
.faas-star-no {
  color: rgba(229, 229, 229, 1);
}
.faas-star-yes {
  color: rgba(255, 199, 28, 1);
}
</style>
