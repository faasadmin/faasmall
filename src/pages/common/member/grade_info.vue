<template>
    <view>
      <view class="privilege-swiper">
        <u-swiper :list="list" mode="none" :autoplay="false" :effect3d="true" :current="current" @change="changeSwiper"></u-swiper>
      </view>
      <view class="privilege-wrap">
          <view class="privilege-container">
                <view class="privilege-head">会员尊享特权</view>
                <view>
                  <u-grid :col="3">
                    <u-grid-item>
                      <u-icon name="photo" :size="46"></u-icon>
                      <view class="grid-text">图片</view>
                    </u-grid-item>
                    <u-grid-item>
                      <u-icon name="lock" :size="46"></u-icon>
                      <view class="grid-text">锁头</view>
                    </u-grid-item>
                    <u-grid-item>
                      <u-icon name="hourglass" :size="46"></u-icon>
                      <view class="grid-text">沙漏</view>
                    </u-grid-item>
                    <u-grid-item>
                      <u-icon name="hourglass" :size="46"></u-icon>
                      <view class="grid-text">沙漏</view>
                    </u-grid-item>
                  </u-grid>
                </view>
          </view>
      </view>

      <view class="panel-wrap">
        <view class="panel-container">
          <view class="panel-head border-bottom privilege-explain">
            <view>
              <text>特权说明</text>
            </view>
          </view>
          <view class="panel-body">

          </view>
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
  }
}
/deep/.privilege-explain{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>