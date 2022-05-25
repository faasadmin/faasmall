<template>
  <view>
    <view>
      <view class="privilege-wrap">
        <view class="uni-padding-wrap"  :style="[{height: swiperHeight+ 'px'}]">
          <view class="page-section swiper">
            <view class="page-section-spacing">
              <view style="display: flex;height: 80px;align-items: center;justify-content: center;padding: 40px 0;position: absolute;width: 100%;">
                <view style="background:#ffff00">
                  你的等级为-{{memberInfo.distributionLevelName}}
                </view>
              </view>
              <view style="height: 20px"></view>
              <swiper class="swiper"
                      previous-margin="80rpx"
                      next-margin="80rpx"
                      :current="current"
                      @change="changeSwiper" :style="[{height: swiperHeight+ 'px'}]" :duration="duration">
                <swiper-item v-for="(item,index) in gradeList" :key="index">
                    <distributionGrade :grade="item"/>
                </swiper-item>
              </swiper>
              <view style="padding: 0px 20rpx;" v-if="currentLevel && currentLevel.auto === 1">
                <view>{{ currentLevel.upgradeType === 1 ? '满足任意条件升级' : currentLevel.upgradeType === 2 ? '满足全部条件升级' : '' }}</view>
                  <!--  累计销售额(元) -->
                  <view style="background: #FFFFFF;padding: 10rpx" v-if="currentLevel.conditions.cumulativeSales.checked">
                    <view style="margin-bottom: 5px;">
                      <u-line-progress active-color="#2979ff" :percent="currentLevel.conditions.cumulativeSales.num"></u-line-progress>
                      <view class="row-center-between">
                        <text>累计销售额≥{{currentLevel.conditions.cumulativeSales.num}}元</text>
                        <text class="right">￥{{ currentLevel.salesAmount }}/{{currentLevel.conditions.cumulativeSales.num}}￥</text>
                      </view>
                    </view>
                  </view>
                  <!--  当前下线数(人) -->
                  <view style="background: #FFFFFF;padding: 10rpx" v-if="currentLevel.conditions.offlineNumber.checked">
                    <view style="margin-bottom: 5px;">
                      <u-line-progress active-color="#2979ff" :percent="currentLevel.conditions.offlineNumber.num"></u-line-progress>
                      <view class="row-center-between">
                        <text>累计下线数≥{{currentLevel.conditions.offlineNumber.num}}人</text>
                        <text class="right">￥{{ currentLevel.offlineNum }}/{{currentLevel.conditions.offlineNumber.num}}￥</text>
                      </view>
                    </view>
                  </view>
                  <!--  累计佣金(元) -->
                  <view style="background: #FFFFFF;padding: 10rpx" v-if="currentLevel.conditions.cumulativeCommission.checked">
                    <view style="margin-bottom: 5px;">
                      <u-line-progress active-color="#2979ff" :percent="currentLevel.conditions.cumulativeCommission.num"></u-line-progress>
                      <view class="row-center-between">
                        <text>累计佣金≥{{currentLevel.conditions.cumulativeCommission.num}}元</text>
                        <text class="right">￥{{ currentLevel.cumulativeCommission }}/{{currentLevel.conditions.cumulativeCommission.num}}￥</text>
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
import {mapGetters} from "vuex";
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
  computed: {
    ...mapGetters(['isLogin','memberInfo','shopData','distributionOtherData']),
    currentLevel({ gradeList, current }) {
      console.info(gradeList[current]);
      debugger
      return gradeList[current];
    },
  },
  methods:{
    init(){
      getDistributionCenterLevelList().then((res)=>{
        if(res.code === 0){
          this.gradeList = res.data;
          debugger
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