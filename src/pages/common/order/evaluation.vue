<!--商品评价-->
<template>
  <view class="faas-page-content">
    <view class="faas-content" v-for="(good, index) in detail.goodList" :key="index">
      <view class="faas-header flex">
        <image class="faas-good-image" :src="good.thumbnail"></image>
        <view class="faas-good-content">
          <view class="faas-good-name" style="word-break: break-all;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;overflow: hidden;">
            {{ good.goodName }}
          </view>
          <view class="faas-good-param">{{ good.showStandardParam }}</view>
        </view>
      </view>
      <view class="faas-body">
        <view class="faas-star flex align-center">
          <view class="faas-star-text">商品评分</view>
          <view class="flex" v-if="form[index]">
            <view
                class="iconfont icon-pingjia1"
                @click="form[index].star = 1"
                :class="form[index].star >= 1 ? 'faas-star-yes' : 'faas-star-no'"
            ></view>
            <view
                class="iconfont icon-pingjia1"
                @click="form[index].star = 2"
                :class="form[index].star >= 2 ? 'faas-star-yes' : 'faas-star-no'"
            ></view>
            <view
                class="iconfont icon-pingjia1"
                @click="form[index].star = 3"
                :class="form[index].star >= 3 ? 'faas-star-yes' : 'faas-star-no'"
            ></view>
            <view
                class="iconfont icon-pingjia1"
                @click="form[index].star = 4"
                :class="form[index].star >= 4 ? 'faas-star-yes' : 'faas-star-no'"
            ></view>
            <view
                class="iconfont icon-pingjia1"
                @click="form[index].star = 5"
                :class="form[index].star === 5 ? 'faas-star-yes' : 'faas-star-no'"
            ></view>
          </view>
          <view class="faas-star-text faas-evaluation-text" v-if="form[index]">
            {{ form[index].star | getStarText }}
          </view>
        </view>
        <view class="faas-evaluation">
          <textarea
              class="faas-textarea"
              placeholder-style="font-size:26rpx;font-family: PingFang SC;font-weight: 500; color: #999999; line-height:1.3;"
              placeholder="说说你的体验吧!"
              :maxlength="300"
              :value="form[index].content"
              @input="e => setTextarea(e, index)"
          ></textarea>
          <view class="faas-prompt flex" v-if="form[index]">
            <view class="faas-max">{{ form[index].content.length }}/300</view>
            <view class="faas-min" v-if="form[index].content.length < 10">
              再输入
              <text class="faas-number">{{ 10 - form[index].content.length }}</text>
              个字就能发表了哦
            </view>
          </view>
        </view>
      </view>
      <view class="faas-footer" v-if="form[index]">
        <view class="faas-top">
          <text class="faas-title">添加图片</text>
          <text class="faas-number">({{ form[index].imgs.length }}/6)</text>
        </view>
        <view>
          <u-upload max-count="4"
                    ref="uUpload"
                    :index="index"
                    :header="authorization"
                    :form-data="{'type':'good_evaluate'}"
                    action="http://127.0.0.1:8089/api/plugins/faas-mall-addons/api/common/upload"
                    @on-uploaded="beforeUpload"
                    @on-remove="beforeRemove"
          ></u-upload>
        </view>
      </view>
    </view>
    <button class="fs-btn faas-submit-btn" :disabled="isDis" @click="submit" v-if="$isNotEmpty(detail.goodList)">
      提交
    </button>
  </view>
</template>

<script>
import jwt from "@/faasmall/utils/cache/jwt";
import {getOrderInfo} from "@/faasmall/api/order";
import {createEvaluate} from "@/faasmall/api/evaluation";
import setting from "@/faasmall/common/config";
export default {
  name: "evaluation",
  data() {
    return {
      authorization:{'Authorization': "Bearer " +  jwt.getAccessToken(),'appId': setting.APP_ID},
      form: [],
      detail: {},
      orderId: null
    };
  },
  computed: {
    isDis: function () {
      let num = 0;
      const len = this.form.length;
      for (let i = 0; i < len; i++) {
        if (this.form[i].content.length >= 10) {
          num++;
        }
      }
      return num !== len;
    },
  },
  methods: {
    setTextarea(e, index) {
      let str = e.detail.value;
      if (str.length > 300) {
        str = str.substring(0, 300);
      }
      this.form[index].content = str;
    },
    getDetail(id) {
      const _this = this;
      this.form = [];
      getOrderInfo({id:id}).then(function (res) {
            _this.detail = res.data;
            let len = res.data.goodList.length;
            for (let i = 0; i < len; i++) {
              _this.form.push({
                content: '',
                star: 5,
                imgs: [],
                orderGoodId: res.data.goodList[i].id
              });
            }
          }).catch(function (err) {
            console.error(err);
          });
    },
    submit() {
      let _this = this;
      if (this.isDis) {
        return;
      }
      createEvaluate({
        orderSn: _this.detail.orderSn,
        evaluateList: _this.form
      }).then(function () {
          uni.navigateBack({ delta: 1 });
      }).catch(function (err) {
            console.error(err);
      });
    },
    beforeUpload(e,index) {
      this.form[index].imgs=[];
       e.forEach(item => {
         this.form[index].imgs.push(item.response.data.previewUrl)
      });
    },
    beforeRemove(index) {
      this.form[key].imgs.slice(index, 1);
    },
  },
  onLoad(options) {
    debugger
    options.id ? this.getDetail(parseInt(options.id)) : null;
    this.orderId = parseInt(options.id);
  },
  filters: {
    getStarText: function (star) {
      switch (star) {
        case 5:
          return '非常满意';
        case 4:
          return '满意';
        case 3:
          return '一般';
        case 2:
          return '差';
        case 1:
          return '很差';
        default:
      }
    }
  }
}
</script>

<style scoped lang="scss">
.faas-page-content {
  padding: 20rpx;
}

.faas-content {
  width: 710rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 16rpx 24rpx 32rpx 24rpx;
  margin-bottom: 20rpx;
}

.faas-header {
  height: 132rpx;
  padding: 16rpx 0;
}

.faas-good-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  display: block;
  margin-right: 24rpx;
}

.faas-good-content {
  height: 100rpx;
  width: 538rpx;
  padding: 16rpx 0 0 0;
}

.faas-good-name {
  color: #222222;
  line-height: 1.3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.faas-good-param {
  color: #999999;
  margin-top: 10rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.faas-star {
  height: 88rpx;
}

.faas-star-text {
  color: #222222;
  margin-right: 4rpx;
}

.faas-evaluation-text {
  font-weight: 500;
  color: #222222;
}

.icon-pingjia1 {
  width: 40rpx;
  height: 40rpx;
  font-size: 40rpx;
  margin-left: 20rpx;
}

.faas-star-no {
  color: #e5e5e5;
}

.faas-star-yes {
  color: #ffc71c;
}

.faas-evaluation {
  width: 662rpx;
  height: 280rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 16rpx;
  padding: 24rpx;
  position: relative;
  margin: 16rpx 0;
}

.faas-textarea {
  width: 614rpx;
  height: 200rpx;
  color: #222222;
  line-height: 1.3;
}

.faas-prompt {
  position: absolute;
  color: #999999;
  line-height: 1.3;
  bottom: 24rpx;
  right: 24rpx;
}

.faas-min {
  margin-left: 17rpx;
}

.faas-min .faas-number {
  color: rgba(230, 11, 48, 1);
}

.faas-footer .faas-top {
  height: 73rpx;
  line-height: 73rpx;
  color: #222222;
}

.faas-footer .faas-top .faas-title {
  color: #222222;
}

.faas-footer .faas-top .faas-number {
  color: #999999;
  margin-left: 15rpx;
}

.faas-submit-btn {
  width: 710rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #FF0505;
  color: #ffffff;
  margin-top: 36rpx;
}

.faas-submit-btn[disabled] {
  background: #cccccc;
  color: #ffffff;
}
</style>
