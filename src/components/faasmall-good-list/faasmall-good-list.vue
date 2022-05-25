<template>
  <view class="goods-list">
    <view v-if="type === 'double'" class="goods-double row-center-between">
      <navigator v-for="(item, index) in list" :key="index" class="item bg-white mt-2" hover-class="none" open-type="navigate"
                 :url="'/pages/common/good/info?id=' + item.id + '&isTask=' + isTask">
        <view class="goods-img" style="width: 347rpx;height:347rpx;">
          <faasmall-custom-image :lazy-load="true" width="347rpx" height="347rpx" radius="10rpx" lazy-load :src="item.thumbnail"></faasmall-custom-image>
        </view>
        <view class="goods-info">
          <view class="goods-name line2">{{item.name}}</view>
          <view class="price mt-2">
              <view class="row-center-between">
                <price-format color="#FF2C3C"  class="mr-2" :first-size="34" :second-size="26" :subscript-size="26" :price="item.price" :weight="500"></price-format>
                <price-format class="muted" :firstSize="24" :secondSize="24" :subscript-size="24" :line-through="true" :price="item.linePrice"></price-format>
              </view>
          </view>
        </view>
      </navigator>
    </view>
    <view v-if="type === 'select'" class="goods-double row-center-between">
      <view v-for="(item, index) in list" :key="index" class="item bg-white mt-2" hover-class="none" open-type="navigate">
        <view class="leftselectBox rowRanges" v-if="selectFlag" @tap="selectFun(item)">
          <image style="
              position: absolute;
              z-index: 200;
              width: 30rpx;
							height: 30rpx;" v-if="item.selected" :src="$FILE_URL + '/file/img/common/select.png'" mode=""></image>
          <view v-else style="
               position: absolute;
              z-index: 200;
              box-sizing: border-box;
              width: 30rpx;
							height: 30rpx;
							border-radius: 50%;
							border: 1rpx solid #999999;"></view>
        </view>
        <view class="goods-img" style="width: 347rpx;height:347rpx;">
          <faasmall-custom-image :lazy-load="true" width="347rpx" height="347rpx" radius="10rpx" lazy-load :src="item.thumbnail"></faasmall-custom-image>
        </view>
        <view class="goods-info">
          <view class="goods-name line2">{{item.name}}</view>
          <view class="row-center-between price mt-2">
            <price-format color="#FF2C3C"  class="mr-2" :first-size="34" :second-size="26" :subscript-size="26" :price="item.price" :weight="500"></price-format>
          </view>
        </view>
      </view>
    </view>
    <view v-if="type === 'one'" class="goods-one mt-2 px-1">
      <navigator v-for="(item, index) in list" :key="index" class="item bg-white row br20" hover-class="none" open-type="navigate" :url="'/pages/common/good/info?id=' + item.id+ '&isTask=' + isTask">
        <view style="display: flex;align-items: center;justify-content: center;">
          <view class="goods-img" style="width: 200rpx;height:200rpx;">
            <faasmall-custom-image :lazy-load="true" width="200rpx" height="200rpx" radius="6rpx" lazy-load :src="item.thumbnail"></faasmall-custom-image>
          </view>
          <view class="goods-info ml-2">
            <view class="goods-name line2 mb10">{{item.name}}</view>
            <view class="row-between mt-2">
              <view class="row-center-between price mt-2">
                <price-format color="#FF2C3C"  class="mr-2" :first-size="34" :second-size="26" :subscript-size="26" :price="item.price" :weight="500"></price-format>
                <price-format class="muted" :firstSize="24" :secondSize="24" :subscript-size="24" :lineThrough="true" :price="item.linePrice"></price-format>
              </view>
            </view>
          </view>
        </view>
      </navigator>
    </view>
  </view>
</template>

<script>
export default {
  name:'good-list',
  props: {
    type: {
      type: String,
      default: 'double'
    },
    list: {
      type: Array,
      default: () => []
    },
    isTask: {
      type: [Boolean, Number],
      default: 0
    },
    selectFlag:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {

    };
  },
  created(){

  },
  methods:{
    selectFun(item){
      //item.selected = !item.selected;
      this.$set(item, 'selected', !item.selected);
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss">
.goods-list {
  .goods-double {
    flex-wrap: wrap;
    padding: 0 20rpx;
    align-items: stretch;
    .item {
      width: 347rpx;
      border-radius: 10rpx;

      .goods-info {
        padding: 10rpx;
      }
    }
  }

  .goods-hot .item {
    position: relative;
    padding: 30rpx 20rpx;
    border-radius: 10rpx;

    .goods-info {
      width: 450rpx;

      .sale {
        padding: 4rpx 18rpx;
        color: #F79C0C;
        background-color: rgba(247, 156, 12, .1);
      }
    }

    .paix,
    .index {
      position: absolute;
      top: 0;
      left: 27rpx;
      width: 50rpx;
      height: 54rpx;
      line-height: 60rpx;
      text-align: center;
      color: #621E09;
    }
  }

  .goods-one .item {
    padding: 20rpx;
    &:not(:last-of-type) {
      margin-bottom: 20rpx;
    }
  }
  .goods-new .item {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
    border-radius: 10rpx;
  }

}
</style>
