<!-- 提现 -->
<template>
  <view class="draw-money-wrap">
    <view class="head-box">
      <!-- 可提现 -->
      <view class="wallet-num-box u-flex u-col-center u-row-between">
        <view class="">
          <view class="num-title">可提现金额（元）</view>
          <view class="wallet-num">{{ memberData.balance || '0.00' }}</view>
        </view>
        <button class="u-reset-button log-btn" @click="$Router.push({ path: '/pages/common/wallet/withdraw_log' })">提现记录</button>
      </view>
    </view>
    <!-- 提现输入卡片-->
    <view class="withdraw-card">
      <view class="card-title">提现金额</view>
      <view class="input-box u-flex u-col-center">
        <view calss="unit">￥</view>
        <input class="u-flex-1 u-p-l-10" type="number" @input="onWithdrawInput" v-model="money" :placeholder-style="placeholderStyle" placeholder="请输入提现金额" />
      </view>
      <view class="bank-box u-flex u-col-center u-row-between u-m-b-30">
        <view class="name">提现至</view>
        <view class="bank-list u-flex" @tap="showWithdrawList = true">
          <view class="empty-text" v-if="!withdrawType">请选择提现方式</view>
          <view class="sel-box u-flex u-col-center" v-else>
            <image class="item-img" :src="withdrawList[withdrawType].icon" mode=""></image>
            <view class="item-title u-m-l-20">{{ withdrawList[withdrawType].title }}</view>
          </view>
          <text class="u-iconfont uicon-arrow-right" style="#C4C4C4;"></text>
        </view>
      </view>
      <!-- 绑定信息 -->
      <view v-if="showInfo && selectedWithdrawType !== 1">
        <view class="withdraw-warap mt-1" style="border-radius: 10px;">
          <view class="withdraw-item" @click="chargeTypeShwo = true" style="background: #FFFFFF;width: 100%;height: 80rpx;display: flex;justify-content: space-between;align-items: center">
            <view class="withdraw-title">提现方式</view>
            <view style="display: flex;justify-content: center;align-items: center;">{{writeType}}<text class="iconfont icon-page-next"></text></view>
          </view>
        </view>
        <view style="background: #FFFFFF;margin-top: 10px;border-radius: 10px;">
          <view v-if="writeTypeShwo">
            <u-form v-if="selectedWithdrawType === 2" :model="form"  ref="wx" style="padding: 0 5px 0 5px;" :rules="form.wxRules" :errorType="errorType">
              <u-form-item :labelStyle="labelStyle"  label="姓名" label-width="60px" prop="wxName"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入姓名" v-model="form.data.wxName" /></u-form-item>
              <u-form-item :labelStyle="labelStyle" label="账号" label-width="60px" prop="wxAccount"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入微信账号" v-model="form.data.wxAccount" /></u-form-item>
            </u-form>
            <u-form v-if="selectedWithdrawType === 3" :model="form"  ref="zfb" style="padding: 0 5px 0 5px;" :rules="form.alipayRules" :errorType="errorType">
              <u-form-item :labelStyle="labelStyle" label="姓名" label-width="60px" prop="zfbName"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入姓名" v-model="form.data.zfbName" /></u-form-item>
              <u-form-item :labelStyle="labelStyle" label="账号" label-width="60px" prop="zfbAccount"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入支付宝账号" v-model="form.data.zfbAccount" /></u-form-item>
            </u-form>
            <u-form v-if="selectedWithdrawType === 4" :model="form"  ref="bank" style="padding: 0 5px 0 5px;" :rules="form.bankRules" :errorType="errorType">
              <u-form-item :labelStyle="labelStyle" label="开户行" label-width="60px" prop="bankName"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入银行名称" v-model="form.data.bankName" /></u-form-item>
              <u-form-item :labelStyle="labelStyle" label="开户人" label-width="60px" prop="bankAccount"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入持卡人姓名" v-model="form.data.bankAccount" /></u-form-item>
              <u-form-item :labelStyle="labelStyle" label="银行卡" label-width="60px" prop="cardNo"><u-input :placeholderStyle="placeholderStyle" placeholder="请输入银行卡号" v-model="form.data.bankCardNo" /></u-form-item>
            </u-form>
          </view>
          <view v-else>
            <u-upload max-count="1" :multiple="false" @on-list-change="uploadChange" ref="uUpload" :action="'#'" :auto-upload="false" ></u-upload>
          </view>
        </view>
      </view>

      <!-- #ifndef H5 -->
      <button class="u-reset-button save-btn" @click="withdraw">确认提现</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <he-open-subscribe @open-subscribe-success="withdraw" :template-id="templateIds">
        <button class="u-reset-button save-btn" >确认提现</button>
      </he-open-subscribe>
      <!-- #endif -->

    </view>
    <!-- 提现说明 -->
    <view class="withdraw-notice">
      <view class="title">提现说明</view>
      <view class="draw-list">1.单次最低提现 {{ walletData.mixWithdrawalAmount }} 元，最高提现 {{ walletData.maxWithdrawalAmount }} 元；</view>
      <view class="draw-list">
        2.每日最多可提现次数: {{ walletData.maxDailyWithdrawalNum ? walletData.maxDailyWithdrawalNum : '不限' }}；每日最多提现金额(元):
        {{ walletData.maxDailyWithdrawalAmount ? walletData.maxDailyWithdrawalAmount : '不限' }}；
      </view>
      <view class="draw-list">3.每笔收取提现手续费 {{ walletData.handlingFee }}%；</view>
      <view class="draw-list">4.提现结果请查收对应渠道服务通知；</view>
      <view class="draw-list">5.如有疑问请及时联系客服。</view>
    </view>
    <!-- 提现方式 -->
    <u-popup v-if="walletData && walletData.withdrawMethod" v-model="showWithdrawList" mode="bottom" safe-area-inset-bottom :closeable="false" border-radius="30">
      <view class="page_box withdraw-modal">
        <view class="modal-head u-flex u-row-center u-col-center">选择提现方式</view>
        <view class="content_box modal-content">
          <u-radio-group v-model="selectedWithdrawType" activeColor="#FF0505" wrap>
            <view class="type-item u-p-x-24 u-p-y-30 u-flex u-row-center" style="padding-left: 40rpx;" v-if="walletData.withdrawMethod.includes(item.value)" v-for="(item, index) in withdrawList" :key="index">
              <u-radio shape="circle" iconSize="30" :name="item.value" labelWidth="100%">
                <view class="item-left u-flex u-col-center u-m-l-30">
                  <image class="item-img" :src="item.icon" mode=""></image>
                  <view class="item-title u-m-l-20">{{ item.title }}</view>
                </view>
              </u-radio>
            </view>
          </u-radio-group>
        </view>
        <view class="modal-bottom"><button class="u-reset-button modal-save-btn" @tap="onSaveWithdrawType">确定</button></view>
      </view>
    </u-popup>



    <u-action-sheet :list="chargeTypeData" v-model="chargeTypeShwo" @click="chargeTypeClick"></u-action-sheet>

    <!-- modal -->
    <u-modal
        ref="uModal"
        v-model="showModal"
        :show-cancel-button="true"
        confirm-color="#7063D2"
        cancel-color="#666666"
        @confirm="$Router.push('/pages/user/wallet/withdraw-log')"
        confirm-text="查看记录"
        cancel-text="继续提现"
        content="您的申请提现已提交"
        title="申请成功"
    ></u-modal>
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import validate from '@/faasmall/utils/validate';
import {getMemberBank} from "@/faasmall/api/member";
import {balanceApplyWithdraw} from "@/faasmall/api/wallet";
import jwt from "@/faasmall/utils/cache/jwt";
export default {
  components: {},
  data() {
    return {
      showModal: false,
      money: '', //提现金额
      ruleInfo: '', //提现规则
      formTitle: '',
      withdrawType: '',
      fileList: [],
      showInfo: false,
      selectedWithdrawType: '',
      withdrawInfo: {}, //提现信息
      showWithdrawList: false,
      chargeTypeShwo: false,
      writeType: '输入账号',
      writeTypeShwo: true,
      chargeTypeData: [{
        text: '输入账号',
        model:1
      }, {
        text: '上传收款码',
        model:2
      }],
      withdrawList: {
        1: {
          icon: this.$FILE_URL + '/file/img/wallet/wx.png',
          title: '微信零钱',
          value: 1
        },
        2: {
          icon: this.$FILE_URL + '/file/img/wallet/wx.png',
          title: '微信线下打款',
          value: 2
        },
        3: {
          icon: this.$FILE_URL + '/file/img/wallet/alipay.png',
          title: '支付宝线下打款',
          value: 3
        },
        4: {
          icon: this.$FILE_URL + '/file/img/wallet/bank.png',
          title: '银联线下打款',
          value: 4
        },
      },
      // 表单样式
      errorType: ['message'],
      labelStyle: {
        'font-size': '30rpx',
        'font-weight': '500',
        color: '#333'
      },
      placeholderStyle: 'font-size: 30rpx; font-weight: 500;color:#C2C7CF;',
      form: {
        data: {
          bankAccount: '',
          bankName: '',
          bankCardNo: '',
          wxAccount:'',
          wxName:'',
          zfbAccount:'',
          zfbName:'',
          type: this.withdrawType,
          model:'1',
          platform: this.$platform.get(),
        },
        wxRules: {
          wxAccount: validate.account,
          wxName: validate.wxName,
        },
        bankRules: {
          bankAccount: validate.bankAccount,
          bankName: validate.bankName,
          cardNo: validate.bankCode
        },
        alipayRules: {
          zfbName: validate.zfbName,
          zfbAccount: validate.alipayAccount
        }
      }
    };
  },
  computed: {
    ...mapGetters(['memberData','walletData','subscribeData']),
    templateIds() {
      let arr = [];
      this.subscribeData.distributorWithdrawSuccessTid
          ? arr.push(this.subscribeData.distributorWithdrawSuccessTid)
          : null;
      this.subscribeData.withdrawalFailedTid
          ? arr.push(this.subscribeData.withdrawalFailedTid)
          : null;
      return arr;
    },
  },
  async onLoad() {

  },
  onShow(){
    debugger
    jwt.getLogin() && this.getMemberData();
  },
  watch: {
    withdrawType: {
      immediate: true,
      handler(newValue, oldValue) {
        debugger
        switch (newValue) {
          case 2:
            this.$nextTick(() => {
              this.$refs.wx.setRules(this.form.wxRules);
            });
            break;
          case 3:
            this.$nextTick(() => {
              this.$refs.zfb.setRules(this.form.alipayRules);
            });
            break;
          case 4:
            this.$nextTick(() => {
              this.$refs.bank.setRules(this.form.bankRules);
            });
          default:
            break;
        }
      },
    },
  },
  methods: {
    ...mapActions(['getMemberData']),
    chargeTypeClick(index){
      this.writeType = this.chargeTypeData[index].text;
      this.form.data.model = this.chargeTypeData[index].model;
      if(index > 0){
        this.writeTypeShwo = false;
      }else{
        this.writeTypeShwo = true;
      }
    },
    uploadChange(lists, name) {
      this.fileList = lists;
    },
    // 确认提现方式
    onSaveWithdrawType() {
      this.withdrawType = this.selectedWithdrawType;
      this.form.data.type = this.selectedWithdrawType;
      this.showWithdrawList = false;
      this.showInfo = true;
      console.info(this.withdrawList[this.withdrawType]);
      debugger
      this.getWithdrawInfo();
    },
    async bindThirdOauth() {
      let _this = this;
      _this.getWithdrawInfo();
    },
    // 提现检验
    onWithdrawInput(e) {
      let sVal = String(e.detail.value);
      sVal = sVal.replace(/\b(0+)/gi, '');
      sVal = sVal.replace(/[^\d]/g, '');
      this.money = sVal;
    },
    // 提现
    withdraw() {
      let _this = this;
      if (!this.withdrawType) {
        this.$u.toast('请选择提现方式');
        return;
      }
      if (this.money <= 0) {
        this.$u.toast('请输入提现金额');
        return;
      }
      console.info(this.$refs[this.withdrawType].validate());
      debugger
      this.$refs[this.withdrawType].validate().then(res => {
        if (res) {
          balanceApplyWithdraw(this.form.data).then(res => {
            if (res.code === 1) {
              _this.money = '';
              _this.showModal = true;
              //  #ifdef MP-WEIXIN
              this.$store.commit('subscribeMessage', 'walletData');
              //  #endif
              _this.$store.dispatch('getMemberData');
            } else {
              _this.$u.toast(res.msg);
            }
          });
        }
      });
    },
    // 获取提现信息
    getWithdrawInfo() {
      let _this = this;
      getMemberBank().then(res => {
        _this.withdrawInfo = res.code === 0 ? res.data : null;
      });
    }
  }
};
</script>

<style lang="scss">
.head-box {
  background: url($FILE_URL + '/file/img/wallet/withdraw_head_bg.png') no-repeat;
  background-size: 100% auto;
  min-height: 400rpx;
  padding-bottom: var(--status-bar-height);
  .wallet-num-box {
    padding: 20rpx 40rpx 0;
    .num-title {
      font-size: 26rpx;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 20rpx;
    }
    .wallet-num {
      font-size: 60rpx;
      font-weight: 500;
      color: #ffffff;
    }
    .log-btn {
      width: 170rpx;
      height: 60rpx;
      line-height: 60rpx;
      background: rgba(255, 255, 255, 0.1);
      border: 1rpx solid #eeeeee;
      border-radius: 30rpx;
      padding: 0;
      font-size: 26rpx;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
.withdraw-card {
  background-color: #fff;
  border-radius: 20rpx;
  width: 690rpx;
  min-height: 530rpx;
  margin: -70rpx auto 0;
  padding: 30rpx;
  .card-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 30rpx;
  }
  .input-box {
    width: 624rpx;
    border-bottom: 1rpx solid #eee;
    height: 100rpx;
    margin-bottom: 40rpx;
    .unit {
      font-size: 48rpx;
      color: #333;
    }
  }
  .bank-box {
    .name {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }
    .bank-list {
      .empty-text {
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
      }

      .sel-box {
        .item-img {
          width: 36rpx;
          height: 36rpx;
        }
        .item-title {
          font-size: 28rpx;
          color: #333333;
        }
      }
    }
  }
  .bank-info {
    height: 50rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #999999;
    .bank-info-title {
      width: 500rpx;
    }
    .bind-btn {
      padding: 0 20rpx;
      line-height: 50rpx;
      background: #f5f6f8;
      border-radius: 20rpx;
      color: #999;
    }
  }
  .save-btn {
    width: 616rpx;
    height: 86rpx;
    line-height: 86rpx;
    background: linear-gradient(-90deg, #fc4b4b, #ed0404);
    box-shadow: 0px 7rpx 11rpx 2rpx rgb(252, 138, 145);
    border-radius: 43rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #ffffff;
  }
}
.withdraw-notice {
  width: 684rpx;
  min-height: 327rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx 35rpx;
  margin: 20rpx auto;
  .title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 30rpx;
  }
  .draw-list {
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    margin-bottom: 10rpx;
  }
}
// 提现费方式
.withdraw-modal {
  min-height: 600rpx;
  background-color: #fff;
  .modal-head {
    height: 80rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
  }
  .modal-content {
    .type-item {
      height: 100rpx;
      border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
      width: 750rpx;
      .item-img {
        width: 36rpx;
        height: 36rpx;
      }
      .item-title {
        font-size: 28rpx;
        color: #333333;
      }
    }
  }
  .modal-bottom {
    padding: 30rpx;
    .modal-save-btn {
      width: 690rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: linear-gradient(-90deg, #fc4b4b, #ed0404);
      box-shadow: 0px 7rpx 11rpx 2rpx rgb(252, 138, 145);
      border-radius: 40rpx;
      font-weight: 500;
      color: #ffffff;
    }
  }
}

// 绑定
.form-box {
  .head-title {
    height: 100rpx;
    font-size: 34rpx;
    font-weight: 600;
  }
  .form-save-btn {
    width: 340rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(90deg, #a36fff, #5336ff);
    box-shadow: 0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
    border-radius: 40rpx;
    font-weight: 500;
    color: #ffffff;
  }
  .form-cancel-btn {
    width: 340rpx;
    height: 80rpx;
    line-height: 80rpx;
    border: 1rpx solid #999;
    border-radius: 40rpx;
    font-weight: 500;
    color: #999;
  }
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
.page_box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
  background: $u-bg-color;
}
.scroll-box {
  flex: 1;
  height: 100%;
  position: relative;
}
.content_box {
  flex: 1;
  overflow-y: auto;
}
</style>
