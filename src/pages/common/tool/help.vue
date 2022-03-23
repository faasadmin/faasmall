<template>
  <view>
    <faasmall-navbar :is-back="true" title="帮助中心"></faasmall-navbar>
    <view style="background: #FFFFFF">
      <u-collapse style="padding: 10px">
        <u-collapse-item :title="item.title" v-for="(item, index) in articleList" :key="index">
          <rich-text :nodes="item.content"></rich-text>
        </u-collapse-item>
      </u-collapse>
    </view>
  </view>
</template>

<script>
import {getArticlePage} from "@/faasmall/api/article";
import graceRichText from "@/faasmall/utils/rechText";
export default {
  name: "help",
  components:{

  },
  data() {
    return {
      articleList: [],
    }
  },
  onLoad(){
    this.initData();
  },
  methods: {
    initData(){
      getArticlePage({'pageNo':1,'pageSize':50,'type':2}).then((res)=>{
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            item.content = graceRichText.format(item.content);
            this.articleList.push(item);
          });
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(error=>{
        console.error(error);
      })
    },
  }
}
</script>

<style scoped>

</style>