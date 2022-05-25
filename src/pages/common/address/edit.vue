<template>
  <view class="wrap">
    <u-toast ref="uToast" />
    <u-form :model="form" ref="uForm">
      <view class="top">
        <view class="item">
          <view class="left">收货人</view>
          <input type="text" placeholder-class="line" v-model="form.consignee" placeholder="请填写收货人姓名" />
        </view>
        <view class="item">
          <view class="left">手机号码</view>
          <input type="text" placeholder-class="line" v-model="form.mobile" placeholder="请填写收货人手机号" />
        </view>
        <view class="item" @tap="showRegionPicker">
          <view class="left">所在地区</view>
          <input disabled type="text" placeholder-class="line" v-model="region" placeholder="省市区县、乡镇等" />
        </view>
        <view class="item address">
          <view class="left">详细地址</view>
          <textarea type="text" placeholder-class="line" v-model="form.address" placeholder="街道、楼牌等" />
        </view>
      </view>
      <view class="bottom">
        <view class="default">
          <view class="left">
            <view class="set">设置默认地址</view>
            <view class="tips">提醒：每次下单会默认推荐该地址</view>
          </view>
          <view class="right">
            <u-switch v-model="form.check"  activeColor="#FF0505" activeValue="1" inactiveValue="0"></u-switch>
          </view>
        </view>
      </view>
      <faasmall-select-address v-model="show" @select="selectArea" :select="form"></faasmall-select-address>
    </u-form>
    <view class="address-button-wrap">
      <u-button class="address-button-submit" type="primary" shape="circle" @click="submit">保存地址</u-button>
    </view>
  </view>
</template>

<script>
import {addAddress, getAddress, updateAddress} from "@/faasmall/api/address";

export default {
  components:{

  },
  data() {
    return {
      show: false,
      region:'',
      form: {
        id:'',
        consignee: '',
        mobile: '',
        address:'',
        district:'',
        city:'',
        province:'',
        isDefault:'',
        tag:[],
        check: false,
        status:0,
      },
      rules: {
        consignee: [
          {
            required: true,
            message: '收货人不能为空',
            trigger: 'blur',
          }
        ],
        address: [
          {
            required: true,
            message: '详细地址不能为空',
            trigger: 'blur',
          }
        ],
        mobile: [
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // this.$u.test.mobile()就是返回true或者false的
              return this.$u.test.mobile(value);
            },
            message: '手机号码不正确',
            // 触发器可以同时用blur和change
            trigger: ['change','blur'],
          }
        ]
      },
    };
  },
  onLoad(){
    this.form.id = this.$Route.query.id;
    if(this.$isNotEmpty(this.form.id)){
      this.getAddressInfo();
    }
  },
  methods: {
    getAddressInfo(){
      let _this = this;
      getAddress({id:this.form.id}).then(res => {
        if (res.code === 0){
          _this.form.id = res.data.id;
          _this.form.check = res.data.status === 1;
          debugger
          _this.form.consignee = res.data.consignee;
          _this.form.mobile = res.data.mobile;
          _this.form.address = res.data.address;
          _this.form.district = res.data.district;
          _this.form.city = res.data.city;
          _this.form.province = res.data.province;
          debugger
          _this.region = res.data.province + res.data.city + res.data.district;
        }
      });
    },
    showRegionPicker() {
      this.show = true;
    },
    selectArea: function(area) {
      debugger
      this.form.province = area[0].name;
      this.form.city = area[1].name;
      this.form.district = area[2].name;
      this.region = this.form.province + this.form.city + this.form.district;
    },
    addressCancel(e){
      console.info('地址取消：' + e);
    },
    submit(){
      if(this.$isNotEmpty(this.form.id)){
        this.form.status = this.form.check ? 1:0;
        updateAddress(this.form).then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '修改成功',
            })
            this.$Router.back();
          } else {
            uni.showModal({
              showCancel: false,
              title: '修改失败',
              content: res.msg,
            });
          }
        });
      }else {
        addAddress(this.form).then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '保存成功',
            })
            this.$Router.back();
          } else {
            uni.showModal({
              showCancel: false,
              title: '保存失败',
              content: res.msg,
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .line {
  color: $u-light-color;
  font-size: 28rpx;
}
.wrap {
  background-color: #f2f2f2;
  .top {
    background-color: #ffffff;
    border-top: solid 2rpx $u-border-color;
    padding: 22rpx;
    .item {
      display: flex;
      font-size: 32rpx;
      line-height: 100rpx;
      align-items: center;
      border-bottom: solid 2rpx $u-border-color;
      .left {
        width: 180rpx;
      }
      input {
        text-align: left;
      }
    }

    .address {
      padding: 20rpx 0;
      textarea {
        // width: 100%;
        height: 150rpx;
        background-color: #f7f7f7;
        line-height: 60rpx;
        margin: 40rpx auto;
        padding: 20rpx;
      }
    }
    .site-clipboard {
      padding-right: 40rpx;
      textarea {
        // width: 100%;
        height: 150rpx;
        background-color: #f7f7f7;
        line-height: 60rpx;
        margin: 40rpx auto;
        padding: 20rpx;
      }
      .clipboard {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26rpx;
        color: $u-tips-color;
        height: 80rpx;
        .icon {
          margin-top: 6rpx;
          margin-left: 10rpx;
        }
      }
    }
  }
  .bottom {
    margin-top: 20rpx;
    padding: 40rpx;
    //padding-right: 0;
    background-color: #ffffff;
    font-size: 28rpx;
    .tag {
      display: flex;
      .left {
        width: 160rpx;
      }
      .right {
        display: flex;
        flex-wrap: wrap;
        .tags {
          width: 140rpx;
          padding: 16rpx 8rpx;
          border: solid 2rpx $u-border-color;
          text-align: center;
          border-radius: 50rpx;
          margin: 0 10rpx 20rpx;
          display: flex;
          font-size: 28rpx;
          align-items: center;
          justify-content: center;
          color: $u-content-color;
          line-height: 1;
        }
        .plus {
          //padding: 10rpx 0;
        }
      }
    }
    .default {
      margin-top: 50rpx;
      display: flex;
      justify-content: space-between;
      border-bottom: solid 2rpx $u-border-color;
      line-height: 64rpx;
      .tips {
        font-size: 24rpx;
      }
      .right {
      }
    }
  }
}
</style>
