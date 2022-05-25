<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="wrapper">
      <u-toast ref="uToast" />
      <view class="logo">
        <image src="/static/logo.png"></image>
      </view>
      <view  class="input-content">
        <view class="cu-form-group" style="border: 1px solid whitesmoke;border-radius: 30px;display: flex">
          <view class="title">手机号</view>
          <u-input
              style="flex: 1"
              type="number"
              v-model="forgot.data.mobile"
              @blur="checkValue($event, 'mobile')"
              @input="mobileInput($event, 'mobile')"
              placeholder="请输入手机号"
          />
        </view>
        <view class="message-error">{{ forgot.error.mobile || '' }}</view>
        <view class="cu-form-group" style="border: 1px solid whitesmoke;border-radius: 30px">
          <text class="title">验证码</text>
          <u-input type="number" style="flex: 2"
                 v-model="forgot.data.code" placeholder="请输入验证码"
                 @blur="checkValue($event, 'code')"
                 @input="checkValue($event, 'code')"
          />
          <button class="u-reset-button code-btn code-btn-start"
                  :class="{ 'code-btn-end': forgot.data.isMobileEnd }"
                  @click="sendCode" :disabled="!forgot.data.isMobileEnd">{{codeText}}</button>
        </view>
        <view class="message-error">{{ forgot.error.code || '' }}</view>
        <view class="cu-form-group" style="border: 1px solid whitesmoke;border-radius: 30px;display: flex">
          <view class="title">密码</view>
          <u-input
              style="flex: 1"
              type="password"
              v-model="forgot.data.password"
              @blur="checkValue($event, 'password')"
              @input="checkValue($event, 'password')"
              placeholder="请输入新密码"
          />
        </view>
        <view class="message-error">{{ forgot.error.password || '' }}</view>
      </view>
      <button :class="(forgot.data.mobile&&forgot.data.code&&forgot.data.password)?'confirm-btn':'confirm-btn1'" @click="resetPassword">重置密码</button>
    </view>
  </view>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {getRegisterCode} from "@/faasmall/api/register";
import {memberForgotPwd} from "@/faasmall/api/member";
import {forgotPwd} from "@/faasmall/api/login";
import validate from "@/faasmall/utils/validate";
import schema from "uview-ui/libs/util/async-validator";
export default {
  data() {
    return {
      protocol: false, //是否同意隐私协议
      platform: this.$platform.get(),
      codeText: '获取验证码',
      disabledCode: false,
      count: 60,
      accountLogin:true,
      // 绑定手机号
      forgot: {
        data: {
          mobile: '', //手机号
          code: '', //验证码
          password:'',//密码
          isMobileEnd: false // 手机号输入完毕
        },
        rules: {
          code: validate.code,
          mobile: validate.mobile,
          password: validate.password
        },
        error: {
          mobile: '', //手机号
          code: '', //验证码
          password:''
        }
      },
    }
  },
  computed: {
    ...mapGetters(['shopData']),
  },
  methods: {
    ...mapActions(['Login','getMemberInfo','getMemberData']),
    // 检测
    checkValue(e, key) {
      this.validation(key);
    },
    // 校验数据
    validation(key, callback = () => {}) {
      debugger
      let that = this;
      //拿到需要校验的数据
      let fieldValue = this.forgot.data[key];
      //拿到需要检验的规则
      let rules = this.forgot.rules[key];
      // 判空
      if (!rules || rules.length === 0) {
        return callback('');
      }
      // 设置当前的装填，标识为校验中
      let validateState = 'validating';
      // 调用async-validator的方法
      let validator = new schema({
        [key]: rules
      });
      // 校验
      validator.validate(
          {
            [key]: fieldValue
          },
          {
            firstFields: true
          },
          (errors, fields) => {
            // 记录状态和报错信息
            validateState = !errors ? 'success' : 'error';
            debugger
            let validateMessage = errors ? errors[0].message : '';
            that.forgot.error[key] = validateMessage;
            callback(validateMessage);
          }
      );
    },
    // 校验全部数据
    validateAll(callback) {
      let that = this;
      return new Promise(resolve => {
        // 对当前所有表单检验
        let valid = true; // 默认通过
        let count = 0; // 用于标记是否检查完毕
        let errorArr = []; // 存放错误信息
        let curFormData = that.forgot.data;
        debugger
        Object.keys(curFormData).map(field => {
          console.info(field + '+-+-');
          ++count;
          that.validation(field, error => {
            // 如果回调有error
            if (error) {
              valid = false;
              errorArr.push(error);
            }
            if (count === Object.keys(curFormData).length) {
              resolve(valid);
              if (errorArr.length) {
                this.$u.toast(errorArr[0]);
              }
              if (typeof callback == 'function'){
                callback(valid);
              }
            }
          });
        });
      });
    },
    // 手机号是否输入完毕
    mobileInput(e, key) {
      this.forgot.data.isMobileEnd = this.$u.test.mobile(this.forgot.data.mobile);
      this.validation(key);
    },
    //获取验证码
    sendCode() {
      const that = this;
      debugger
      if (that.forgot.data.isMobileEnd && !that.disabledCode) {
        getRegisterCode({
          mobile: that.forgot.data.mobile,
          scene:3,
          templateCode: 0
        }).then(res => {
          if (res.code === 0) {
            that.codeChange();
            that.$u.toast('验证码已发送，请注意查收短信');
          } else {
            that.$u.toast(res.msg);
          }
        });
      } else {
        that.$u.toast('请稍后再试');
      }
    },
    codeChange() {
      if (this.disabledCode) return;
      this.disabledCode = true;
      let n = 10;
      this.codeText = n + 's';
      const run = setInterval(() => {
        n -= 1;
        if (n < 0) {
          clearInterval(run);
        }
        this.codeText = n + 's';
        if (this.codeText < 0 + 's') {
          this.disabledCode = false;
          this.codeText = '重新获取';
        }
      }, 1000);
    },
    register() {
      uni.navigateTo({
        url: '/pages/common/register/index'
      });
    },
    navBack() {
      uni.navigateBack();
    },
    // 规则校验
    validateSubmit() {
      return this.validateAll();
    },
    async resetPassword(){
      let that = this;
      (await that.validateSubmit()) && forgotPwd({
        mobile: this.forgot.data.mobile,
        code: this.forgot.data.code,
        password: this.forgot.data.password}).then(res => {
        if (res.code === 0) {
          that.$u.toast('密码重置成功');
          setTimeout(() => {
            uni.redirectTo({
              url: "pages/common/login/index"
            });
          }, 900);
        }
      }).catch(error => {
        console.error(error);
      });
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
.message-error{
  display: flex;
  align-items: center;
  padding: 10px 10px;
  color: red;
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
  display: flex;
  align-items: center;
  padding: 0 10px !important;
  height: 30px;
  border-radius: 25px;
}
.code-btn-end {
  opacity: 1 !important;
}
.code-btn[disabled] {
  background-color: #fff;
}
.code-btn-start {
  width: 160rpx !important;
  line-height: 56rpx !important;
  border: 1rpx solid #FF0505 !important;
  border-radius: 28rpx;
  font-size: 26rpx;
  font-weight: 400;
  color: #FF0505 !important;
  opacity: 0.5;
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
.u-reset-button {
  padding: 0;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  background-color: transparent;
  color: inherit;
  transform: translate(0rpx, 0rpx);
}
.u-reset-button.button-hover {
  transform: translate(1upx, 1upx);
}

.u-reset-button::after {
  border: none;
}
/* end--去除button的所有默认样式--end */
</style>
