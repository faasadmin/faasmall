<!--登陆弹框-->
<template>
  <view class="cu-modal bottom-modal" :class="{ show: showAuth }" @tap="closeAuthModal" style="z-index: 10080;">
    <view class="login-wrap cu-dialog form-wrap  safe-area-inset-bottom" @tap.stop style="border-radius: 20rpx 20rpx 0 0;">
      <!-- 忘记密码 -->
      <view v-if="authType === 'forgotPwd'">
        <view class="head-box u-m-b-60">
          <view class="head-title u-m-b-20">忘记密码</view>
          <view class="head-subtitle">为了您的账号安全，修改密码前请先进行安全验证</view>
        </view>
        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">手机号</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'mobile')"
                @input="mobileInput($event, 'mobile')"
                :placeholderStyle="placeholderStyle"
                v-model="form['forgotPwd'].data.mobile"
                type="number"
            ></u-input>
            <button
                class="u-reset-button code-btn code-btn-start"
                :disabled="!form['forgotPwd'].data.isMobileEnd"
                :class="{ 'code-btn-end': form['forgotPwd'].data.isMobileEnd }"
                @tap="getSmsCode(3)"
            >
              {{ codeText }}
            </button>
          </view>
          <view class="message-error">{{ form['forgotPwd'].error.mobile || '' }}</view>
        </view>

        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">验证码</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'code')"
                @input="checkValue($event, 'code')"
                placeholder="请输入验证码"
                :placeholderStyle="placeholderStyle"
                v-model="form['forgotPwd'].data.code"
                type="number"
            ></u-input>
          </view>
          <view class="message-error">{{ form['forgotPwd'].error.code || '' }}</view>
        </view>

        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">密码</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'password')"
                @input="checkValue($event, 'password')"
                placeholder="请输入密码"
                :placeholderStyle="placeholderStyle"
                v-model="form['forgotPwd'].data.password"
                type="password"
            ></u-input>
            <button class="u-reset-button login-btn-start" @tap="forgotPwdSubmit">确认</button>
          </view>
          <view class="message-error">{{ form['forgotPwd'].error.password || '' }}</view>
        </view>
        <button v-if="!isLogin" class="u-reset-button type-btn" @tap="showAuthModal('accountLogin')">返回登录</button>
      </view>

      <!-- 绑定手机号 -->
      <view v-if="authType === 'bindMobile'">
        <view class="head-box u-m-b-60">
          <view class="head-title u-m-b-20">绑定手机号</view>
          <view class="head-subtitle">为了您的账号安全，请绑定手机号</view>
        </view>
        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">手机号</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'mobile')"
                @input="mobileInput($event, 'mobile')"
                placeholder="请输入手机号"
                :placeholderStyle="placeholderStyle"
                v-model="form['bindMobile'].data.mobile"
                type="number"
            ></u-input>
            <button
                class="u-reset-button code-btn code-btn-start"
                :disabled="!form['bindMobile'].data.isMobileEnd"
                :class="{ 'code-btn-end': form['bindMobile'].data.isMobileEnd }"
                @tap="getSmsCode(6)"
            >
              {{ codeText }}
            </button>
          </view>
          <view class="message-error">{{ form['bindMobile'].error.mobile || '' }}</view>
        </view>
        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">验证码</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'code')"
                @input="checkValue($event, 'code')"
                placeholder="请输入验证码"
                :placeholderStyle="placeholderStyle"
                v-model="form['bindMobile'].data.code"
                type="number"
            ></u-input>
            <button class="u-reset-button login-btn-start" @tap="bindMobileSubmit">立即绑定</button>
          </view>
          <view class="message-error">{{ form['bindMobile'].error.code || '' }}</view>
        </view>
      </view>

      <!-- 修改密码 -->
      <view v-if="authType === 'changePwd'">
        <view class="head-box u-m-b-60">
          <view class="head-title u-m-b-20">修改密码</view>
          <view class="head-subtitle"></view>
        </view>
        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">旧密码</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'oldPassword')"
                @input="checkValue($event, 'oldPassword')"
                placeholder="请输入旧密码"
                :placeholderStyle="placeholderStyle"
                v-model="form['changePwd'].data.oldPassword"
                type="password"
            ></u-input>
          </view>
          <view class="message-error">{{ form['changePwd'].error.oldPassword || '' }}</view>
        </view>
        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">新密码</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'newPassword')"
                @input="checkValue($event, 'newPassword')"
                placeholder="请输入新密码"
                :placeholderStyle="placeholderStyle"
                v-model="form['changePwd'].data.newPassword"
                type="password"
            ></u-input>
          </view>
          <view class="message-error">{{ form['changePwd'].error.newPassword || '' }}</view>
        </view>
        <view class="form-item u-border-bottom">
          <view class="item-content u-flex u-col-center">
            <view class="item-title">确认密码</view>
            <u-input
                class="u-m-r-10 u-flex-1"
                @blur="checkValue($event, 'reNewPassword')"
                @input="checkValue($event, 'reNewPassword')"
                placeholder="再次输入新密码"
                :placeholderStyle="placeholderStyle"
                v-model="form['changePwd'].data.reNewPassword"
                type="password"
            ></u-input>
          </view>
          <view class="message-error">{{ form['changePwd'].error.reNewPassword || '' }}</view>
        </view>
        <view class="editPwd-btn-box u-m-t-80">
          <button class="u-reset-button save-btn" @tap="changePwdSubmit">保存</button>
          <button class="u-reset-button forgot-btn" @tap="showAuthModal('forgotPwd')">忘记密码</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import validate from '@/faasmall/utils/validate';
import schema from 'uview-ui/libs/util/async-validator';
import wechat from '@/faasmall/common/wechat/wechat';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import {doRegister, getRegisterCode} from "@/faasmall/api/register";
import {mobilePassWordLogin, namePassWordLogin, smsCodelogin} from "@/faasmall/api/login";
import {memberBindMobile, memberChangePwd, memberForgotPwd} from "@/faasmall/api/member";
import jwt from "@/faasmall/utils/cache/jwt";

export default {
  name: 'faasmallAuthModal',
  data() {
    return {
      platform: this.$platform.get(),
      device: this.$platform.device(),
      form: {
        // 忘记密码
        forgotPwd: {
          data: {
            mobile: '', //手机号
            code: '', //验证码
            password: '', //密码
            isMobileEnd: false // 手机号输入完毕
          },
          rules: {
            mobile: validate.mobile,
            code: validate.code,
            password: validate.password
          },
          error: {
            mobile: '', //手机号
            code: '', //验证码
            password: '' //密码
          }
        },
        // 绑定手机号
        bindMobile: {
          data: {
            mobile: '', //手机号
            code: '', //验证码
            isMobileEnd: false // 手机号输入完毕
          },
          rules: {
            code: validate.code,
            mobile: validate.mobile
          },
          error: {
            mobile: '', //手机号
            code: '' //验证码
          }
        },
        // 修改密码
        changePwd: {
          data: {
            oldPassword: '', //旧密码
            newPassword: '', //新密码
            reNewPassword: '' //确认密码
          },
          rules: {
            oldPassword: validate.password,
            newPassword: validate.password,
            reNewPassword: [
              {
                required: true,
                message: '请重新输入密码',
                trigger: ['change', 'blur']
              },
              {
                validator: (rule, value, callback) => {
                  return value === this.form.changePwd.data.newPassword;
                },
                message: '两次输入的密码不一致',
                trigger: ['change', 'blur']
              }
            ]
          },
          error: {
            oldPassword: '', //旧密码
            newPassword: '', //新密码
            reNewPassword: '' //确认密码
          }
        }
      },
      codeText: '获取验证码',
      disabledCode: false,
      placeholderStyle: 'font-size: 30rpx; font-weight: 500;color:#C2C7CF;'
    };
  },

  computed: {
    ...mapGetters(['shopData', 'isLogin', 'authType']),
    showAuth: {
      get() {
        return !!this.authType;
      },
      set(value) {
        value ? uni.hideTabBar() : uni.showTabBar();
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['getMemberInfo', 'showAuthModal']),
    // 检测
    checkValue(e, key) {
      this.validation(key);
    },
    // 校验数据
    validation(key, callback = () => {}) {
      let that = this;
      //拿到需要校验的数据
      let fieldValue = this.form[this.authType].data[key];
      //拿到需要检验的规则
      let rules = this.form[this.authType].rules[key];
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
            that.form[that.authType].error[key] = validateMessage;
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
        let curFormData = that.form[that.authType].data;
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
      this.form[this.authType].data.isMobileEnd = this.$u.test.mobile(this.form[this.authType].data.mobile);
      this.validation(key);
    },
    closeAuthModal() {
      this.$store.dispatch('showAuthModal', '');
    },
    // 获取短信验证码
    getSmsCode(scene) {
      const that = this;
      if (that.form[this.authType].data.isMobileEnd && !that.disabledCode) {
        getRegisterCode({
          mobile: that.form[this.authType].data.mobile,
          scene:scene,
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
    // 倒计时
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
    // 规则校验
    validateSubmit() {
      return this.validateAll();
    },
    // 忘记密码
    async forgotPwdSubmit() {
      let that = this;
      (await that.validateSubmit()) && memberForgotPwd({
        mobile: that.form['forgotPwd'].data.mobile,
        code: that.form['forgotPwd'].data.code,
        password: that.form['forgotPwd'].data.password}).then(res => {
        if (res.code === 0) {
          that.$u.toast(res.msg);
          if (that.isLogin) {
            that.closeAuthModal();
          }
        }
      }).catch(error => {
        console.error(error);
      })
    },
    // 绑定手机
    async bindMobileSubmit() {
      let that = this;
      (await that.validateSubmit()) &&
      memberBindMobile({
        mobile: that.form['bindMobile'].data.mobile,
        code: that.form['bindMobile'].data.code,
        password: that.form['bindMobile'].data.password}).then(res => {
        if (res.code === 0) {
          that.$u.toast(res.msg);
          that.closeAuthModal();
          that.getMemberInfo();
        }
      }).catch(error => {
        console.error(error);
      })
    },
    // 修改密码
    async changePwdSubmit() {
      let that = this;
      (await that.validateSubmit()) &&
      memberChangePwd({
        oldPassword: that.form['changePwd'].data.oldPassword,
        newPassword: that.form['changePwd'].data.newPassword}).then(res => {
        if (res.code === 0) {
          that.closeAuthModal();
          that.$u.toast(res.msg);
          jwt.setPassword(that.form['changePwd'].data.newPassword);
          that.getMemberInfo();
        }
      }).catch(error => {
        console.error(error);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes title-animation {
  0% {
    font-size: 32rpx;
  }

  100% {
    font-size: 36rpx;
  }
}

.form-wrap {
  .form-item {
    display: flex;
    flex-direction: column;
    font-size: 28rpx;
    padding: 20rpx 0;
    color: $u-main-color;
    box-sizing: border-box;
    line-height: $u-form-item-height;
    width: 100%;
    .item-title {
      width: 140rpx;
      font-size: 30rpx;
      color: #333;
      font-weight: 600;
      text-align: left;
    }
    .message-error {
      text-align: left;
      font-size: 24rpx;
      line-height: 24rpx;
      color: $u-type-error;
      margin-top: 12rpx;
      margin-left: 120rpx;
    }
  }
}

.login-wrap {
  padding: 50rpx 34rpx;
  min-height: 700rpx;
  background-color: #fff;

  .head-box {
    .head-title {
      min-width: 160rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
      line-height: 36rpx;
    }
    .head-title-active {
      width: 160rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #999;
      line-height: 36rpx;
    }
    .head-title-animation {
      animation-name: title-animation;
      animation-duration: 0.1s;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
    }
    .head-title-line {
      position: relative;
      &::before {
        content: '';
        width: 1rpx;
        height: 34rpx;
        background-color: #e4e7ed;
        position: absolute;
        left: -30rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .head-subtitle {
      font-size: 26rpx;
      font-weight: 400;
      color: #c2c7cf;
      text-align: left;
      display: flex;
    }
  }
  .code-btn[disabled] {
    background-color: #fff;
  }

  .code-btn-start {
    width: 160rpx;
    line-height: 56rpx;
    border: 1rpx solid #FF0505;
    border-radius: 28rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #FF0505;
    opacity: 0.5;
  }

  .forgot-btn {
    width: 160rpx;
    line-height: 56rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #999;
  }

  .code-btn-end {
    opacity: 1 !important;
  }

  .login-btn-start {
    width: 158rpx;
    line-height: 56rpx;
    background: linear-gradient(90deg, #FF0505, #FF0505);
    border-radius: 28rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #ffffff;
  }

  .type-btn {
    padding: 20rpx;
    margin: 40rpx auto;
    width: 200rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #999999;
  }

  .auto-login-box {
    width: 100%;

    .auto-login-img {
      width: 68rpx;
      height: 68rpx;
      border-radius: 50%;
      margin: 0 30rpx;
    }
  }

  .agreement-box {
    margin: 80rpx auto 0;
    .protocol-check {
      transform: scale(0.7);
    }
    .agreement-text {
      font-size: 26rpx;
      font-weight: 500;
      color: #999999;

      .tcp-text {
        color: #FF0505;
      }
    }
  }
}

// 修改密码
.editPwd-btn-box {
  .save-btn {
    width: 690rpx;
    line-height: 70rpx;
    background: linear-gradient(90deg, #FF0505, #FF0505);
    border-radius: 35rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #ffffff;
  }
  .forgot-btn {
    width: 690rpx;
    line-height: 70rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #999999;
  }
}

/* ==================
         模态窗口
 ==================== */

.cu-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1110;
  opacity: 0;
  outline: 0;
  text-align: center;
  -faas-transform: scale(1.185);
  transform: scale(1.185);
  backface-visibility: hidden;
  perspective: 2000upx;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out 0s;
  pointer-events: none;
}

.cu-modal::before {
  content: "\200B";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.cu-modal.show {
  opacity: 1;
  transition-duration: 0.3s;
  -faas-transform: scale(1);
  transform: scale(1);
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;
}

.cu-dialog {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: auto;
  margin-right: auto;
  width: 680upx;
  max-width: 100%;
  background-color: #f8f8f8;
  border-radius: 10upx;
  overflow: hidden;
}

.cu-modal.bottom-modal::before {
  vertical-align: bottom;
}

.cu-modal.bottom-modal .cu-dialog {
  width: 100%;
  border-radius: 0;
}

.cu-modal.bottom-modal {
  margin-bottom: -1000upx;
}

.cu-modal.bottom-modal.show {
  margin-bottom: 0;
}

.cu-modal.drawer-modal {
  transform: scale(1);
  display: flex;
}

.cu-modal.drawer-modal .cu-dialog {
  height: 100%;
  min-width: 200upx;
  border-radius: 0;
  margin: initial;
  transition-duration: 0.3s;
}

.cu-modal.drawer-modal.justify-start .cu-dialog {
  transform: translateX(-100%);
}

.cu-modal.drawer-modal.justify-end .cu-dialog {
  transform: translateX(100%);
}

.cu-modal.drawer-modal.show .cu-dialog {
  transform: translateX(0%);
}

.cu-modal .cu-dialog>.cu-bar:first-child .action {
  min-width: 100rpx;
  margin-right: 0;
  min-height: 100rpx;
}
</style>
