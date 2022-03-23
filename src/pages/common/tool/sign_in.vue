<template>
    <view>
      <faasmall-navbar :is-back="true" title="签到"></faasmall-navbar>
      <scroll-view scroll-y="true" class="scroll-Y">
        <view class="sign_container">
          <view class="sign_top">
            <view class="sign_user_info">
              <view class="sign_user_info_left">
                <image :src="avatar" style="width: 48px;height: 48px;border-radius: 25px;"></image>
                <view class="sign_user_info_left_desc">
                  <view class="sign_user_info_left_desc_continuous">已连续签到{{signInfo.signCount}}天</view>
                  <view class="sign_user_info_left_desc_note"></view>
                </view>
              </view>
              <view class="sign_user_info_right">
                <image src="/static/img/sign/gold.png" style="width: 32px;height: 32px;"></image>
                <view class="sign_user_info_right_gold">{{signInfo.total}}</view>
              </view>
            </view>
          </view>
          <view class="sign_content">
            <view class="sign_continuous_wrap">
              <view class="sign_continuous">
                <view class="sign_title">每日签到,获得5积分,联系签到7天,可额外获得10积分</view>
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
                      <view class="sign_day_hiddle">
                        隐藏大礼
                        <view class="info-panel-triple"></view>
                      </view>
                    </view>
                  </view>
                  <view class="sign_day_row" style="padding: 0 15px 0 15px;">
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=1?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=2?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=3?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=4?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=5?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=6?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                    <view class="sign_day_box">
                      <view :class="['sign_day_icon',signInfo.signCount>=7?'sign_no':'sign_yes']">{{dailySignInTask.increase}}</view>
                    </view>
                  </view>
                  <view class="sign_day_row" style="padding: 0 15px 0 15px;">
                    <view class="sign_day_box" v-for="(value, key) in signInfo.signCalendar" :key="key">
                      <view>{{key}}</view>
                    </view>
                  </view>
                </view>
                <view class="row-center-center">
                  <u-button size="medium" v-if="signInfo.todaySignFlag" @click="signIn" >已签到</u-button>
                  <u-button size="medium" v-else type="primary">签到领积分</u-button>
                </view>
              </view>
            </view>
          </view>
          <view v-if="show">
            <view class="mb-1" v-if="buyTaskList.display">
              <u-card title="购买任务" >
                <view class="" slot="body" style="padding: 0 !important;">
                  <view class="sign_list_container">
                    <view class="sign_list_wrap">
                      <view class="sign_list_item">
                        <view class="sign_list_left">
                          <image src="/static/img/sign/one.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{buyTaskList.taskData[0].name}}</view>
                            <view>{{buyTaskList.taskData[0].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right" @tap="testOne">
                          <text v-if="buyTaskList.taskData[0].complete">去领取</text>
                          <text v-else >去完成</text>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="sign_list_left">
                          <image src="/static/img/sign/five.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{buyTaskList.taskData[1].name}}</view>
                            <view>{{buyTaskList.taskData[1].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right">
                          <text v-if="buyTaskList.taskData[1].complete">去领取</text>
                          <text v-else >去完成</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-card>
            </view>
            <view class="mb-1" v-if="activeTaskList.display">
              <u-card title="活跃任务" >
                <view class="" slot="body" style="padding: 0 !important;">
                  <view class="sign_list_container">
                    <view class="sign_list_wrap">
                      <view class="sign_list_item">
                        <view class="sign_list_left">
                          <image src="/static/img/sign/one.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{activeTaskList.taskData[0].name}}</view>
                            <view>{{activeTaskList.taskData[0].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right">
                          <text v-if="activeTaskList.taskData[0].complete">去领取</text>
                          <text v-else >去完成</text>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="sign_list_left">
                          <image src="/static/img/sign/five.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{activeTaskList.taskData[1].name}}</view>
                            <view>{{activeTaskList.taskData[1].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right">
                          <text v-if="activeTaskList.taskData[1].complete">去领取</text>
                          <text v-else >去完成</text>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="sign_list_left">
                          <image src="/static/img/sign/recover.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{activeTaskList.taskData[2].name}}</view>
                            <view>{{activeTaskList.taskData[2].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right">
                          <text v-if="activeTaskList.taskData[2].complete">去领取</text>
                          <text v-else >去完成</text>
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
                        <view class="sign_list_left">
                          <image src="/static/img/sign/one.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{baseTaskList.taskData[0].name}}</view>
                            <view>{{baseTaskList.taskData[0].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right">
                          <text v-if="baseTaskList.taskData[0].complete">去领取</text>
                          <text v-else >去完成</text>
                        </view>
                      </view>
                      <view style="height: 1px;width: 100%;background: #E5E5E5;"></view>
                      <view class="sign_list_item">
                        <view class="sign_list_left">
                          <image src="/static/img/sign/five.png" style="width: 32px;height: 32px;"></image>
                          <view class="sign_list_left_desc">
                            <view>{{baseTaskList.taskData[1].name}}</view>
                            <view>{{baseTaskList.taskData[1].msg}}</view>
                          </view>
                        </view>
                        <view class="sign_list_right">
                          <text v-if="baseTaskList.taskData[1].complete">去领取</text>
                          <text v-else >去完成</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-card>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
</template>

<script>
import {getTaskList, signInInfo, testOne, testTwo,signIn} from "@/faasmall/api/task";

export default {
  name: "sign_in",
  data(){
    return{
      isSign:false,
      sevenDayGold:0,
      dayGold:0,
      oneOpenGold:0,
      fiveOpenGold:0,
      oneRecover:0,
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
      show:true,
      dailySignInTask:{
        increase:'',
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
    init() {
      this.loadSignData();
      this.loadData();
    },
    loadSignData(){
        signInInfo().then((res)=>{
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
            this.show = res.data.show;
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
    testOne(){
      testOne();
    },
    testTwo(){
      testTwo();
    },
    signIn(){
      signIn().then.then((res)=>{
        if(res.code === 0){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        }else {
          this.$message.error(res.msg);
        }
      }).catch(error=>{
        console.error(error);
      });
    }
  }
}
</script>

<style lang="scss">
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
.sign_day_liwu{
  background-image: url(/static/img/sign/liwu.png);
  width: 32px;
  height: 32px;
  background-position: 0% 0%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fb0000;
  font-weight: bold;
  font-size: 3px;
}
.sign_day_hiddle{
  background: #2e73ff;
  height: 25px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  font-size: 5px;
  position: relative;
  color: #ffffff;
  .info-panel-triple{
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: #2e73ff;
    position: absolute;
    top: 25px;
  }
}
.sign_yes{
  background-image: url(/static/img/sign/yes.png)
}
.sign_no{
  background-image: url(/static/img/sign/no.png)
}
.back{
  position: absolute;
  z-index: 1000;
  top: calc(var(--status-bar-height) + 20px);
  left: 20px;
}
.sign_container{
  .sign_top{
    background: #ec5250;
    padding: 50px 20px 20px 20px;
    height: 200px;
    .sign_user_info{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
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
      .sign_user_info_right{
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 5px;
        border: 1px #ffff solid;
        width: 90px;
        justify-content: center;
        .sign_user_info_right_gold{
          font-size: 18px;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
  .sign_content{
    height: 150px;
    position: relative;
    width: 100%;
    //top: 180px;
    .sign_continuous_wrap{
      position: absolute;
      margin-top: -50px;
      width: 100%;
      padding: 0 20px 0 20px;
      //margin-top: var(--status-bar-height);
      .sign_continuous{
        background: #ffffff;
        border-radius: 15px;
        //height: 170px;
        padding: 0 10px 10px 10px;
        .sign_title{
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
  //padding: 20px;
  .sign_list_wrap{
    background: #ffffff;
    border-radius: 15px;
    //padding: 10px;
    .sign_list_item{
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .sign_list_left{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .sign_list_left_desc{
          margin-left: 10px;
        }
      }
      .sign_list_right{
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2e73ff;
        padding: 2px;
        color: #ffffff;
        width: 80px;
        border-radius: 5px;
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
</style>