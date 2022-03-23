<template>
  <view>
    <faasmall-navbar title="我的足迹" :is-back="true"></faasmall-navbar>
    <view>
      <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreFootPrint">
        <faasmall-good-list  :list="goodList" type="double" ></faasmall-good-list>
        <!-- 空白页 -->
        <u-empty v-if="empty === true && goodList.length === 0" text="暂无数据" mode="list"></u-empty>
        <u-loadmore :status="loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreFootPrint"></u-loadmore>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {getFootPrintPage} from '@/faasmall/api/footprint';
export default {
  name: "footprint",
  data(){
    return{
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      loadingType: 'loadmore',
      empty:false,
      page: 1,
      total: 0,
      goodList: [],
    }
  },
  onLoad(){
    this.loadData();
  },
  methods:{
    loadMoreFootPrint(){
      this.page = this.page + 1;
      this.loadData();
    },
    loadData(){
      this.loadingType = 'loading';
      getFootPrintPage({'pageNo':this.page,'pageSize':10}).then((res)=>{
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            this.goodList.push(item);
          });
          if (res.data.list.length === this.goodList.length) {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            this.loadingType = 'nomore';
          } else {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            this.loadingType = 'loadmore';
          }
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
    editFnc(){
      this.pageState = !this.pageState
    },
    selectAllfnc() {
      this.selectAll = !this.selectAll
    },
  }
}
</script>

<style scoped>

</style>