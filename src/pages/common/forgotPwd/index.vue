<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="wrapper">
      <u-toast ref="uToast" />
      <view class="logo"><image src="/static/img/logo.png"></image></view>
      <view class="input-content">
        <view class="cu-form-group"
              style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
          <view class="title">手机号</view>
          <input
              type="number"
              :value="mobile"
              placeholder="请输入手机号"
              maxlength="11"
              data-key="mobile"
              @input="inputChange"
          />
        </view>
        <view class="cu-form-group"
              style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
          <text class="title">验证码</text>
          <input
              type="number"
              :value="code"
              placeholder="请输入验证码"
              maxlength="6"
              data-key="code"
              @input="inputChange"
              @confirm="toLogin"
          />
          <button class="send-msg" @click="sendCode" :disabled="sending">{{sendTime}}</button>
        </view>
        <view class="cu-form-group"
              style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
          <text class="title">设置密码</text>
          <input
              type="password"
              :value="password"
              placeholder="请设置新密码"
              placeholder-class="input-empty"
              maxlength="20"
              minlength="6"
              data-key="password"
              @input="inputChange"
              @confirm="toLogin"
          />
        </view>
      </view>
      <button :class="mobile&&code&&password?'confirm-btn':'confirm-btn1'" @click="toReset">立即找回</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      mobile: '',
      password: '',
      sending: false,
      sendTime: '获取验证码',
      count: 60,
      logining: false
    }
  },

  methods: {
    sendCode() {
      const {mobile} = this;
      if (!mobile) {
        this.$refs.uToast.show({
          title: '请输入手机号',
          type: 'error',
        })
      } else if (mobile.length !== 11) {
        this.$refs.uToast.show({
          title: '请输入正确的手机号',
          type: 'error',
        })
      } else {
        this.$utils.showLoading("正在发送验证码...");
        this.$u.api.forgetSmsCode({
          mobile: this.mobile,
        })
            .then(res => {

              if (res.code === 0) {
                this.sending = true;
                this.$u.toast(res.msg);
                this.countDown();
                uni.hideLoading();
              } else {
                uni.hideLoading();
                uni.showModal({
                  showCancel: false,
                  title: '短信发送失败',
                  content: res.msg ? res.msg : '请一分钟后再获取验证码',
                });
              }
            });
      }
    },
    countDown() {
      const {count} = this;
      if (count === 1) {
        this.count = 60;
        this.sending = false;
        this.sendTime = '获取验证码'
      } else {
        this.count = count - 1;
        this.sending = true;
        this.sendTime = count - 1 + '秒后重新获取';
        setTimeout(this.countDown.bind(this), 1000);
      }
    },
    inputChange(e) {
      const key = e.currentTarget.dataset.key;
      this[key] = e.detail.value;
    },
    navBack() {
      uni.navigateBack();
    },
    navTo(url) {
      uni.navigateTo({
        url
      })
    },
    toReset() {
      const {mobile, password, code} = this;
      if (!mobile) {
        this.$refs.uToast.show({
          title: '请输入手机号',
          type: 'error',
        })
      } else if (!mobile) {
        this.$refs.uToast.show({
          title: '请输入验证码',
          type: 'error',
        })
      } else if (!password) {
        this.$refs.uToast.show({
          title: '请设置密码',
          type: 'error',
        })
      } else if (password.length < 8) {
        this.$refs.uToast.show({
          title: '密码位数必须大于八位',
          type: 'error',
        })
      } else {
        this.logining = true;
        this.$utils.showLoading("正在修改密码中...");
        this.$u.api.forgetPwd({
          mobile: this.mobile,
          code:this.code,
          password:this.password,
        })
            .then(res => {

              if (res.code === 0) {
                this.sending = true;
                this.$u.toast(res.msg);
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/login/login'
                  });
                }, 500);
              } else {
                uni.hideLoading();
                uni.showModal({
                  showCancel: false,
                  title: '密码找回失败',
                  content: res.msg,
                });
              }
            });
      }
    },
  },

}
</script>

<style lang='scss'>
page {
  background: #fff;
}
.logo {
  width: 260rpx;
  height: 260rpx;
  /* 		background: rgba(59, 121, 235, 1);
      box-shadow: 0rpx 5rpx 20rpx 5rpx rgba(45, 127, 235, 0.5); */
  border-radius: 50%;
  margin: 10rpx auto 20rpx auto;
}

.logo image {
  width: 260rpx;
  height: 260rpx;
  border-radius: 50%;
}
.cu-form-group{
  background-color: #ffffff;
  padding: 1px 15px;
  display: flex;
  align-items: center;
  min-height: 51px;
  justify-content: space-between;
}
.cu-form-group .title {
  text-align: justify;
  padding-right: 15px;
  font-size: 15px;
  position: relative;
  height: 30px;
  line-height: 30px;
}
.cu-form-group uni-input {
  flex: 1;
  font-size: 15px;
  color: #555;
  padding-right: 10px;
}
.send-msg {
  border-radius: 30px;
  color: white;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  background: #e10a07;
}

.container {
  padding-top: 50px;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
}

.wrapper {
  position: relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 20px;
}

.back-btn {
  position: absolute;
  left: 20px;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 20px;
  font-size: 20px;
  color: #303133;
}

.left-top-sign {
  font-size: 80px;
  color: #f8f8f8;
  position: relative;
}

.right-top-sign {
  position: absolute;
  top: 40px;
  right: -15px;
  z-index: 95;

  &:before, &:after {
    display: block;
    content: "";
    width: 20px;
    height: 40px;
    background: -moz-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
    background: -webkit-gradient(
            linear,
            left top,
            left right,
            color-stop(0, #fa4dbe),
            color-stop(100%, #fbaa58)
    );
    background: -webkit-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
    background: -o-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
    background: -ms-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
    background: linear-gradient(to left, #fa4dbe 0, #fbaa58 100%);
  }

  &:before {
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }

  &:after {
    position: absolute;
    right: -198px;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
    /* background: pink; */
  }
}

.left-bottom-sign {
  position: absolute;
  left: -270px;
  bottom: -320px;
  /*border: 100upx solid #d0d1fd;*/
  border-radius: 50%;
  padding: 90px;
}


.welcome {
  position: relative;
  left: 30px;
  top: -55px;
  font-size: 28px;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
}

.input-content {
  padding: 0 20px;
}

.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30px;
  background: #f8f6fc;
  height: 64px;
  border-radius: 4px;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  .tit {
    height: 30px;
    line-height: 28px;
    font-size: 26upx;
    color: #606266;
  }

  input {
    height: 40px;
    font-size: 30upx;
    color:#303133;
    width: 100%;
  }
}

.confirm-btn {
  width: 300px;
  height: 42px;
  line-height: 42px;
  border-radius: 30px;
  margin-top: 40px;
  background: #e10a07;
  color: #fff;
  font-size: 32upx;

  &:after {
    border-radius: 60px;
  }
}

.confirm-btn1 {
  width: 300px;
  height: 42px;
  line-height: 42px;
  border-radius: 30px;
  margin-top: 40px;
  background: whitesmoke;
  color: grey;
  font-size: 32upx;

  &:after {
    border-radius: 60px;
  }
}

.forget-section {
  font-size: 26upx;
  color: #4399fc;
  text-align: center;
  margin-top: 40px;
}

.register-section {
  position: fixed;
  left: 0;
  bottom: 30px;
  width: 100%;
  font-size: 26upx;
  color: #606266;
  text-align: center;

  text {
    color: #4399fc;
    margin-left: 10px;
  }
}
</style>
