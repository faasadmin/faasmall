<template>
  <view>
    <faasmall-navbar title="余额明细" :is-back="true"></faasmall-navbar>
    <view>
      <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreBalance">
        <view class="list-wrap">
          <view class="list-item border-bottom" v-for="(item,index) in balancelList" :key="index">
            <view class="col" style="height: 100%!important;">
              <text>{{item.title}}</text>
              <text>{{item.createTime}}</text>
            </view>
            <view>
              <text>{{item.modeName}}{{item.extend}}</text>
            </view>
          </view>
        </view>
        <!-- 空白页 -->
        <u-empty v-if="empty === true && balancelList.length === 0" text="暂无数据" mode="list"></u-empty>
        <u-loadmore :status="loadingType" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreBalance"/>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {getBalancePage} from "@/faasmall/api/balance";
export default {
  name: "detail",
  data(){
    return{
      iconType: 'flower',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      empty:false,
      loadingType: 'loadmore',
      balancelList:[],
      page: 1,
      total: 0,
    }
  },
  onLoad(){
    this.init();
  },
  onShow(){

  },
  methods:{
    init(){
      this.loadMoreBalance();
    },
    loadMoreBalance(){
      this.page = this.page + 1;
      let page = this.page;
      if (this.empty === true) {
        //tab切换只有第一次需要加载数据
        return;
      }
      if (this.loadingType === 'loading') {
        //防止重复加载
        return;
      }
      if (this.loadingType === 'nomore') {
        return;
      }
      this.loadingType = 'loading';
      getBalancePage({'pageNo':page,'pageSize':10}).then((res)=>{
        if(res.code === 0){
          let list = res.data.list;
          list.forEach(item => {
            this.balancelList.push(item);
          });
          this.total = res.data.total;
          if (res.data.list.length === this.balancelList.length) {
            //判断是否还有数据， 有改为 more， 没有改为noMore
            this.loadingType = 'nomore';
            this.empty = true;
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
        console.error(error)
      })

    }
  }
}
</script>

<style scoped>

</style>