<!-- 富文本 -->
<template>
  <view>
    <faasmall-navbar :backText="title"></faasmall-navbar>
    <view class="rich-wrap">
      <view class="content_box"><u-parse :html="content"></u-parse></view>
    </view>
  </view>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  components: {},
  data() {
    return {
      title:'',
      content: ''
    };
  },
  computed: {
    ...mapGetters(['shopData']),
  },
  onLoad() {
    console.log(this.$Route.query.type)
    debugger
    if(this.$isNotEmpty(this.$Route.query.type)){
      var type = this.$Route.query.type;
      this.title = type === 'about' ? '关于我们' : type === 'privacy' ? '隐私政策' : '注册协议';
      switch (type) {
        case 'about':
          this.content = this.shopData.about;
          break;
        case 'privacy':
          this.content = this.shopData.privacy;
          break;
        case 'register':
          this.content = this.shopData.register;
          break;
      }
    } if(this.$isNotEmpty(this.$Route.query.content)){
      this.content = this.$Route.query.content;
    } else {
      this.$Route.query.id && this.getRichText();
    }
  },
  methods: {
    getRichText() {

    }
  }
};
</script>

<style lang="scss">
page{
  background-color: #fff;
}
.content_box {
  background: #fff;
  padding: 30rpx;
}
</style>
