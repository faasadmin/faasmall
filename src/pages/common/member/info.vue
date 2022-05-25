<!-- 个人信息 -->
<template>
  <view>
    <view class="u-flex u-row-between info-head" style="padding:0 20rpx;">
      <view class="info-title">基本信息</view>
      <view class="u-flex u-row-between">
        <u-button size="mini" type="error" :class="{ 'dis-btn': editDisabled }" :disabled="editDisabled" @click="editInfo">保存</u-button>
      </view>
    </view>
    <view class="user-list u-flex u-row-between">
      <text class="list-name">头像</text>
      <view class="u-flex" @tap="onChooseImg">
        <image class="avatar" :src="userData.avatar" mode=""></image>
        <text class="iconfont icon-page-next1 u-m-l-20" style="color:#999;"></text>
      </view>
    </view>
    <view class="user-list u-flex u-row-between">
      <text class="list-name">昵称</text>
      <view class="u-flex">
        <input
            class="list-val"
            v-model="userData.nickName"
            @input="onChangeNickName"
            @blur="onChangeNickName"
            @confirm="onChangeNickName"
            placeholder="请输入昵称~"
            maxlength="50"
            placeholder-style="color:#c8c9cc;fontSize:28rpx"
        />
        <text class="iconfont icon-page-next1 u-m-l-20" style="color:#999;"></text>
      </view>
    </view>
    <view class="user-list  u-flex u-row-between u-m-b-10" @tap="showCalendar = true">
      <text class="list-name">生日</text>
      <view class="u-flex">
        <text class="list-val">{{ userData.birthday || '请选择生日~' }}</text>
        <text class="iconfont icon-page-next1 u-m-l-20" style="color:#999;"></text>
      </view>
    </view>

    <view class="user-list u-flex u-row-between" @tap="$Router.push('/pages/common/address/list')">
      <text class="list-name">地址管理</text>
      <view class="u-flex">
        <text class="list-val"></text>
        <text class="iconfont icon-page-next1 u-m-l-20" style="color:#999;"></text>
      </view>
    </view>
    <view class="user-list u-flex u-row-between" @tap="changePwd">
      <text class="list-name">修改密码</text>
      <view class="u-flex">
        <text class="list-val"></text>
        <text class="iconfont icon-page-next1 u-m-l-20" style="color:#999;"></text>
      </view>
    </view>
    <view class="user-list u-flex u-row-between" @tap="bindMobile">
      <text class="list-name">手机号</text>
      <view class="u-flex">
        <text class="list-val">{{ memberInfo.mobile || '暂未绑定手机号' }}</text>
        <text v-if="memberInfo.id && !memberInfo.mobileBind" class="iconfont icon-page-next1 u-m-l-20" style="color:#999;"></text>
        <text v-else class="u-iconfont uicon-checkmark-circle-fill u-m-l-20" style="color:#09BB07;"></text>
      </view>
    </view>

    <!-- 第三方账号 -->
    <view class="other-account" v-if="platform !== 'h5'">
      <view class="head-title">第三方账号绑定</view>
      <!-- #ifdef MP-WEIXIN  -->
      <!-- 微信小程序 -->
      <view v-if="platform === 'wx_ma_program'" class="account-list u-flex u-row-between">
        <view class=" u-flex u-col-center">
          <image class="list-img" :src="$FILE_URL + '/file/img/common/bind_mall.png'" mode=""></image>
          <text class="list-name">微信小程序</text>
        </view>
        <view class="u-flex u-col-center">
          <view class="info u-flex u-col-center">
            <open-data class="avatar u-m-r-20" type="userAvatarUrl"></open-data>
            <open-data class="name" type="userNickName"></open-data>
          </view>
          <view class="bind-box u-m-l-20">
            <button class="u-reset-button bind-btn" v-if="memberInfo.id && !memberInfo.wxMiniProgramBind" @tap="bindThirdOauth('wx_ma_program', 'wechat')">
              绑定
            </button>
            <button class="u-reset-button relieve-btn" v-else @tap="unbindThirdOauth('wx_ma_program')">解绑</button>
          </view>
        </view>
      </view>
      <!-- #endif  -->

      <!-- #ifdef H5  -->
      <!-- 微信公众号 -->
      <view v-if="platform === 'wx_mp_account'" class="account-list u-flex u-row-between">
        <view class=" u-flex u-col-center">
          <image class="list-img" :src="$FILE_URL + '/file/img/common/bind_mp.png'" mode=""></image>
          <text class="list-name">微信公众号</text>
        </view>
        <view class="u-flex u-col-center">
          <view class="info u-flex u-col-center" v-if="thirdOauthInfo">
            <image class="avatar u-m-r-20" :src="thirdOauthInfo.avatar" mode=""></image>
            <view class="name">{{ thirdOauthInfo.nickName }}</view>
          </view>
          <view class="bind-box u-m-l-20">
            <button class="u-reset-button bind-btn" v-if="memberInfo.id && !memberInfo.wxMpAccountBind" @tap="bindThirdOauth('wx_mp_account', 'wechat')">
              绑定
            </button>
            <button class="u-reset-button relieve-btn" v-else @tap="unbindThirdOauth('wx_mp_account')">解绑</button>
          </view>
        </view>
      </view>
      <!-- #endif  -->

      <!-- #ifdef APP-PLUS  -->
      <!-- app -->
      <view v-if="platform === 'app'" class="account-list u-flex u-row-between">
        <view class=" u-flex u-col-center">
          <image class="list-img" :src="$FILE_URL + '/file/img/common/bind_wx.png'" mode=""></image>
          <text class="list-name">微信</text>
        </view>
        <view class="u-flex u-col-center">
          <view class="info u-flex u-col-center" v-if="thirdOauthInfo">
            <image class="avatar u-m-r-20" :src="thirdOauthInfo.avatar" mode=""></image>
            <view class="name">{{ thirdOauthInfo.nickName }}</view>
          </view>
          <view class="bind-box u-m-l-20">
            <button class="u-reset-button bind-btn" v-if="memberInfo.id && !memberInfo.wxAppBind" @tap="bindThirdOauth('app', 'wechat')">绑定</button>
            <button class="u-reset-button relieve-btn" v-else @tap="unbindThirdOauth('app')">解绑</button>
          </view>
        </view>
      </view>
      <!-- #endif  -->
    </view>

    <view class="btn-box u-flex u-row-center u-col-center mt-5">
      <view style="width: 100%;padding: 0 40rpx">
        <u-button type="error" shape="square" size="default" @click="showModal = true">退出登录</u-button>
      </view>
    </view>

    <!-- 更新信息 -->
    <faasmall-auth-modal v-if="authType"></faasmall-auth-modal>

    <!-- 日历 -->
    <u-picker
        @confirm="changeCalendar"
        mode="time"
        confirm-color="#FF0505"
        v-model="showCalendar"
        :params="{ year: true, month: true, day: true, hour: false, minute: false, second: false }"
    ></u-picker>
    <!-- modal -->
    <u-modal
        ref="uModal"
        v-model="showModal"
        :show-cancel-button="true"
        confirm-color="#F54141"
        cancel-color="#666666"
        @confirm="logOut"
        content="确定退出登录？"
    ></u-modal>
  </view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import Auth from '@/faasmall/common/permission/index.js';
import wechat from '@/faasmall/common/wechat/wechat';
import {
  getMemberThirdOauthInfo,
  getThirdOauthInfo,
  unbindMemberThirdOauthInfo,
  updateMember
} from "@/faasmall/api/member";
import jwt from "@/faasmall/utils/cache/jwt";

export default {
  components: {},
  data() {
    const _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      platform: this.$platform.get(),
      userData: {},
      showCalendar: false,
      showModal: false,
      editDisabled: true,
      thirdOauthInfo: null //第三方信息
    };
  },
  computed: {
    ...mapGetters(['memberInfo', 'authType'])
  },
  onLoad() {
    this.userData = JSON.parse(JSON.stringify(this.memberInfo));
    this.getThirdOauthInfo();
  },
  methods: {
    ...mapActions(['getMemberInfo', 'showAuthModal', 'LogOut']),
    // 选择日期
    changeCalendar(e) {
      this.userData.birthday = `${e.year}-${e.month}-${e.day}`;
      this.editDisabled = this.userData.birthday === this.memberInfo.birthday;
    },
    // 修改密码
    changePwd() {
      this.showAuthModal('changePwd');
    },
    // 修改昵称
    onChangeNickName() {
      this.editDisabled = this.userData.nickName === this.memberInfo.nickName;
    },
    // 修改手机号
    bindMobile() {
      !this.memberInfo.mobileBind && this.showAuthModal('bindMobile');
    },
    // 更换头像
    async onChooseImg() {
      let authState = 0;
      authState += await new Auth('writePhotosAlbum').check();
      debugger
      if (authState < 1) return;
      authState += await new Auth('camera').check();
      if (authState < 2) return;
      const chooseImageRes = await this.chooseImage(1);
      const uploadImageRes = await this.uploadImage(chooseImageRes[0]);
      debugger
      this.userData.avatar = uploadImageRes.previewUrl;
      this.userData.fileUrl = uploadImageRes.previewUrl;
      this.editDisabled = this.userData.avatar === this.memberInfo.avatar;
    },
    // 第三方绑定信息
    getThirdOauthInfo() {
      let that = this;
      getMemberThirdOauthInfo().then(res => {
          if (res.code === 0) {
            that.thirdOauthInfo = res.data;
          }
      });
    },
    // 解绑
    unbindThirdOauth(platform) {
      let that = this;
      unbindMemberThirdOauthInfo({platform:platform}).then(res => {
        if (res.code === 0) {
          uni.showToast({
            title: res.msg
          });
          that.thirdOauthInfo = null;
          that.getMemberInfo();
        }
      });
    },
    // 绑定
    async bindThirdOauth(platform, provider) {
      let that = this;
      switch (platform) {
        case 'wx_mp_account':
          wechat.bind();
          break;
        case 'wx_ma_program':
          await wechat.bind();
          that.getMemberInfo();
          break;
        case 'app':
          if (provider === 'wechat') {
            await wechat.bind();
          }
          that.getMemberInfo();
          that.getThirdOauthInfo();
          break;
      }
    },
    // 退出登录
    async logOut() {
      await this.LogOut().then(res => {
        jwt.logout();
        this.$Router.back();
        // setTimeout(() => {
        //   uni.switchTab({
        //     url: '/pages/tabbar/main/index'
        //   })
        // }, 30);
      })
    },
    // 修改信息
    editInfo() {
      let that = this;
      if (!that.userData.nickName) {
        this.$u.toast('昵称不能为空');
        return false;
      }
      updateMember({
        nickName: that.userData.nickName,
        birthday: that.userData.birthday,
        avatar: that.userData.fileUrl
      }).then(res => {
        debugger
        if (res.code === 0) {
          that.getMemberInfo();
          that.editDisabled = true;
          that.$u.toast('保存成功');
        }
      });
    },
    async chooseImage(count = 1) {
      return new Promise((resolve, reject) => {
        uni.chooseImage({
          count: count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: res => {
            debugger
            resolve(res.tempFilePaths);
          }
        });
      }).catch(e => {
        console.log(e);
      });
    },
    // 图片处理-上传图片
    async uploadImage(url) {
      const that = this;
      return new Promise((resolve, reject) => {
        that.$u.toast('上传中...');
        console.info(that.$store.state.faasmall.shopData?.domain);
        debugger
        uni.uploadFile({
          url: that.$store.state.faasmall.shopData?.domain + '/api/plugins/faas-mall-addons/api/common/upload',
          filePath: url,
          name: 'file',
          header: {
            'Authorization': "Bearer " +  jwt.getAccessToken()
          },
          formData: {
            type: 'member_avatar' // 后端接口要求的名称
          },
          success: res => {
            res = JSON.parse(res.data);
            if (res.code === 0) {
              that.$u.toast('上传成功');
              resolve(res.data);
            } else {
              that.$u.toast('上传失败');
            }
          },
          complete: e => {
            uni.hideLoading();
          }
        });
      }).catch(e => {
        console.log(e);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 基本信息
.info-head {
  .info-title {
    line-height: 70rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
  }
  .save-btn {
    color: #fff;
    background: #FF0505;
    width: 100rpx;
    border-radius: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
  }
  .dis-btn {
    opacity: 0.5;
  }
}
// 三方
.other-account {
  .head-title {
    padding:0 20rpx;
    line-height: 82rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
  }
  .list-img {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
  }
  .account-list {
    background-color: #fff;
    height: 100rpx;
    padding: 0 20rpx;
    .info {
      .avatar {
        width: 38rpx;
        height: 38rpx;
        border-radius: 50%;
        overflow: hidden;
      }
      .name {
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
      }
    }
    .bind-box {
      .bind-btn {
        padding: 0 20rpx;
        line-height: 60rpx;
        background: #f5f6f8;
        border-radius: 20rpx;
        color: #999;
      }
      .relieve-btn {
        border-radius: 20rpx;
        padding: 0 20rpx;
        line-height: 60rpx;
        background: rgba(#ff0000, 0.05);
        color: #ff0000;
      }
    }
  }
}
.user-list {
  background: #fff;
  height: 100rpx;
  border-bottom: 1rpx solid #f6f6f6;
  padding: 0 20rpx;
  .list-name {
    font-size: 28rpx;
  }
  .avatar {
    width: 67rpx;
    height: 67rpx;
    border-radius: 50%;
  }
  .list-val {
    color: #999;
    font-size: 28rpx;
    text-align: right;
  }
}

</style>
