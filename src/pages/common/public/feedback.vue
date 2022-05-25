<template>
  <view>
    <u-toast ref="uToast" />
    <view>
      <u-form :model="form" ref="uForm">
        <view class="feedback-wrap u-p-30">
          <!-- 选择类型 -->
          <u-form-item label-position="top" :border-bottom="false" :labelStyle="labelStyle" label="请选择类型" prop="type" label-width="150">
            <u-radio-group v-model="form.type" width="100%">
              <u-radio shape="circle" v-for="(item, index) in categoryList" :key="index" :name="item.name">{{ item.name }}</u-radio>
            </u-radio-group>
          </u-form-item>
          <!-- 相关描述 -->
          <view class="form-item">
            <label>
              <view class="inp-title">相关描述</view>
              <view class="area-box">
						<textarea
                class="inp-area"
                v-model="form.content"
                name="message"
                placeholder="客官~您对我们的服务还满意吗，请给予我们你的意见我们将做的更好~"
                placeholder-class="pl-style"
            />
                <view class="img-box">
                  <u-upload
                      :showProgress="false"
                      @on-uploaded="uploadSuccess"
                      @on-remove="uploadRemove"
                      :header="authorization"
                      :form-data="{'type':'feed_back'}"
                      action="http://127.0.0.1:8089/api/plugins/faas-mall-addons/api/common/upload"
                      width="140"
                      height="140"
                      maxCount="9"
                  ></u-upload>
                </view>
              </view>
            </label>
          </view>
          <!-- 联系方式 -->
          <view class="form-item">
            <label>
              <view class="inp-title">联系方式</view>
              <input class="inp" v-model="form.mobile" name="phone" type="number" placeholder="请输入您的联系电话" placeholder-class="pl-style" />
            </label>
          </view>
        </view>
      </u-form>
    </view>
    <!-- 底部按钮 -->
    <view class="foot_box u-flex u-row-between fixed-bottom">
      <u-button type="primary" shape="square" @tap="submit">提交</u-button>
    </view>
  </view>
</template>

<script>
import {addFeedBack, getFeedBackCategory} from "@/faasmall/api/feedback";
import jwt from "@/faasmall/utils/cache/jwt";
import setting from "@/faasmall/common/config";
export default {
  components: {},
  data() {
    return {
      authorization:{'Authorization': "Bearer " +  jwt.getAccessToken(),'appId': setting.APP_ID},
      form: {
        category: '',
        content: '',
        mobile: '',
        imgs: []
      },
      labelStyle: {
        'font-size': '30rpx',
        'font-weight': '600',
        color: '#333'
      },
      rules: {},
      imgList: [], //图片
      categoryList: [] //分类列表
    };
  },
  computed: {},
  onLoad() {
    this.getFeedbackCategory();
  },
  methods: {
    // 获取意见分类
    getFeedbackCategory() {
      let that = this;
      getFeedBackCategory().then(res => {
        if (res.code === 0) {
          that.categoryList = res.data;
        }
      });
    },
    // 上传图片成功
    uploadSuccess(e) {
      console.log(e)
      debugger
      this.form.images = [];
      e.forEach(item => {
        this.form.imgs.push(item.response.data.previewUrl);
      });
    },
    // 移除图片
    uploadRemove(index) {
      this.form.imgs.splice(index, 1);
    },
    // 提交意见
    submit() {
      let that = this;
      if(this.$isEmpty(that.form.type)){
        this.$refs.uToast.show({
          title: '反馈类型不能为空',
          type: 'error',
        })
        return;
      }
      if(this.$isEmpty(that.form.content)){
        this.$refs.uToast.show({
          title: '反馈内容不能为空',
          type: 'error',
        })
        return;
      }
      addFeedBack(that.form).then(res => {
        uni.hideKeyboard();
        if (res.code === 0) {
          that.$u.toast('提交成功');
          setTimeout(function(){
            that.$Router.back();
          },1000);
        }
      }).catch(error=>{
        console.error(error);
      });
    }
  }
};
</script>

<style lang="scss">
page{
  background-color: #fff;
}
.feedback-wrap {
  height: 100%;
}

.form-item {
   margin-top: 30rpx;
  .inp-title {
    font-size: 30rpx;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    align-items: center;
    margin-bottom: 30rpx;
  }
  .inp {
    width: 690rpx;
    height: 84rpx;
    background: rgba(249, 250, 251, 1);
    border-radius: 20rpx;
    padding: 0 30rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 38rpx;
  }
  .area-inp {
    height: 190upx;
    padding: 30rpx;
  }
  .pl-style {
    font-size: 26rpx;
    color: rgba(177, 179, 199, 1);
  }
}
.area-box {
  width: 690rpx;
  min-height: 306rpx;
  background: rgba(249, 250, 251, 1);
  border-radius: 20rpx;
  padding: 20rpx;
  .pl-style {
    font-size: 26rpx;
    font-weight: 500;
    color: rgba(177, 179, 199, 1);
    line-height: 50rpx;
  }
  .inp-area {
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    line-height: 50rpx;
    width: 100%;
  }
  .img-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20rpx;
  }
}

// 底部按钮
.foot_box {
  height: 100rpx;
  width: 100%;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>