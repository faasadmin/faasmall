<template>
  <view>
    <faasmall-navbar title="分销提现" :is-back="true"></faasmall-navbar>
    <u-toast ref="uToast" />
    <view style="padding: 20rpx">
      <view>
        <view style="background: #FFFFFF;height: 200rpx;padding: 20rpx" class="col-center-between">
            <view>可提现佣金</view>
            <view>￥{{userInfo.commission}}</view>
            <view @tap="$Router.push('/pages/common/distribution/withdraw_list')"><text>我的提现</text><text class="iconfont icon-page-next"></text></view>
        </view>
      </view>
      <view style="background-color: #FFFFFF;margin-top: 5px;padding: 10px 10px;">
        <view>提现金额</view>
        <view class="row-center-between" style="margin-top: 10px;">
          <view class="barname-box row-center-center" style="height: 40px;line-height: 40px;">
            <text style="font-size: 20px;">￥</text>
          </view>
          <view class="tborder row-center-center" style="width: 100%">
            <input class="hinput" v-model="form.amount" style="height: 40px;width: 100%" type="number" placeholder="请输入你要提现的金额" placeholder-class="inputplace" />
          </view>
          <view style="width: 40px;"><text style="color: red;" @click="onAll">全部</text></view>
        </view>
      </view>
      <view class="withdraw-warap mt-1">
        <view class="withdraw-item" @click="onWithdrawalMethod" style="background: #FFFFFF;width: 100%;height: 80rpx;padding: 10rpx;display: flex;justify-content: space-between;align-items: center">
          <view class="withdraw-title">提现方式</view>
          <view style="display: flex;justify-content: center;align-items: center;">{{withdrawalMethod}}<text class="iconfont icon-page-next"></text></view>
        </view>
      </view>
      <view v-if="infoShwo">
        <view class="withdraw-warap mt-1" style="border-radius: 10px;">
          <view class="withdraw-item" @click="payTypeShwo = true" style="background: #FFFFFF;width: 100%;height: 80rpx;padding: 10rpx;display: flex;justify-content: space-between;align-items: center">
            <view class="withdraw-title">信息填写</view>
            <view style="display: flex;justify-content: center;align-items: center;">{{writeType}}<text class="iconfont icon-page-next"></text></view>
          </view>
        </view>
        <view style="background: #FFFFFF;margin-top: 10px;border-radius: 10px;">
          <view v-if="writeTypeShwo">
            <u-form :model="form" ref="uForm" style="padding: 0 5px 0 5px;">
              <u-form-item label="姓名" label-width="60px" prop="name"><u-input placeholder="请输入姓名" v-model="form.name" /></u-form-item>
              <u-form-item label="账号" label-width="60px" prop="account"><u-input placeholder="请输入手机号" v-model="form.account" /></u-form-item>
            </u-form>
          </view>
          <view v-else>
            <u-upload max-count="1" :multiple="false" @on-list-change="uploadChange" ref="uUpload" :action="'#'" :auto-upload="false" ></u-upload>
          </view>
        </view>
      </view>
      <view v-if="bankCardShwo" style="background: #FFFFFF;margin-top: 10px;">
        <u-form :model="form" ref="uForm" style="padding: 0 5px 0 5px;">
          <u-form-item label="姓名" label-width="60px" prop="name"><u-input placeholder="请输入姓名" v-model="form.name" /></u-form-item>
          <u-form-item label="账号" prop="account"><u-input v-model="form.account" placeholder="请输入银行卡号"/></u-form-item>
        </u-form>
      </view>
      <view style="margin-top: 10px;">
        <u-button type="primary" @click="submit">提交申请</u-button>
      </view>
      <u-action-sheet :list="withdrawalTypeList" v-model="withdrawalTypeShow" @click="withdrawalTypeClick"></u-action-sheet>
      <u-action-sheet :list="payTypeData" v-model="payTypeShwo" @click="payTypeClick"></u-action-sheet>
    </view>
  </view>
</template>

<script>
import {applyWithdraw} from "@/faasmall/api/withdraw";
import {getMemberInfo} from "@/faasmall/api/member";
import {mapActions, mapGetters} from 'vuex';
export default {
  name: "withdraw",
  data(){
    return{
      form: {
        name: '',
        account: '',
        type:'',
        model:'1',
        amount:'',
        bank:'',
        mobile:'',
        qr:'',
        platform: this.$platform.get(),
      },
      action: '',
      withdrawalTypeShow: false,
      infoShwo:false,
      payTypeShwo: false,
      bankCardShwo: false,
      writeType: '输入账号',
      writeTypeShwo: true,
      currentGold:'0',
      goldId:'1',
      payType:'1',
      withdrawalMethod:'',
      withdrawalTypeList: [{
        text: '微信零钱'
      },{
        text: '微信线下打款'
      }, {
        text: '支付宝线下打款'
      }, {
        text: '银行卡打款'
      }, {
        text: '银联线下打款'
      }, {
        text: '商城余额'
      }],
      payTypeData: [{
        text: '输入账号',
        model:1
      }, {
        text: '上传收款码',
        model:2
      }],
      fileList: [],
    }
  },
  onLoad(){
    this.init();
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods:{
    init(){

    },
    goDistributionCenter(){
      uni.redirectTo({
        url: 'pages/common/distribution/center'
      })
    },
    onAll(){
      this.from.amount = '';
    },
    onWithdrawalMethod(){
      this.withdrawalTypeShow = true;
    },
    withdrawalTypeClick(index) {
      console.log(`点击了第${index + 1}项，内容为：${this.withdrawalTypeList[index].text}`)
      this.withdrawalMethod = this.withdrawalTypeList[index].text;
      this.form.type = index + 1;
      debugger
      if(index === 0 || index===1){
        this.infoShwo = true;
        this.bankCardShwo = false;
      }else{
        this.bankCardShwo = true;
        this.infoShwo = false;
      }
    },
    payTypeClick(index){
      this.writeType = this.payTypeData[index].text;
      this.form.model = this.payTypeData[index].model;
      if(index > 0){
        this.writeTypeShwo = false;
      }else{
        this.writeTypeShwo = true;
      }
    },
    uploadChange(lists, name) {
      this.fileList = lists;
    },
    submit(){
      debugger
      if(this.$isEmpty(this.form.type)){
        this.$refs.uToast.show({
          title: '请选择提现方式',
        })
        return;
      }
      if(this.$isEmpty(this.form.amount)){
        this.$refs.uToast.show({
          title: '请输入你要提现的金额',
        })
        return;
      }
      if(this.form.amount > this.currentGold){
        this.$refs.uToast.show({
          title: '输入的金额不能大于可提现金额',
        })
        return;
      }
      if(this.form.model === 1){
        if(this.$isEmpty(this.form.name)){
          this.$refs.uToast.show({
            title: '姓名不能为空',
          })
          return;
        }
        if(this.$isEmpty(this.form.account)){
          this.$refs.uToast.show({
            title: '账号不能为空',
          })
          return;
        }
        applyWithdraw(this.form).then(res => {
          if (res.code == 200){
            this.$refs.uToast.show({
              title: '申请成功',
              type: 'success'
            })
            setTimeout(function(){
              this.goDistributionCenter();
            },1000);
          }else{
            this.$refs.uToast.show({
              title: '申请失败' + res.msg,
              type: 'error',
            })
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>