<template>
    <view>
        <view class="head-wrap">
          <view  class="head-container">
            <view class="avatar">
              <u-image src="/static/logo.png" shape="circle" width="120rpx" height="120rpx"></u-image>
            </view>
            <view class="content">
                <view class="row-center-between">
                  <view><text>faasadmin</text></view>
                  <view v-if="gradeInfo.rule" @tap="$Router.push({path:'/pages/common/member/grade_rule',query:{rule:gradeInfo.rule}})"><text>规则</text></view>
                </view>
                <view>
                  <text>{{gradeInfo.name}}</text>
                </view>
            </view>
          </view>
        </view>
        <view class="privilege-wrap">
          <view class="uni-padding-wrap" style="margin-top: 10px;border-radius: 20px;background-color:#ffffff" :style="[{height: swiperHeight+ 'px'}]">
            <view class="page-section swiper">
              <view class="page-section-spacing">
                <swiper class="swiper" :current="current"  @change="changeSwiper" :indicator-dots="indicatorDots" :style="[{height: swiperHeight+ 'px'}]" :duration="duration">
                  <swiper-item v-for="(item,index) in gradeList" :key="index">
                      <memberGrade :info="gradeInfo" :grade="item" />
                  </swiper-item>
                </swiper>
              </view>
            </view>
          </view>
          <view style="margin-top: 10rpx;">
            <u-button v-if="this.gradeList[this.current] && this.gradeList[this.current].isBuy ===1" size="default" type="primary">{{this.gradeList[this.current].price}}￥ 立即升级</u-button>
            <u-button v-else size="default" type="primary">立即升级</u-button>
          </view>
        </view>
    </view>
</template>

<script>
import {getMemberGradeInfo,getMemberGradeList} from "@/faasmall/api/member";
import memberGrade from "./component/member-grade";
export default {
  name: "member",
  components:{memberGrade},
  data(){
    return{
      indicatorDots: true,
      duration: 500,
      swiperHeight:530,
      gradeInfo:{},
      gradeList:[],
      current:0,
    }
  },
  onShow(){
    this.init();
  },
  onLoad(){

  },
  methods:{
    buy(){
      console.log(this.gradeList[this.current]);
      debugger
      return this.gradeList[this.current].isBuy === 1;
    },
    upgrade(){
      return this.gradeInfo.name != this.gradeList[this.current].name;
    },
    init(){
      getMemberGradeInfo().then((res)=>{
          this.gradeInfo = res.data;
      }).catch(error=>{
        console.error(error);
      })
      getMemberGradeList().then((res)=>{
        this.gradeList = res.data;
      }).catch(error=>{
        console.error(error);
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

<style lang="scss">
.head-wrap{
   padding: 20rpx;
  .head-container{
    //background-image: url("http://dummyimage.com/375x100");
    background:#FFFFFF;
    width: 100%;
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 20rpx;
    .avatar{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .content{
      flex:1;
      display: flex;
      flex-direction: column;
      padding: 20rpx;
    }
  }
}
.privilege-wrap{
  padding: 20rpx;

  .privilege-container{
    background: #FFFFFF;
    width: 100%;
    height: 400rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 20rpx;
    padding-top: 30rpx;
    .privilege-title{

    }
    .privilege-content{
      width: 100%;
      padding: 50rpx;
    }
  }
}
.grade-list{
  .grade-item{
    margin-bottom: 20rpx;
  }
}

.groupon-scroll {
  height: 170rpx;
  .groupon-card-wrap {
    height: 170rpx;
    width: 730rpx;
  }
}

.coupon-card {
  width: 343rpx;
  height: 170rpx;
  background: linear-gradient(90deg, #f8dca5, #efc480);
  border-radius: 10rpx;
  mask: url($FILE_URL +'/file/img/coupon/coupon_mini_bg.png');
  mask-size: 100% 100%;
  .card-left {
    height: 100%;
    width: 260rpx;
    .price {
      color: #4f3a1e;
      font-size: 30rpx;
      font-weight: bold;
      &::before {
        content: '￥';
        font-size: 20rpx;
      }
    }
    .notice {
      font-size: 22rpx;
      font-weight: 500;
      color: #a8700d;
    }
  }
  .card-right {
    height: 100%;
    width: 60rpx;
    .get-btn {
      font-size: 24rpx;
      font-weight: 500;
      text-align: right;
      color: #a8700d;
      writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
      writing-mode: tb-lr; /*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
    }
  }
}
</style>