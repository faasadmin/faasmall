<template>
  <view>
    <u-toast ref="uToast" />
    <view v-if="loading" style="width:100%;height:100%;display: flex;align-items: center;justify-content: center">
      <u-loading mode="circle" v-if="loading"></u-loading>
    </view>
    <view v-else>
      <view v-if="memberInfo.distributionStatus === 6 || memberInfo.distributionStatus === 7 || isApplyAgain">
        <u-image :showLoading="true" :src="distributionOtherData.backgroundImage" height="360rpx" style="width: 100%;"></u-image>
        <!-- 满足条件   -->
        <view v-if="!isApply && meetConditions !== 1" style="margin: 10rpx 20rpx 20rpx 10rpx;padding: 10rpx 0 10rpx 0;background-color: #fff;display: flex;flex-direction: column;align-items: center">
          <view style="display: flex;align-items: center;margin-bottom: 24rpx;">
            <text class="faas-title">
              {{ !status ? '很遗憾，您暂未满足成为分销商的条件' : '恭喜您，您满足成为分销商的条件' }}
            </text>
          </view>
          <view style="color: #666666;line-height: 36rpx;">
            <view v-if="!status">
              <view v-if="meetConditions === 5">购买一件指定商品，方可申请成为分销商</view>
              <view v-else-if="meetConditions === 4"> 购买任意一件商品，方可申请成为分销商</view>
              <view v-else-if="meetConditions === 3 || meetConditions === 2">
                <view v-if="meetConditions === 3">
                  累计消费次数需达到
                  <text>{{ peak }}</text>
                </view>
                <view v-else-if="meetConditions === 2">
                  累计消费金额需达到
                  <text>￥{{ peak }}</text>
                </view>
                ，方可申请成为分销商
              </view>
            </view>
            <view v-else>
              <view v-if="meetConditions === 5">您已购买一件指定商品，可申请成为分销商</view>
              <view v-else-if="meetConditions === 4"> 您已购买任意一件商品，可申请成为分销商</view>
              <view v-else-if="meetConditions === 3 || meetConditions === 2">
                <view v-if="type === 3">
                  您的累计消费次数已达到
                  <text>{{ peak }}</text>
                </view>
                <view v-else-if="meetConditions === 2">
                  您的累计消费金额已达到
                  <text>￥{{ peak }}</text>
                </view>
                ，可申请成为分销商
              </view>
            </view>
          </view>
          <view>
            <view v-if="meetConditions === 3 || meetConditions === 2">
              <view style="margin-top: 56rpx;margin-bottom: 16rpx;width: 560rpx;height: 16rpx;background: #fef3f4;border-radius: 8rpx;">
                <view style="border-radius: 8rpx;height: 16rpx;width: 0;position: relative;background: #FF0505" :animation="animationProgress">
                  <view style="width: 40rpx;height: 40rpx;background: #FF0505;border: 8rpx solid #ffffff;box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.1);border-radius: 50%;position: absolute;right: 0;transform: translateY(-12px);"></view>
                </view>
              </view>
              <view style="width: 560px;height: 40px;color: #666666;flex: 1;display: flex;align-items: center"  :class="status ? 'justify-end' : 'justify-between'">
                <view>
                  已消费
                  <text>
                    <view v-if="meetConditions === 2"> ￥</view>
                    {{ status ? peak : count }}
                  </text>
                  <view v-if="meetConditions === 3"> 次</view>
                </view>
                <view v-if="!status">
                  <view v-if="meetConditions === 2"> ￥</view>
                  {{ peak }}
                </view>
              </view>
            </view>
          </view>
          <view style="display: flex;margin-top: 20rpx">
            <u-button shape="square"  type="primary" @click="toGood" v-if="!status">去逛逛</u-button>
            <u-button style="margin-left: 20rpx" shape="square"  type="warning" v-else @click="apply">立即申请</u-button>
          </view>
        </view>
        <!-- 申请信息   -->
        <view v-if="isApply && distributionBasisData.apply === 1" style="margin: 20rpx;background: #ffff;padding: 20rpx 30rpx ;overflow: hidden;">
          <view
              style="padding: 20rpx 30rpx"
              :style="[
              {
                lineHeight: isInvite ? '40rpx' : '80rpx'
              }
            ]"
          >
            欢迎加入【{{ shopData.shopName }}】，请填写申请信息<br>
            {{ isInvite ? '邀请人：faasmall' : '' }}
          </view>
          <view style="border-bottom: 2rpx solid #e5e5e5;height: 100rpx;display: flex;align-items: center" v-for="(item, index) in applyContent" :key="index">
            <view>{{ item.name }}</view>
            <input style="margin-left: 20rpx" type="text" v-model="item.value" :placeholder="`请输入${item.name}`" />
          </view>
          <view v-if="distributionBasisData.protocol === 0" style="margin: 32rpx 0 32rpx 0;color: #999999;display: flex;align-items: center">
            <faasmall-radio class="faas-radio" v-model="isAgree"></faasmall-radio>
            <text @click="isAgree = !isAgree">已阅读且同意协议</text>
            <view  style="padding: 0;background-color: transparent;height: auto;color: #1890ff;" @tap="toProtocol">《分销商协议》</view>
          </view>

          <!-- #ifdef MP-WEIXIN -->
          <u-button type="warning" shape="square" @click="submitApply">提交申请</u-button>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <faasmall-open-subscribe @open-subscribe-success="submitApply" :template-id="templateIds">
            <u-button type="warning" shape="square" >提交申请</u-button>
          </faasmall-open-subscribe>
          <!-- #endif -->
        </view>
      </view>
      <!-- 提交成功  -->
      <view v-if="memberInfo.distributionStatus === 2" style="display: flex;flex-direction: column;align-items: center">
        <image class="width: 440rpx;height: 440rpx;" :src="$FILE_URL + '/file/img/distribution/distribution-sucess.png'"></image>
        <text style="display: flex;height: auto;align-items: center;justify-content: center;padding: 10px;">申请提交成功，请耐心等待</text>
        <u-button style="margin-top: 20rpx" type="primary" shape="square" @click="toHome">去逛逛</u-button>
      </view>
      <!-- 商家拒绝  -->
      <view v-if="memberInfo.distributionStatus === 4 && !isApplyAgain" style="padding-top: 160rpx;display: flex;flex-direction: column;align-items: center">
        <image class="width: 440rpx;height: 440rpx;" :src="$FILE_URL + '/file/img/distribution/distribution-fail.png'"></image>
        <text style="display: flex;height: auto;align-items: center;justify-content: center;padding: 10px;">不好意思，商家拒绝了您的申请</text>
        <text v-if="reason">拒绝理由：{{ reason }}</text>
        <view style="display: flex;margin-top: 20rpx">
          <u-button type="error" shape="square" @click="applyAgain">再次申请</u-button>
          <u-button style="margin-left: 20rpx" type="primary" shape="square" @click="toHome">去逛逛</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {
  applySatisfyCondition,
  applySubmit,
  getReason
} from "@/faasmall/api/distribution";
import jwt from "@/faasmall/utils/cache/jwt";
export default {
  name: "apply",
  data(){
    let _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      loading:true,
      //是否被邀请
      isInvite:false,
      //申请条件是否满足
      status:false,
      //再次申请
      isApplyAgain:false,
      //是否同意申请协议
      isAgree:false,
      //是否申请
      isApply:false,
      //计数
      count: undefined,
      //峰值
      peak: undefined,
      //进度
      schedule:undefined,
      //申请条件 1 无条件 2 累计消费金额 3 累计消费次数 4 购买任意商品 5 购买指定商品
      meetConditions:1,
      //申请填写的内容
      applyContent:[],
      //拒绝理由
      reason:undefined,
      animationProgress: null,
    }
  },
  onReady() {

  },
  onLoad(){
    this.isLogin && this.getMemberInfo();
    this.init();
    uni.setNavigationBarTitle({
      title: this.distributionOtherData.applyTitle
    });
  },
  computed:{
    ...mapGetters(['isLogin',"shopData","distributionOtherData", "distributionRecruitData","distributionBasisData","memberInfo",'subscribeData']),
    templateIds: function() {
      return [this.subscribeData.distributorApplyTid];
    },
  },
  methods:{
    ...mapActions(['getMemberInfo']),
    // 进度条动画
    progressAnimation(number) {
      let pieceAnimation = uni.createAnimation({
        duration: 500,
        timingFunction: 'ease-in',
        delay: 250
      });
      pieceAnimation.width(number + '%').step();
      this.animationProgress = pieceAnimation.export();
    },
    toGood(){
      let meetConditions = this.distributionBasisData.protocol.meetConditions;
      let designatedGoods = this.distributionBasisData.protocol.designatedGoods;
      if (meetConditions === 5) {
        const list = designatedGoods.map(item => {
          return item.id;
        });
        uni.navigateTo({
          url: `/pages/common/good/list?good_ids=${JSON.stringify(list)}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/common/good/list`
        });
      }
    },
    toProtocol() {
      uni.navigateTo({
        url: '/pages/common/distribution/protocol'
      });
    },
    toHome(){
      uni.switchTab({
        url: '/pages/tabbar/main/index'
      });
    },
    init(){
      // 接到招募令 检测申请条件是否满足
      console.info(this.memberInfo.distributionStatus);
      if(this.memberInfo.distributionStatus === 0 || this.memberInfo.distributionStatus === 6 || this.memberInfo.distributionStatus === 7){
        this.satisfyCondition()
      } else if (this.memberInfo.distributionStatus === 4) {
        getReason().then(response => {
          this.reason = response.data;
          this.loading = false;
        });
      }else if(this.memberInfo.distributionStatus === 3){
        uni.redirectTo({
          url: '/pages/common/distribution/center'
        });
      } else {
        this.loading = false;
      }
    },
    //检测是否满足条件
    satisfyCondition(){
      applySatisfyCondition().then((res)=>{
        this.loading = false;
        if(res.code === 0 && res.data){
          const { meetConditions, status, peak, count } = res.data;
          this.meetConditions = meetConditions; // type 条件 1 无条件
          if (this.meetConditions === 1) {
            this.isApply = true;
          }
          this.status = status;
          this.peak = peak;
          this.count = count;
          let percentage = 0;
          if (status) {
            percentage = 100;
          } else {
            percentage = (count / peak) * 100;
          }
          this.schedule = percentage;
          this.applyContent = this.distributionBasisData.applyContent.map(item => {
            return {
              name: item.name,
              value: ''
            };
          });
          this.$nextTick(() => {
            this.progressAnimation(percentage);
          });
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'error'
          })
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    //立即申请
    apply(){
      // 是否需要填写申请信息
      if (this.distributionBasisData.apply === 1) {
        this.isApply = true;
        this.applyContent = this.distributionBasisData.applyContent.map(item => {
          return {
            name: item.name,
            value: ''
          };
        });
      } else {
        // 不需要填写申请信息 直接申请
        this.doApply();
      }
    },
    //再次申请
    applyAgain(){
      if (this.meetConditions === 1 && this.distributionBasisData.apply === 0) {
        uni.redirectTo({
          url: '/pages/common/distribution/recruit'
        });
      } else {
        this.isApplyAgain = true;
        this.loading = true;
        this.satisfyCondition();
      }
    },
    asApply(){
      let that = this;
      // 判断表单信息不能为空
      const item = this.applyContent.find(item => {
        return !item.value;
      });
      if (item) {
        this.$refs.uToast.show({
          title: `填写完整${item.name}`,
          type: 'error'
        })
      } else {
        // #ifdef MP-WEIXIN
        if(that.subscribeData.status === 0){
          wx.requestSubscribeMessage({
            tmplIds: that.subTemplateId,
            success: function () {},
            fail: function () {},
            complete: function () {
              that.doApply();
            }
          });
        } else {
          that.doApply();
        }
        // #endif
        //  #ifdef H5
        that.doApply();
        //  #endif
      }
    },
    //提交申请
    submitApply(){
      let that = this;
      if (this.distributionBasisData.protocol === 0) {
        if (this.isAgree) {
          that.asApply();
        } else {
          this.$refs.uToast.show({
            title: '请勾选分销协议',
            type: 'error'
          })
        }
      } else {
        that.asApply();
      }
    },
    doApply(){
      applySubmit({applyContent:this.applyContent}).then(response => {
        const { status } = response.data;
        // 审核通过
        if (status === 3) {
          uni.redirectTo({
            url: '/pages/common/distribution/center'
          });
        }
        if (this.isApplyAgain) {
          this.isApplyAgain = false;
        }
        this.$store.state.member.memberInfo.distributionStatus = status;
        let userIf = jwt.getUserInfo();
        console.info(this.memberInfo.distributionStatus);
        userIf.distributionStatus = status;
        jwt.setUserInfo(userIf);
        this.$forceUpdate();
      });
    }
  }
}
</script>

<style scoped lang="scss">

.faas-title {
  color: #222222;
  line-height: 36px;
}

.faas-radio /deep/ {
  display: inline-block;
  margin-right: 9rpx;

  .faas-radio {
    width: 24rpx;
    height: 24rpx;
  }
}
</style>