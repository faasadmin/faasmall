<template>
  <view>
    <faasmall-navbar title="买家留言" :is-back="true"></faasmall-navbar>
    <view style="padding: 20rpx;">
      <view style="background: #FFFFFF;padding: 20rpx">
        <u-input v-model="message" placeholder="请输入买家留言" maxlength="40" type="textarea" :border="false" height="100" :auto-height="true" />
      </view>
    </view>
    <view style="padding: 20rpx">
      <u-button type="primary" @click="definite">确定</u-button>
    </view>
  </view>
</template>

<script>
export default {
  name: "message",
  components:{

  },
  onLoad(options){
    this.message = JSON.parse(decodeURIComponent(options.message))
  },
  data(){
    return{
      message:'',
    }
  },
  methods:{
    definite(){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      // 上一个页面最后设置userdata
      prevPage.message = this.message;
      uni.navigateBack({//返回
        delta: 1
      })
    }
  }
}
</script>

<style scoped>

</style>