<!--小程序授权登陆-->
<template>
  <view>
    <view class='header'>
      <image src='@/static/logo.png'></image>
    </view>
    <view class='content'>
      <view>申请获取以下权限</view>
      <text>获得你的公开信息(昵称，头像、地区等)</text>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <button v-if="canUseGetUserProfile" class="btn" type="primary" @click="getUserProfile">授权登录</button>
    <button v-else class="btn" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">授权登录</button>
    <!-- #endif -->
  </view>
</template>

<script>
import { updateToken} from '../../../faasmall/common/tool';
export default {
  data() {
    return {
      mobile: '',
      password:'',
      canUseGetUserProfile: false //判断api是否存在
    }
  },
  mounted() {
    if (uni.getUserProfile) {
      this.canUseGetUserProfile = true;
    }
  },
  onLoad(){

  },
  onLaunch: function() {
  	console.log('onLaunch')
  },
  methods: {
    getUserInfo() {
      let _this = this;
      uni.showLoading({ title: '正在登录中' });
      uni.login({
        success(res) {
          uni.getUserInfo({
            // #ifdef MP-WEIXIN
            lang: 'zh_CN', //头条不支持该字段
            // #endif
            success(userInfo) {
              userInfo.code = res.code;

			        console.log('数据：' + userInfo)
              _this.getLoginInfo(userInfo);
            },
            fail(err) {
              // 用户未曾授权
              uni.hideLoading();
              _this.open();
            }
          });
        },
        fail(res) {
          uni.hideLoading();
        }
      });
    },
    getLoginCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          success(res) {
            console.log('auth', res);
            resolve(res);
          },
          fail(err) {
            reject(err);
            uni.hideLoading();
          }
        });
      });
    },
    getUserProfile() {
      let _this = this;
      uni.getUserProfile({
        desc: '用于完善会员信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: async userInfo => {
          let res = await _this.getLoginCode();
          userInfo.code = res.code;

          _this.getLoginInfo(userInfo);
        },
        fail(err) {
          console.log('auth', err);
          // 用户未曾授权
          uni.hideLoading();
          _this.open();
        }
      });
    },
    getLoginInfo(userInfo) {
      // toLogin(userInfo, function(res) {
      //   console.log('返回数据：' + res);
      //   uni.hideLoading();
      // });
      this.$store.dispatch("user/Login", userInfo).then((res) => {
        let token = res.data.token;
        console.info(res.msg)
        if (res.code === 0) {
          let data = res.data;
          let token = data.token;
          // #ifdef  MP
          // 小程序授权信息
          updateToken(token, data, true)
          console.log('当前为小程序环境')
          // #endif
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
    },
  },

}
</script>
<style>
.header {
  margin: 90rpx 0 90rpx 50rpx;
  border-bottom: 1px solid #ccc;
  text-align: center;
  width: 650rpx;
  height: 300rpx;
  line-height: 450rpx;
}

.header image {
  width: 200rpx;
  height: 200rpx;
}

.content {
  margin-left: 50rpx;
  margin-bottom: 90rpx;
}

.content text {
  display: block;
  color: #9d9d9d;
  margin-top: 40rpx;
}

.bottom {
  border-radius: 80rpx;
  margin: 70rpx 50rpx;
  font-size: 35rpx;
}
</style>
