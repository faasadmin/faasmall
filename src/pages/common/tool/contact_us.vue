<template>
  <view>
    <view style="min-height: 100vh;
display: flex;
flex-direction: column;
background: linear-gradient(rgb(246, 35, 24) 0%, rgb(242, 4, 7) 100%);
justify-content: center;
align-items: center;">
      <view style="width: 300px;
    border: 5px solid rgb(250, 121, 73);
    border-radius: 10px;
    background: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;">
        <u-image :src="shopData.buddyQr"  width="180px" height="180px" style="
                    margin-top: 20px;
                    height: 192px;
                    width: 192px;"></u-image>
        <view class="" style="line-height: 45px;">客服微信</view>
        <view class="" style="display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #FFA200 0%, #FF5E44 100%);
    width: 230px;
    height: 50px;
    border-radius: 50px;
    line-height: 49px;
    margin-top: 30px;
    vertical-align: middle;"  @click="onCopy(shopData.wechat)">
          微信扫码添加
        </view>
        <view class="mt20 normal xs" style="line-height: 35px">9:30-17:00</view>
        <!-- #ifdef MP-WEIXIN -->
        <button open-type="contact" class="sm row-center contact-btn br60">
          <text style="line-height: 50px;color: white;">在线客服</text>
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <view class="sm row-center contact-btn br60" @click="tipsShow()">
          <text style="line-height: 50px;color: white;">在线客服</text>
        </view>
        <!-- #endif -->
      </view>
      <view class="xs white" style="margin-top: 40px;line-height: 49px;">
        无法添加或疑难问题请联系工作人员
      </view>
      <view class="row white">
        <view class="xs" style="line-height: 49px;">{{shopData.mobile}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'contactUs',
  components:{

  },
  computed: {
    ...mapGetters(['shopData']),
  },
  data() {
    return {
      showPhoneCall: false,
      content: '即将打电话给'
    }
  },
  onLoad() {
    debugger
  },
  methods: {
    tipsShow() {

    },
    onCopy(str) {
      copy(str);
    },
    showTelTips() {
      this.showPhoneCall = true;
      this.content = '即将打电话给' + this.server.phone
    },
    onCall() {
      wx.makePhoneCall({
        phoneNumber: this.server.phone.toString(),
        success(e) {
          console.log('成功', e)
        },
        fail(err) {
          console.log('失败', err)
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
