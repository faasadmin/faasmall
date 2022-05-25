<template>
  <view>
    <view class="privilege-swiper">
      <u-swiper :list="list" mode="none" :autoplay="false" :effect3d="true" :current="current" @change="changeSwiper"></u-swiper>
    </view>
    <view class="privilege-wrap">
      <view class="privilege-container">
        <view class="privilege-head">会员尊享特权</view>
        <view class="privilege-explain">
          <view>
            <text class="title">获取</text>
            <view class="privilege-content">
              <view>
                <text>直接购买0.1</text>
              </view>
              <view>
                <text>累计消费￥600</text>
              </view>
            </view>
          </view>
          <view>
            <text class="title">说明</text>
            <view class="privilege-content">
              <text>黄金会员专享5.5折</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="fixed-bottom">
        <view class="footer">
          <u-button type="success">成功按钮</u-button>
        </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "grade",
  data() {
    return {
      current:0,
      list: [{
        image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
        title: '昨夜星辰昨夜风，画楼西畔桂堂东'
      },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
          title: '身无彩凤双飞翼，心有灵犀一点通'
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
          title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
        }
      ],
    }
  },
  methods:{
    changeSwiper(index){
      console.log(index)
    }
  }
}
</script>

<style lang="scss">
.privilege-swiper{
  padding: 20rpx;
}
.privilege-wrap{
  padding: 20rpx;
  .privilege-container{
    background: #FFFFFF;
    border-radius: 20rpx;
    .privilege-head{
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .privilege-explain{
      padding: 40rpx;
      .privilege-content{
        padding: 20rpx;
      }
    }
  }
}
.footer{
  padding: 20rpx;
  background: #FFFFFF;
}
</style>