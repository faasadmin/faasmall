<!--商品推荐-->
<template>
  <view class="faas-products-featured">
    <view class="faas-top row-center-center">
      <view class="faas-text" v-if="isTask">积分商品 </view>
      <view class="faas-text" v-else>为你推荐</view>
    </view>
    <template v-if="isTask">
      <faasmall-good-list :isTask="isTask" :list="taskList" :type="goodsType" v-if="taskList.length"></faasmall-good-list>
    </template>
    <template v-if="!isTask">
      <faasmall-good-list :isTask="isTask" :list="goodList" v-if="goodList.length" :type="goodsType"></faasmall-good-list>
    </template>
  </view>
</template>

<script>
import {getRecommendGood} from "@/faasmall/api/good";
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
  name: "good-recommend",
  data() {
    return {
      goodsType:'double',
      taskList: [],
    };
  },
  props: {
    isTask: {
      type: [Boolean, Number],
      default: 0
    }
  },
  computed: {
    ...mapGetters({
      goodList: 'recommendGood'
    })
  },
  methods: {
    ...mapActions({
      recommendGood: 'recommendGood'
    }),
  },
  mounted() {
    debugger
    if(this.isTask){
      getRecommendGood({isTask:this.isTask}).then(res => {
        debugger
        this.taskList = res.data;
      }).catch((error) => {
        console.error(error)
      });
    }else {
      this.recommendGood();
    }
  }
}
</script>
<style scoped>
.faas-products-featured {
  width: 750rpx;
  overflow: hidden;
}
.faas-top {
  margin-top: 43rpx;
  border-radius: 16rpx 16rpx 0 0;
}
.faas-text {
  color: #222222;
  margin: 0 21rpx;
}
</style>