<template>
  <view style="overflow: hidden;">
    <view style="display: flex;align-items: center;justify-content: center;flex-direction: column">
      <view v-if="status === 0" @click="toApply">
        <rich-text :nodes="distributionRecruitData.content"></rich-text>
      </view>
      <view v-else-if="status === 1" style="padding-top: 160rpx;">
        <image class="he-image" :src="$FILE_URL + '/file/img/distribution/distribution-already.png'"></image>
        <text>来晚了，商家已暂停招募</text>
        <button @click="toHome">去逛逛</button>
      </view>
      <view v-else-if="status === 3">
        <image class="he-image" :src="$FILE_URL + '/file/img/distribution/distribution-already.png'"></image>
        <text>您已是分销商，正在为您跳转分销商中心...</text>
      </view>
      <view v-else-if="status === 4">
        <image class="he-image" :src="$FILE_URL  + '/file/img/distribution/distribution-result.png'"></image>
        <text>您已提交申请，正在为您查看审核结果...</text>
      </view>
    </view>
  </view>
</template>

<script>
import {getDistributionApplySetting} from "@/faasmall/api/common";
import { mapGetters } from 'vuex';
import {applySubmit, recruit} from "@/faasmall/api/distribution";
import jwt from '@/faasmall/utils/cache/jwt.js';
import {cacheKey} from "@/faasmall/common/constant";
export default {
  name: "apply",
  data(){
    let _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      readComplete:false,
      status:0,
    }
  },
  onReady() {

  },
  //async onLoad(option){
  onLoad(option){
    this.status = this.distributionBasisData.status;
    debugger
    if(this.distributionBasisData.status === 1){
        this.loading = false;
        return;
    }
    if (this.memberInfo.distributionStatus === 3) {
      this.status = 3;
      this.loading = false;
      setTimeout(() => {
        uni.redirectTo({
          url: '/promoter/pages/index'
        });
      }, 2000);
    } else {
      if (this.isLogin) {
        if (option.scene || option.inviteId || this.memberInfo.distributionCenterShowStatus === 2) {
          // 普通用户 和 清退用户 通过海报可以再次获取招募令
          if (this.memberInfo.distributionStatus === 5 || this.memberInfo.distributionStatus === 0 || this.memberInfo.distributionStatus === 1 || this.memberInfo.distributionStatus === 7 || this.memberInfo.distributionStatus === 6) {
            let inviteId = undefined;
            if (option.inviteId) {
              inviteId = option.inviteId;
            } else if (option.scene) {
              const scene = decodeURIComponent(option.scene);
              inviteId = this.getSceneVariable(scene, 'inviteId');
            }
            // 接招募令
            //await this.applyRecruit(inviteId ? inviteId : 0);
            this.applyRecruit(inviteId ? inviteId : 0);
            let status = this.memberInfo.distributionStatus;
            debugger
            if (this.memberInfo.distributionStatus === 5) {
              status = 6;
            } else {
              status = 7;
            }
            this.$store.state.member.memberInfo.distributionStatus = status;
            let userIf = jwt.getUserInfo();
            debugger
            userIf.distributionStatus = status;
            jwt.setUserInfo(userIf);
          }
          // 待审核 已拒绝 用户去结果页面
          if (this.memberInfo.distributionStatus === 2 || this.memberInfo.distributionStatus === 4) {
            this.status = 4;
            this.loading = false;
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/common/distribution/apply'
              });
            }, 2000);
            return;
          }
        }
      }
      this.loading = false;
    }
  },
  computed:{
    ...mapGetters(['distributionBasisData','distributionRecruitData','isLogin',"memberInfo"])
  },
  onReachBottom() {
    this.readComplete = true;
  },
  methods:{
    applyRecruit(inviteId){
      return new Promise((resolve, reject) => {
        recruit({inviteId:inviteId ? inviteId : 0})
            .then(resolve)
            .catch(reject);
      });
    },
    toApply(){
      debugger
      if(this.readComplete){
        const { meetConditions, apply } = this.distributionBasisData;
        // 无需填写 没有条件 但是需要审核
        if (meetConditions === 1 && apply === 0) {
          applySubmit({applyContent:[]}).then(response => {
            const { status } = response.data.status;
            this.$store.state.memberInfo.distributionStatus = status;
            let userIf = jwt.getUserInfo();
            userIf.distributionStatus = status;
            jwt.setUserInfo(userIf);
            // 跳转分销申请结果页面
            uni.redirectTo({
              url: '/pages/common/distribution/apply'
            });
          });
        }else {
          uni.navigateTo({
            url: '/pages/common/distribution/apply'
          });
        }
      }
    },
    toHome(){
      uni.switchTab({
        url: '/pages/tabbar/main/index'
      });
    },
  }
}
</script>

<style scoped lang="scss">
.he-image{
  width: 100%;
}
</style>