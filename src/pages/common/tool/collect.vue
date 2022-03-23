<template>
  <view>
    <faasmall-navbar title="我的收藏" :is-back="true">
      <view class="navbar-right" slot="right" name="right">
        <view class="mr-1" @tap="editFnc()">
          <view class="stateText">
            {{pageState?'完成':'编辑'}}
          </view>
        </view>
      </view>
    </faasmall-navbar>
    <view>
      <scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="loadMoreCollect">
        <faasmall-good-list  :list="goodList" type="select" :selectFlag="pageState"></faasmall-good-list>
        <!-- 空白页 -->
        <u-empty v-if="empty === true && goodList.length === 0" text="暂无数据" mode="list"></u-empty>
        <u-loadmore :status="loadingType" bgColor="#f2f2f2" :icon-type="iconType" :load-text="loadText" @loadmore="loadMoreCollect"></u-loadmore>
      </scroll-view>
    </view>
    <view class="fixed-container flex align-start" v-if="pageState">
      <view class="bottom-bar row-center-between">
        <view class="leftselctAll row-center-center" @click="selectAllfnc()">
          <image class="selectIcon" v-if="selectAll" src="/static/img/common/select.png" mode=""></image>
          <view v-else class="onSelect border-box"></view>
          <view class="selecttext">
            全选
          </view>
        </view>
        <view class="rightsebtn row-center-center" @click="deleteCollectFnc()">
          <view>
            删除
          </view>
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import {getCollectPage,deleteCollect} from '@/faasmall/api/collect';
export default {
  name: "collect",
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
      pageState:false,
      selectAll:false,
      goodList: [],
    }
  },
  onLoad(){
    this.loadData();
  },
  methods:{
    loadMoreCollect(){
      this.page = this.page + 1;
      this.loadData();
    },
    loadData(){
      this.loadingType = 'loading';
      getCollectPage({'pageNo':this.page,'pageSize':10}).then((res)=>{
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
      this.goodList.forEach(good=>{
        //good.selected = this.selectAll;
        this.$set(good, 'selected', this.selectAll);
      })
    },
    deleteCollectFnc(){
      var ids = [];
      this.goodList.forEach(good=>{
        ids.push(good.id);
      })
      deleteCollect({ids:ids}).then((res)=>{
        if(res.code === 0){
          this.$refs.uToast.show({
            title: '删除成功',
          })
          setTimeout(() => {
            uni.redirectTo({url: '/pages/common/tool/collect'});
          }, 400)
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(error=>{
        console.error(error);
      });
    }
  }
}
</script>

<style lang="scss">
.fixed-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #FFFFFF;
  height: 90rpx;
  height: calc(90rpx + constant(safe-area-inset-bottom));
  height: env(90rpx + constant(safe-area-inset-bottom));

  .bottom-bar {
    width: 100%;
    padding: 0 32rpx;
    height: 90rpx;

    .leftselctAll {

      .onSelect {
        width: 30rpx;
        height: 30rpx;
        border-radius: 50%;
        border: 1rpx solid #999999;
      }

      .selectIcon {
        width: 30rpx;
        height: 30rpx;
      }

      .selecttext {
        font-size: 24rpx;
        font-weight: 400;
        margin-left: 15rpx;
      }
    }

    .rightsebtn {
      width: 88rpx;
      height: 38rpx;
      background: #FFFFFF;
      border: 1rpx solid #CC0004;
      border-radius: 19rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #CC0004;
    }
  }
}
</style>