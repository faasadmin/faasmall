<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="wrapper">
      <u-toast ref="uToast" />
      <view class="logo">
        <image src="/static/logo.png"></image>
      </view>
      <view class="input-content">
        <view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
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
        <view class="cu-form-group" style="border: 1px solid whitesmoke;border-radius: 30px">
          <view class="title">密&nbsp;&nbsp;&nbsp;码</view>
          <input
              type="password"
              placeholder="请输入密码"
              maxlength="20"
              :value="password"
              data-key="password"
              @confirm="toLogin"
              @input="inputChange"
          />
          <text class="send-msg" @click="forget">忘记密码</text>
        </view>
      </view>
      <button :class="mobile&&password?'confirm-btn':'confirm-btn1'" @click="toLogin">登录</button>
      <view style="margin-top: 32px;text-align: center">
        <view>没有账号？
          <text style="color: #e10a07" @click="register()">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mobilePassWordLogin} from "../../../faasmall/api/login";
import store from "../../../faasmall/store";
//import { createNamespacedHelpers } from 'vuex'
//const { mapState, mapActions, mapMutations } = createNamespacedHelpers('user');
//import tool from '../../../common/tool'
var tool = require('../../../faasmall/common/tool.js');
import { mapActions } from 'vuex';
import jwt from '@/faasmall/utils/cache/jwt.js';
import {silentLogin} from "@/faasmall/utils/auth/auth";
import {isNotEmpty} from "@/faasmall/utils/faasmall";

export default {
  data() {
    return {
      mobile: jwt.getAccount(),
      password: jwt.getPassword(),
    }
  },
  // computed: {
  //   ...mapState(['Login'])
  // },
  onShow(){

  },
  onLoad(){

  },
  methods: {
    ...mapActions(['Login']),
    forget() {
      uni.navigateTo({
        url: '/pages/login/forgotPwd'
      });
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
      debugger
      //this.$store.dispatch("user/Login", {mobile:this.mobile,password:this.password}).then((res) => {
      this.Login( {mobile:this.mobile,password:this.password}).then((res) => {
        let data = res.data;
        let token = data.token;
        console.info(res.msg)
        if (res.code === 0) {
          this.$u.toast("登陆成功")
          debugger
          uni.hideLoading();
          jwt.setAccessToken(token);
          jwt.refreshMemberInfo();
          jwt.setAccount(this.mobile);
          jwt.setPassword(this.password);
          console.log(jwt.getAccount() + ' -- ' + jwt.getPassword())
          setTimeout(() => {
            uni.switchTab({
              url:'/pages/tabbar/mine/index',
              success: (res) => {
                let page = getCurrentPages().pop();;
                 if (page == undefined || page == null) {
                    return;
                 }
                 page.refresh();
              }
            })
            // uni.reLaunch({
            //   url: '/pages/tabbar/main/index'
            // });
          }, 500);
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
</style>
