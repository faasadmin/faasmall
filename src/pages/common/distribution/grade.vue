<template>
  <view>
    <faasmall-navbar title="等级中心" :is-back="true"></faasmall-navbar>
    <view>
      <view class="privilege-wrap">
        <view class="uni-padding-wrap"  :style="[{height: swiperHeight+ 'px'}]">
          <view class="page-section swiper">
            <view class="page-section-spacing">
              <swiper class="swiper"
                      previous-margin="80rpx"
                      next-margin="80rpx"
                      :current="current"
                      @change="changeSwiper" :style="[{height: swiperHeight+ 'px'}]" :duration="duration">
                <swiper-item v-for="(item,index) in gradeList" :key="index">
                    <distributionGrade :grade="item"/>
                </swiper-item>
              </swiper>
              <view style="padding: 0px 20rpx;">
                  <view style="background: #FFFFFF;padding: 10rpx">
                    <view>满足以下任意条件即可升级</view>
                    <view style="margin-bottom: 5px;">
                      <u-line-progress active-color="#2979ff" :percent="10"></u-line-progress>
                      <view class="row-center-between">
                        <text>累计佣金≥10元</text>
                        <text class="right">1/10</text>
                      </view>
                    </view>
                  </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getDistributionCenterLevelList} from "@/faasmall/api/distribution";
import distributionGrade from './component/distribution-grade';
export default {
  name: "upgrade",
  components:{distributionGrade},
  data(){
    return{
      indicatorDots: true,
      duration: 500,
      swiperHeight:240,
      scrollHeight:'',
      current:0,
      gradeList:[],
    }
  },
  onLoad(){
    this.init();
  },
  methods:{
    init(){
      getDistributionCenterLevelList().then((res)=>{
        if(res.code === 0){
          this.gradeList = res.data;
        }else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 获取内容高度
    getCurrentSwiperHeight(element) {
      debugger
      let query = uni.createSelectorQuery().in(this);
      query.selectAll(element).boundingClientRect();
      query.exec((res) => {
        debugger
        //console.log(res[0][this.current])
        this.swiperHeight = 50 + res[0][this.current].height;
      })
    },
    // 切换
    changeSwiper(e) {
      this.current = e.target.current
      this.getCurrentSwiperHeight('.swiper-item-content');
    },
  }
}
</script>

<style scoped>

</style>