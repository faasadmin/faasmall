<!--商品物流-->
<template>
  <view class="faas-page-content">
    <view class="faas-card faas-header flex flex-column align-center">
      <image class="faas-header-icon" :src="$FILE_URL + '/file/img/order/logistics-info.png'"></image>
      <text class="faas-header-express">{{ name }}</text>
      <view class="faas-header-num flex align-center">
        <text class="faas-header-no">运单编号：{{ no }}</text>
        <text class="faas-header-copy" @click="copy(no)">复制</text>
      </view>
    </view>
    <view class="faas-card faas-body" :class="empty ? 'flex justify-center' : ''">
      <u-empty v-if="list.length == 0" text="未查到物流信息，请确认运单号码是否正确，或联系客服" mode="list"></u-empty>
      <view class="faas-time-item" v-for="(item, index) in list" :key="index">
        <view class="faas-time-none"></view>
        <view class="faas-time-log">
          <view class="faas-time-date">{{ item.date }}</view>
          <view class="faas-time-time">{{ item.time }}</view>
        </view>
        <view class="faas-time-desc" :class="index === 0 ? 'faas-one-desc' : 'faas-two-desc'">
          {{ item.content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getExpressInfo} from "@/faasmall/api/express";
export default {
  name: 'logistics',
  components: {},
  data() {
    let _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      name: '',
      no: '',
      code: '',
      list: [],
      empty: true
    };
  },
  methods: {
    copy (content) {
      this.$u.func.copyValue({ content });
    },
    getLogistics (logisticsSn, logisticsCompany) {
      let _this = this;
      debugger
      getExpressInfo({sn:logisticsSn,company:logisticsCompany}).then(function (res) {
            debugger
            if(res.data.trackList && res.data.trackList.length > 0){
              let list = res.data.trackList;
              _this.empty = list.length > 0 ?false:true;
              debugger
              var newArr = [];
              for (let i = 0; i < list.length; i++) {
                let date = _this.$u.timeFormat(new Date(list[i].time.replace(/\-/g, '/')), 'mm-dd');
                let time = _this.$u.timeFormat(new Date(list[i].time.replace(/\-/g, '/')), 'hh:MM');
                list[i].date = date;
                list[i].time = time;
                newArr.push(list[i]);
              }
              _this.list = newArr;
            }
          }).catch(err => {
            console.error(err);
          });
    }
  },
  onLoad(options) {
    debugger
    this.name = decodeURIComponent(options.name);
    this.no = options.no;
    this.code = options.code;
    if (options.title) {
      uni.setNavigationBarTitle({
        title: options.title
      });
    }
    this.getLogistics(this.no, this.name);
  }
};
</script>

<style scoped lang="scss">
.faas-page-content {
  padding: 24rpx 20rpx 0 20rpx;
}

.faas-card {
  background: #ffffff;
  border-radius: 16rpx;
}

.faas-header {
  width: 710rpx;
  height: 220rpx;
  margin-bottom: 16rpx;
  position: relative;
  margin-top: 60rpx;

  .faas-header-icon {
    width: 120rpx;
    height: 120rpx;
    top: -50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, 50%);
  }

  .faas-header-express {
    margin-top: 76rpx;
    color: #222222;
    line-height: 56rpx;
  }

  .faas-header-num {
    height: 52rpx;
    .faas-header-no {
      color: #666666;
      margin-right: 6rpx;
    }
  }

  .faas-header-copy {
    width: 66rpx;
    height: 34rpx;
    line-height: 32rpx;
    background: rgba(255, 255, 255, 0.05);
    border: 2rpx solid #cccccc;
    border-radius: 17rpx;
    text-align: center;
    color: #222222;
    margin-left: 6rpx;
  }
}

.faas-body {
  padding: 24rpx;
  min-height: 640rpx;
  .faas-body-no-content {
    width: 410rpx;
  }
  .faas-time-desc {
    padding-left: 30rpx;
    padding-bottom: 40rpx;
    transform: translateY(-6rpx);
    line-height: 34rpx;
    min-height: 88rpx;
  }
  .faas-two-desc {
    color: #999999;
  }

  .faas-one-desc {
    color: #222222;
  }

  .faas-time-item {
    position: relative;
    border-left: 2rpx solid #e5e5e5;
    margin-left: 112rpx;
  }

  .faas-time-item:last-child {
    border-left: none;
  }

  .faas-time-none {
    height: 16rpx;
    width: 16rpx;
    border-radius: 100rpx;
    background: #ddd;
    position: absolute;
    left: -7.5rpx;
  }

  .faas-time-log {
    position: absolute;
    width: 88rpx;
    left: -112rpx;
    transform: translateY(-6rpx);

    .faas-time-date {
      color: #222222;
      text-align: center;
      line-height: 1.2;
    }

    .faas-time-time {
      color: #999999;
      text-align: center;
    }
  }
}
</style>
