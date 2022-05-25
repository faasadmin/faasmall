<template>
  <view>
    <view style="padding: 20rpx;">
      <view style="background: #FFFFFF;padding: 20rpx">
        <u-input v-model="comments" placeholder="请输入买家留言" maxlength="40" type="textarea" :border="false" height="100" :auto-height="true" />
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
    if(options.comments){
      this.comments = decodeURIComponent(options.comments);
    }
  },
  data(){
    return{
      comments:'',
    }
  },
  methods:{
    definite(){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      // 上一个页面最后设置userdata
      prevPage.comments = this.comments;
      uni.navigateBack({//返回
        delta: 1
      })
    }
  }
}
</script>

<style scoped>

</style>