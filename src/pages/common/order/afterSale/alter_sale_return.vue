<!--退货信息-->
<template>
  <view class="faas-page-content">
    <view class="faas-box">
      <view class="faas-item flex align-center" @click="navigateTo">
        <view class="faas-item-label">物流公司</view>
        <view style="display: flex;flex: 1;justify-content: space-between;align-items: center">
          <view class="faas-placeholder" :class="userFreightInfo.logisticsCompany ? 'faas-is-name' : ''">{{
              userFreightInfo.logisticsCompany ? userFreightInfo.logisticsCompany : '请填写物流公司'
            }}</view>
          <text class="iconfont icon-page-next1"></text>
        </view>
      </view>
      <view class="faas-item">
        <view class="faas-item-label">物流单号</view>
        <input
            type="text"
            class="faas-item-input"
            style="display: flex;flex: 1"
            onkeyup="userFreightInfo.logisticsSn=userFreightInfo.logisticsSn.replace(/[^\d]/g,'')"
            maxlength="20"
            v-model="userFreightInfo.logisticsSn"
            placeholder-class="faas-placeholder"
            placeholder="请填写物流单号"
        />
      </view>
    </view>
    <!--上传凭证-->
    <view class="faas-upload-certificate">
      <view>
        <text class="faas-text">上传凭证</text>
        <text class="faas-help">({{ userFreightInfo.imgs.length }}/4)</text>
        <text class="faas-help faas-desc">选填</text>
      </view>
      <view class="faas-bottom">
        <u-upload max-count="4"
                  ref="uUpload"
                  :header="authorization"
                  :form-data="{'type':'logistics_certificate'}"
                  action="http://127.0.0.1:8089/api/plugins/faas-mall-addons/api/common/upload"
                  @on-uploaded="beforeUpload"
                  @on-remove="beforeRemove"
        ></u-upload>
      </view>
    </view>
    <button class="faas-submit-btn" :disabled="isSubmit" @click="submit">提交</button>
  </view>
</template>

<script>
import {afterSaleOrderExchange} from "@/faasmall/api/order";
import jwt from "@/faasmall/utils/cache/jwt";
import setting from "@/faasmall/common/config";

export default {
  name: "alter_sale_return_address",
  data() {
    return {
      authorization:{'Authorization': "Bearer " +  jwt.getAccessToken(),'appId': setting.APP_ID},
      id: null,
      mobile: null,
      userFreightInfo: {
        logisticsCompany: '',
        logisticsSn: '',
        imgs: [],
        logisticsCode: '',
        mobile:'',
      },
      list: []
    }
  },
  computed: {
    isSubmit: function () {
      return !this.userFreightInfo.logisticsCompany || !this.userFreightInfo.logisticsSn;
    }
  },
  onLoad(options) {
    this.id = options.id;
    if(options.name){
      this.userFreightInfo.logisticsCompany = decodeURIComponent(options.name);
    }
    this.userFreightInfo.logisticsCode = options.code;
    this.userFreightInfo.mobile = options.mobile;
  },
  methods:{
    beforeUpload(e) {
      this.userFreightInfo.imgs = [];
      e.forEach(item => {
        this.userFreightInfo.imgs.push(item.response.data.previewUrl);
      });
    },
    beforeRemove(index) {
      this.userFreightInfo.imgs.splice(index, 1);
    },
    submit: function () {
      afterSaleOrderExchange({id: this.id,userFreightInfo: this.userFreightInfo}).then(function () {
          uni.navigateBack({
            delta: 1
          });
      }).catch(function (err) {
            console.error(err)
      });
    },
    navigateTo: function () {
      let that = this;
      uni.redirectTo({
        url: '/pages/common/tool/logistics_company?id=' + that.id + '&mobile=' + this.userFreightInfo.mobile
      });
    }
  }
}
</script>
<style scoped lang="scss">
.faas-page-content {
  padding: 20rpx;
}

.faas-box {
  width: 710rpx;
  height: 233rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 16rpx;
}

.faas-item {
  height: 100rpx;
  display: flex;
  align-items: center;
}

.faas-item:first-child {
  border-bottom: 2rpx solid rgba(229, 229, 229, 1);
  .faas-placeholder {
    margin-left: 55rpx;
  }
  .faas-is-name {
    color: #222222;
  }
}

.faas-item .faas-item-label {
  color: #222222;
}

.faas-item .faas-item-input {
  margin-left: 55rpx;
  color: #222222;
}

.faas-placeholder {
  color: #999999;
}

.faas-upload-certificate {
  width: 710rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 0rpx 12rpx 24rpx;
}

.faas-text {
  color: #222222;
}

.faas-help {
  color: #999999;
  margin-left: 16rpx;
}

.faas-desc {
  font-size: 24rpx;
}

.faas-bottom {
  margin-top: 24rpx;
}

.faas-submit-btn {
  width: 710rpx;
  height: 80rpx;
  border-radius: 40rpx;
  color: #ffffff;
  margin-top: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f60000;
}
.faas-submit-btn[disabled] {
  background: #cccccc !important;
  color: #ffffff;
}
</style>