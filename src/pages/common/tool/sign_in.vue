<template>
    <view>
      <scroll-view scroll-y="true" class="scroll-Y">
        <view class="sign_container">
          <view class="sign_top">
            <view class="sign_user_info" style="width:100%;">
              <view class="sign_user_info_left" style="width:100%;">
                  <view class="flex-column" style="width:100%;">
                    <view style="color: #FFFFFF">当前积分</view>
                    <view class="row-center-center mt-3" style="width:100%;justify-content: space-between;">
                      <view class="row-center-center">
                        <image :src="$FILE_URL + '/file/img/sign/gold.png'" style="width: 45px;height: 45px;"></image>
                        <view class="sign_user_info_right_gold">{{signInfo.total}}</view>
                        <view class="row-center-center ml-2" style="color: #FFFFFF">
                          <view>明细</view>
                          <text class="iconfont icon-page-next1" style="font-size:10px;"></text>
                        </view>
                      </view>
                      <view class="sign_user_info_right">
                        <view>兑换商城</view>
                      </view>
                    </view>
                  </view>
              </view>
            </view>
          </view>
          <view class="sign_content">
            <view class="sign_continuous_wrap">
              <view class="sign_continuous">
                <view class="sign_title">
                  <text>每日签到,获得5积分,联系签到7天,可额外获得10积分</text>
                  <text>已连续签到{{signInfo.signCount}}天</text>
                </view>
                <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                <view class="sign_day_wrap">
                  <view class="sign_day_row" style="margin-bottom: 10px;">
                    <view class="sign_day_box">

                    </view>
                    <view class="sign_day_box">

                    </view>
                    <view class="sign_day_box">

                    </view>
                    <view class="sign_day_box">

                    </view>
                    <view class="sign_day_box">

                    </view>
                    <view class="sign_day_box">

                    </view>
                    <view class="sign_day_box">

                    </view>
                  </view>
                  <view class="sign_day_row">
                    <view class="sign_day_box" v-for="(item, index) in signInfo.signCalendar" :key="index">
                      <view :class="[item?'sign_active':'']" style="display: flex;justify-content: center;align-items: center;flex-direction: column;background: #f5f6fa;width: 80rpx;height: 120rpx;">
                        <view class="sign_day_box">
                          <view :class="['sign_day_icon',item?'sign_yes':'sign_no']"></view>
                        </view>
                        <view v-if="item">已签</view>
                        <view v-else>{{dailySignInTask.integral}}</view>
                      </view>
                      <view class="mt-1">{{index}}</view>
                    </view>
                  </view>
                </view>
                <view class="row-center-center mt-5">
                  <u-button shape="square" size="medium" v-if="signInfo.todaySignFlag">已签到</u-button>
                  <view v-else>
                    <!-- #ifdef H5 -->
                    <he-open-subscribe @open-subscribe-success="signIn" :template-id="templateIds">
                      <u-button shape="square" size="medium" v-else type="primary">签到领积分</u-button>
                    </he-open-subscribe>
                    <!-- #endif -->
                    <!--  #ifdef MP-WEIXIN -->
                    <u-button shape="square" size="medium" @click="signIn" type="primary">签到领积分</u-button>
                    <!-- #endif -->
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-if="showTask">
            <view class="mb-1" v-if="buyTaskList.display">
              <u-card title="购买任务" style="margin: 10px !important;">
                <view class="" slot="body" style="padding: 0 !important;">
                  <view class="sign_list_container">
                    <view class="sign_list_wrap">
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/buy.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{buyTaskList.taskData[0].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="buyTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toGood" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{buyTaskList.taskData[0].msg}}</view>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/order.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{buyTaskList.taskData[1].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="buyTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toGood" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{buyTaskList.taskData[1].msg}}</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-card>
            </view>
            <view class="mb-1" v-if="activeTaskList.display">
              <u-card title="活跃任务">
                <view class="" slot="body" style="padding: 0 !important;">
                  <view class="sign_list_container">
                    <view class="sign_list_wrap">
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/share.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{activeTaskList.taskData[0].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="activeTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toHome" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{activeTaskList.taskData[0].msg}}</view>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/browse.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{activeTaskList.taskData[1].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="activeTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toGood" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{activeTaskList.taskData[1].msg}}</view>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/invite.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{activeTaskList.taskData[2].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="activeTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toHome" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{activeTaskList.taskData[2].msg}}</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-card>
            </view>
            <view class="mb-1" v-if="baseTaskList.display">
              <u-card title="基础任务" >
                <view class="" slot="body" style="padding: 0 !important;">
                  <view class="sign_list_container">
                    <view class="sign_list_wrap">
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/info.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{baseTaskList.taskData[0].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="baseTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toMine" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{baseTaskList.taskData[0].msg}}</view>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="task_img_wrap">
                          <image :src="$FILE_URL + '/file/img/sign/bind.png'" class="task_img"></image>
                        </view>
                        <view class="task_item_wrap">
                          <view class="task_item_content">
                            <view class="ml-1">{{baseTaskList.taskData[1].name}}</view>
                            <view>
                              <u-button size="mini" shape="square" v-if="baseTaskList.taskData[0].complete" class="button-color">去领取</u-button>
                              <u-button size="mini" shape="square" v-else @click="toMine" class="button-color">去完成</u-button>
                            </view>
                          </view>
                          <view class="task_item_msg">{{baseTaskList.taskData[1].msg}}</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-card>
            </view>
          </view>
          <view class="task-cartoon" v-if="displayAnimation">
            <signInAnimation :score="signData.score" :title="signData.title" v-model="displayAnimation"></signInAnimation>
          </view>
        </view>
      </scroll-view>
      <u-toast ref="uToast" />
    </view>
</template>

<script>
import {getTaskList, signInInfo, signIn} from "@/faasmall/api/task";
import signInAnimation from './components/sign_in_animation.vue';
import {mapGetters} from "vuex";
export default {
  components:{
    signInAnimation
  },
  name: "sign_in",
  data(){
    return{
      isSign:false,
      sevenDayGold:0,
      dayGold:0,
      oneOpenGold:0,
      fiveOpenGold:0,
      oneRecover:0,
      displayAnimation:false,
      signData: {
        score: 0,
        title: '领取成功'
      },
      //用户头像
      avatar:'http://dummyimage.com/180x180',
      signInfo:{
        //用户积分
        total:0,
        //连续签到天数
        signCount:0,
        //签到日历
        signCalendar:[],
        //今天是否签到
        todaySignFlag:false,
      },
      //是否显示任务列表
      showTask:false,
      dailySignInTask:{
        integral:0,
      },
      continuousSignInTask:{},
      //购买任务
      buyTaskList: {
        name:'',
        display:true,
        taskData:[{
          name:'',
          msg:'',
          complete:false,
        },{
          name:'',
          msg:'',
          complete:false,
        }],
      },
      //基本任务
      baseTaskList: {
        name:'',
        display:true,
        taskData:[{
          name:'',
          msg:'',
          complete:false,
        },{
          name:'',
          msg:'',
          complete:false,
        },{
          name:'',
          msg:'',
          complete:false,
        }],
      },
      //活动任务
      activeTaskList: {
        name:'',
        display:true,
        taskData:[{
          name:'',
          msg:'',
          complete:false,
        },{
          name:'',
          msg:'',
          complete:false,
        },{
          name:'',
          msg:'',
          complete:false,
        }],
      },
    }
  },
  onShow() {

  },
  onLoad(){
    this.init();
  },
  computed: {
    ...mapGetters(['subscribeData']),
    templateIds: function() {
      return [this.subscribeData.pointsChangeTid];
    },
  },
  filters: {
    formatTime: function (date, fmt) {
      var date = new Date(date);
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      };
      for (var k in o) {
        if (new RegExp('('+k+')').test(fmt)) {
          var str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
        }
      }
      return fmt;
    }
  },
  methods:{
    toMine(){
      uni.switchTab({
        url: '/pages/tabbar/mine/index'
      });
    },
    toHome(){
      uni.switchTab({
        url: '/pages/tabbar/main/index'
      });
    },
    toGood(){
      uni.navigateTo({
        url: '/pages/common/good/list'
      });
    },
    init() {
      this.loadSignData();
      this.loadData();
    },
    loadSignData(){
        signInInfo().then((res)=>{
          debugger
          if(res.code === 0){
            this.signInfo = res.data;
          }
        }).catch(error=>{
           console.error(error);
        });
    },
    loadData(){
      getTaskList().then((res)=>{
          if(res.code === 0 ){
            debugger
            this.showTask = res.data.show;
            this.buyTaskList = res.data.buyTaskList;
            this.baseTaskList = res.data.baseTaskList;
            this.activeTaskList = res.data.activeTaskList;
            this.dailySignInTask = res.data.dailySignInTask;
            this.continuousSignInTask = res.data.continuousSignInTask;
          }
      }).catch(error=>{
        console.error(error);
      });
    },
    doSignIn(){
      signIn().then((res)=>{
        if(res.code === 0){
          that.signData.score = res.data;
          that.displayAnimation = true;
          //signInfo.signCalendar
          that.init();
        }else {
          that.$refs.uToast.show({
            title: res.msg,
            type: 'error',
          })
        }
      }).catch(error=>{
        console.error(error);
      });
    },
    signIn(){
      let that = this;
      //#ifdef MP_WEIXIN
      uni.requestSubscribeMessage({
        tmplIds: that.templateIds,
        success: function() {},
        fail: function() {},
        complete: function() {
          that.doSignIn();
        },
      });
      //#endif
      //#ifdef H5
      that.doSignIn();
      //#endif
    }
  }
}
</script>

<style lang="scss" scoped>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  /* background-color: #ffffff;  */
}
.top_view {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  /* background-color: #ffffff;  */
  top: 0;
  z-index: 999;
}
.mask{
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  z-index:888;
  background-color: rgba(0, 0, 0, 0.6);
}
.sign_yes{
  background-image: url($FILE_URL + '/file/img/sign/yes.png');
}
.sign_no{
  background-image: url($FILE_URL + '/file/img/sign/no.png')
}
.back{
  position: absolute;
  z-index: 1000;
  top: calc(var(--status-bar-height) + 20px);
  left: 20px;
}
.sign_user_info_right_gold{
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}
.sign_user_info_right{
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  border: 1px #ffff solid;
  width: 90px;
  height: 30px;
  color: #FFFFFF;
  justify-content: center;
}
.sign_active{
  background: #fff3cf !important;
}
.sign_container{
  .sign_top{
    background: #ec5250;
    padding: 50px 20px 20px 20px;
    height: 200px;
    border-radius: 0 0 10% 10%;
    .sign_user_info{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .sign_user_info_left{
        display: flex;
        flex-direction: row;
        align-items: center;
        .sign_user_info_left_desc{
          margin-left: 5px;
          .sign_user_info_left_desc_continuous{
            font-size: 18px;
            font-weight: bold;
            color: #FFFFFF;
          }
          .sign_user_info_left_desc_note{
            font-size: 12px;
            color: #F0AD4E;
          }
        }
      }
    }
  }
  .sign_content{
    height: 400rpx;
    position: relative;
    width: 100%;
    //top: 180px;
    .sign_continuous_wrap{
      position: absolute;
      margin-top: -50px;
      width: 100%;
      padding: 0 20rpx 0 20rpx;
      //margin-top: var(--status-bar-height);
      .sign_continuous{
        background: #ffffff;
        border-radius: 15px;
        //height: 170px;
        padding: 0 10px 10px 10px;
        .sign_title{
          flex-direction: column;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          //font-weight: bold;
          color: #000000;
        }
        .sign_day_wrap{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          .sign_day_row{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .sign_day_box{
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              .sign_day_icon{
                width: 32px;
                height: 32px;
                background-position: 0% 0%;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffffff;
                font-size: 3px;
              }
            }
          }
        }

      }
    }

  }
}
.sign_list_container{
  .sign_list_wrap{
    background: #ffffff;
    border-radius: 15px;
    .sign_list_item{
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0px;
      .task_img_wrap{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .task_img{
          width: 45px;
          height: 45px;
        }
      }
      .task_item_wrap{
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        .task_item_content{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          .button-color{
            background: #FF7F00;
            color: #FFFFFF;
          }
        }
        .task_item_msg{
          font-size: 10px;
          padding-left: 5px;
          width: 100%;
          margin-top: 5px;
        }
      }
    }
  }
}
.popup-sign-box{
  position: fixed;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  top:0%;
  z-index: 998;
  width:100%;
  height: 100%;
  // background: #C0C0C0;
  .popup-sign-wrap{
    background: #FFFFFF;
    width: 80%;
    height: 280px;
    .popub-sign-top{
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 25px;
      .popub-sign-img{
        width: 200px;
        height: 200px;
        position: absolute;
      }
    }
    .popub-sign-content{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 100px;
      .popub-sign-gold{
        font-size: 30px;
        color: #febf25;
        margin-top: 5px;
      }
      .popub-sign-congratulations{
        font-size: 20px;
        font-weight: bold;
        margin-top: 5px;
      }
      .popub-sign-note{
        font-size: 15px;
        margin-top: 5px;
      }
    }
    .popup-sign-footer{
      padding: 20px;
    }
  }
}
.task-cartoon {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}
</style>