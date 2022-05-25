<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="wrapper">
      <u-toast ref="uToast" />
      <view class="logo">
        <image src="/static/logo.png"></image>
      </view>
      <view v-if="accountLogin" class="input-content">
        <view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px;display: flex">
          <view class="title">账号</view>
          <input
              style="flex: 1"
              type="number"
              v-model="mobile"
              placeholder="请输入手机号"
              maxlength="11"
              @input="inputChange"
          />
        </view>
        <view class="cu-form-group" style="border: 1px solid whitesmoke;border-radius: 30px;display: flex">
          <view class="title">密码</view>
          <input
              style="flex: 3"
              type="password"
              placeholder="请输入密码"
              maxlength="20"
              v-model="password"
              @confirm="toLogin"
              @input="inputChange"
          />
          <text class="send-msg" style="flex: 1" @click="forget">忘记密码</text>
        </view>
      </view>
      <view v-else class="input-content">
        <view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px;display: flex">
          <view class="title">手机号</view>
          <input
              style="flex: 1"
              type="number"
              v-model="mobile"
              placeholder="请输入手机号"
              maxlength="11"
              @input="inputChange"
          />
        </view>
        <view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
          <text class="title">验证码</text>
          <input type="number" style="flex: 2" v-model="code" placeholder="请输入验证码" maxlength="6"/>
          <button style="  border-radius: 30px;color: white;height: 30px;font-size: 14px;line-height: 30px;background: #e10a07;" @click="sendCode" :disabled="sending">{{sendTime}}</button>
        </view>
      </view>
      <button :class="(mobile&&password) || (mobile&&code)?'confirm-btn':'confirm-btn1'" @click="toLogin">登录</button>
      <view style="margin-top: 20px;text-align: center">
        <view style="display: flex;align-items: center;justify-content: center">
          <text style="color: #e10a07" @click="register()">立即注册</text>
          <view style="background: #e3e3e3;border: 1px solid #e3e3e3;height: 15px;margin: 0 15px;"></view>
          <text style="color: #e10a07" @click="accountLogin = !accountLogin">{{ accountLogin ? '手机登陆': '账号登陆' }}</text>
        </view>
      </view>
    </view>
    <view v-if="platform !== 'h5'">
      <view class="other-login">
        <view class="line"></view>
        <view class="other">
          <view class="text">其他方式登陆</view>
        </view>
      </view>
      <view class="other-img mt-2">
        <u-image @tap="thirdLogin('wechat')" v-if="['app', 'wx_mp_account', 'wx_ma_program'].includes(platform)"  :src="$FILE_URL + '/file/img/common/bind_wx.png'" shape="circle" width="64rpx" height="64rpx"></u-image>
      </view>
    </view>
    <!-- 协议 -->
    <view class="agreement-box u-flex u-row-center mt-2">
      <u-checkbox v-model="protocol" shape="circle" active-color="#FF0505">
        <view class="agreement-text tcp-text u-flex u-col-center">
          我已阅读并遵守
          <view class="tcp-text u-flex u-col-center">
            <view @tap.stop="$Router.push({ path: '/pages/common/public/rich_text', query: {  type: 'register'} })">《用户协议》</view>
            与
            <view @tap.stop="$Router.push({ path: '/pages/common/public/rich_text', query: { type: 'privacy'} })">《隐私协议》</view>
          </view>
        </view>
      </u-checkbox>
    </view>
  </view>
</template>

<script>
import {codeAuthorizeLogin, mobilePassWordLogin, mobileSmsCodeLogin} from "../../../faasmall/api/login";
import store from "../../../faasmall/store";
var tool = require('../../../faasmall/common/tool.js');
import {mapActions, mapGetters} from 'vuex';
import jwt from '@/faasmall/utils/cache/jwt.js';
import {silentLogin} from "@/faasmall/utils/auth/auth";
import {isNotEmpty} from "@/faasmall/utils/faasmall";
import wechat from '@/faasmall/common/wechat/wechat';
import {getRegisterCode} from "@/faasmall/api/register";
export default {
  data() {
    const _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      protocol: false, //是否同意隐私协议
      platform: this.$platform.get(),
      sendTime: '获取验证码',
      count: 60,
      accountLogin:true,
      sending: false,
      code:undefined,
      mobile: jwt.getAccount(),
      password: jwt.getPassword(),
    }
  },
  onShow(){
    // #ifdef MP-WEIXIN
    wechat.getWxMiniProgramToken(false);
    // #endif
  },
  onLoad(){

  },
  computed: {
    ...mapGetters(['shopData']),
  },
  methods: {
    ...mapActions(['Login','getMemberInfo','getMemberData']),
    forget() {
      uni.navigateTo({
        url: '/pages/common/login/forgot_pwd'
      });
    },
    checkProtocol(){
      if (!this.protocol) {
        this.$u.toast('请同意用户协议');
        return false;
      }
    },
    // 第三方登录
    async thirdLogin(provider) {
      const that = this;
      that.checkProtocol();
      let token = '';
      switch (provider) {
        case 'wechat':
          token = await wechat.login();
          break;
      }
      debugger
      if (token) {
        await that.getMemberInfo(token);
      }
      uni.switchTab({
        url: '/pages/tabbar/main/index'
      });
    },
    //获取验证码
    sendCode() {
      const {
        mobile
      } = this;
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
        this.$refs.uToast.show({
          title: '正在发送验证码...',
          type: 'success',
        })
        getRegisterCode({
          mobile: this.mobile,
          scene:4,
          templateCode: 0
        }).then(res => {
          if (res.code === 0) {
            this.sending = true;
            this.$u.toast("发送成功");
            this.countDown();
            uni.hideLoading();
          } else {
            uni.hideLoading();
            uni.showModal({
              showCancel: false,
              title: '短信发送失败',
              content: res.msg,
            });
          }
        });
      }
    },
    countDown() {
      const {
        count
      } = this;
      if (count === 1) {
        this.count = 60;
        this.sending = false;
        this.sendTime = '获取验证码'
      } else {
        this.count = count - 1;
        this.sending = true;
        this.sendTime = count - 1 + 's';
        setTimeout(this.countDown.bind(this), 1000);
      }
    },
    inputChange(e) {
      const key = e.currentTarget.dataset.key;
      this[key] = e.detail.value;
    },
    register() {
      uni.navigateTo({
        url: '/pages/common/register/index'
      });
    },
    navBack() {
      uni.navigateBack();
    },
    toLogin() {
      this.checkProtocol();
      if(this.accountLogin){
        if (!this.protocol) {
          this.$u.toast('请同意用户协议');
          return false;
        }
        if(!this.mobile){
          this.$refs.uToast.show({
            title: '请输入手机号',
            type: 'error'
          })
          return;
        }
        if(!this.password){
          this.$refs.uToast.show({
            title: '请输入密码',
            type: 'error'
          })
          return;
        }
        mobilePassWordLogin({mobile:this.mobile,password:this.password}).then((res) => {
          let data = res.data;
          let token = data.token;
          if (res.code === 0) {
            this.$u.toast("登陆成功")
            uni.hideLoading();
            jwt.setAccessToken(token);
            jwt.refreshMemberInfo();
            jwt.setLogin(true);
            console.log(jwt.getAccount() + ' -- ' + jwt.getPassword())
            this.getMemberInfo()
            setTimeout(() => {
              uni.switchTab({
                url:'/pages/tabbar/mine/index'
              })
            }, 900);
          }else{
            uni.showModal({
              showCancel: false,
              title: '登录失败',
              content: res.msg,
            });
          }
        }).catch((error) => {
          this.loading = false;
          console.error(error);
        });
      }else {
        if(!this.mobile){
          this.$refs.uToast.show({
            title: '请输入手机号',
            type: 'error'
          })
          return;
        }
        if(!this.code){
          this.$refs.uToast.show({
            title: '请输入验证码',
            type: 'error'
          })
          return;
        }
        mobileSmsCodeLogin({mobile:this.mobile,code:this.code}).then((res) => {
          let data = res.data;
          let token = data.token;
          console.info(res.msg)
          if (res.code === 0) {
            this.$u.toast("登陆成功")
            uni.hideLoading();
            jwt.setAccessToken(token);
            jwt.refreshMemberInfo();
            jwt.setLogin(true);
            console.log(jwt.getAccount() + ' -- ' + jwt.getPassword())
            this.getMemberInfo()
            setTimeout(() => {
              uni.switchTab({
                url:'/pages/tabbar/mine/index'
              })
            }, 900);
          }else{
            uni.showModal({
              showCancel: false,
              title: '登录失败',
              content: res.msg,
            });
          }
        }).catch((error) => {
          this.loading = false;
          console.error(error);
        });
      }
      uni.hideLoading();
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
  padding-right: 10px;
  font-size: 15px;
  position: relative;
  height: 30px;
  line-height: 30px;
}
.cu-form-group uni-input {
  flex: 1;
  font-size: 10px;
  color: #555;
  padding-right: 10px;
}
.send-msg {
  border-radius: 30px;
  color: black;
  background: white;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
}

.container {
  top: 0;
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
    background: #e10a07;
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
  padding: 0 10px;
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
    color: #303133;
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
  left: 0;
  margin-top: 30px;
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
.other-login{
  display: flex;
  width: 80%;
  background: #ffff;
  height: 20px;
  margin: 0 auto;
  background-size: cover;
  position: relative;
  justify-content: center;
  align-items: center;
  .other{
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      /*关键点：设置和背景颜色一样的颜色。*/
      background:#ffff;
      padding:0px 20px;
      color: grey;
    }
  }
  .line{
    display: inline-block;
    width: 100%;
    border: 1px solid whitesmoke;
    background: whitesmoke;
    position: absolute;
  }
}
.other-img{
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
