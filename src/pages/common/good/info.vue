<template>
  <view>
    <view class="productDetail">
      <!-- 轮播图 -->
      <swiper-list :bannerList="goodInfo.carousel" :height="400"></swiper-list>
      <!-- 价格标题 -->
      <view class="title-wrapper">
        <view class="price-content">
          <view class="price flex-1 flex">
            <view class="primary mr10">
              <price-format :first-size="46" :second-size="32" :subscript-size="32" :price="goodInfo.price"
                            :weight="500"></price-format>
            </view>
            <view class="line-through muted md">
              <price-format :price="goodInfo.price"></price-format>
            </view>
          </view>
<!--          <image class="icon-share" src="/static/img/good/icon_share.png" @tap="showShareBtn=true"></image>-->
        </view>
        <view class="name">{{ goodInfo.name }}</view>
        <view class="name">{{ goodInfo.subTitle }}</view>
        <view class="flex justify-between align-center xl mt-1">
          <view class="row-center-center">
            <text class="iconfont icon-kucun icon-md"></text>
            <text>库存: {{goodInfo.stocks || 0}}件</text>
          </view>
          <view class="row-center-center">
            <text class="iconfont icon-kehuxiaoliang3x icon-md"></text>
            <text>销量: {{goodInfo.sales || 0}}件</text>
          </view>
          <view class="row-center-center">
            <text class="iconfont icon-jilu icon-md"></text>
            <text>浏览: {{goodInfo.views || 0}}次</text>
          </view>
        </view>
      </view>
      <!--商品可用优惠卷-->
      <grant-coupon v-if="goodInfo.grantCoupon.length" :grantCouponList="goodInfo.grantCoupon"/>
      <!-- 活动/促销 -->
      <good-promotion v-if="goodInfo.giftCoupon.length" :giftCouponList="goodInfo.giftCoupon" :giftPointsStatus="goodInfo.giftPointsStatus" :giftPoints="goodInfo.giftPoints" :giftBalanceStatus="goodInfo.giftBalanceStatus" :giftBalance="goodInfo.giftBalance"/>
      <!-- 规格 -->
      <view class="mt-1">
        <!-- 规格 -->
        <view class="guige-wrapper">
          <view class="item-wrapper" @tap="toggleSpec">
            <view style="display: flex;width: 100%;justify-content: space-between;align-items: center">
              <view>
                <text class="title">已选</text>
              </view>
              <view style="display: flex;flex-direction: column;width: 100%;flex: 1">
                <view style="display: flex;">
                  <text class="content">{{ selectSpecWhole.length > 0 ? selectSpecWhole.join(" "): '请选择规格' }}</text>
                  <view class="right-icon"><text class="iconfont icon-page-next1"></text></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 服务 -->
        <good-service :serviceList="goodInfo.servicesData"></good-service>
      </view>

      <!-- 运费 -->
      <view class="mt-1">
        <view  class="guige-wrapper">
          <view class="item-wrapper">
            <text class="title">快递</text>
            <text class="content">免运费</text>
          </view>
        </view>
        <view  class="guige-wrapper">
          <view class="item-wrapper">
            <text class="title">包邮</text>
            <text class="content">单品满0元包邮</text>
            <view class="right-icon"><text class="iconfont icon-page-next1"></text></view>
          </view>
        </view>
        <view  class="guige-wrapper">
          <view class="item-wrapper">
            <text class="title">起送</text>
            <text class="content">满1元起送</text>
            <view class="right-icon"><text class="iconfont icon-page-next1"></text></view>
          </view>
        </view>
      </view>

      <!--商品评价 -->
      <good-evaluation :goods-id="goodId"></good-evaluation>

      <!--商品详情  -->
      <view class="detail-wrapper">
        <view v-if="goodInfo.parameter.length > 0" style="display: flex;justify-content: space-between;align-items: center;height: 100rpx;padding: 20rpx;border-bottom: 2rpx solid #D1D1D1">
          <view style="display: flex;justify-content: flex-end;width: 100%;margin-right: 80rpx;" @tap="classifyTabChange(1)">
            <view style="height: 94rpx;display: flex;justify-content: center;align-items: center;padding-bottom: 2rpx" :class="classifyTabCurrent===1?'active':''">详情</view>
          </view>
          <view style="display: flex;justify-content: flex-start;width: 100%;margin-left: 80rpx" @tap="classifyTabChange(2)">
            <view style="height: 94rpx;display: flex;justify-content: center;align-items: center" :class="classifyTabCurrent===2?'active':''">参数</view>
          </view>
        </view>
        <view v-else style="display: flex;justify-content: center;align-items: center;height: 100rpx;padding: 20rpx;border-bottom: 2rpx solid #D1D1D1">
          <text>详情</text>
        </view>
        <view class="content">
          <view v-if="classifyTabCurrent===1"><rich-text :nodes="goodInfo.content"></rich-text></view>
          <view v-else>
            <u-table>
              <u-tr  v-for="(item, index) in goodInfo.parameter" :key="item.id">
                <u-td>{{item.name}}</u-td>
                <u-td>{{item.value}}</u-td>
              </u-tr>
            </u-table>
          </view>
        </view>
      </view>
      <!-- 底部footer -->
      <view class="footer-wrapper">
        <view class="footer-icon-wrapper">
          <view class="footer-icon-item">
            <view class="footer-icon"><text class="iconfont icon-shouye"></text></view>
            <text class="footer-text">首页</text>
          </view>
          <view class="footer-icon-item" @tap="toCollect">
            <view class="footer-icon" v-if="collectFlag"><text class="iconfont icon-shoucang1"></text></view>
            <view class="footer-icon" v-else><text class="iconfont icon-shoucang"></text></view>
            <text class="footer-text">收藏</text>
          </view>
          <view class="footer-icon-item" style="position: relative" @tap="goCart">
            <view class="fm-badge" v-if="cartNum >0 " :style="[baddgeStyle]">{{ cartNum }} </view>
            <view class="footer-icon"><text class="iconfont icon-gouwuche"></text></view>
            <text class="footer-text">购物车</text>
          </view>
        </view>
        <view class="footer-btn-wrapper">
          <u-button shape="square" type="warning" class="footer-btn add-cart" @click="showSku = true">加入购物车</u-button>
          <u-button shape="square" type="error" class="footer-btn buy" @click="showSku = true">立即购买</u-button>
        </view>
      </view>

      <u-toast ref="uToast"></u-toast>
      <vk-data-goods-sku-popup
          ref="skuPopup"
          v-model="showSku"
          border-radius="20"
          :amountType="0"
          :custom-action="findGoodsInfo"
          :mode="form.skuMode"
          :buy-now-text="form.buyNowText"
          :add-cart-text="form.addCartText"
          :no-stock-text="form.noStockText"
          :min-buy-num="form.minBuyNum"
          :max-buy-num="form.maxBuyNum"
          :step-buy-num="form.stepBuyNum"
          :stepStrictly="form.stepStrictly"
          :show-close="form.showClose"
          :mask-close-able="form.maskCloseAble"
          :hide-stock="form.hideStock"
          :theme="form.theme"
          :useCache="false"
          :goods-id="goodId"
          :default-select="form.defaultSelect"
          goods-thumb-name="thumbnail"
          sku-arr-name="skus"
          stock-name="stocks"
          spec-list-name="spuData"
          sku-list-name="skuData"
          sku-id-name="id"
          goods-id-name="id"
          @open="openSkuPopup"
          @close="closeSkuPopup"
          @add-cart="addCart"
          @buy-now="buyNow"
          @select-good="selectGood"
          @select-array="selectArray"
          @select-whole="selectWhole"
      ></vk-data-goods-sku-popup>
    </view>
  </view>
</template>

<script>
import swiperList from '@/pages/common/good/components/swiper-list.vue';
import vkDataGoodsSkuPopup from '../../../components/vk-data-goods-sku-popup/vk-data-goods-sku-popup';
import vkDataInputNumberBox from '../../../components/vk-data-input-number-box/vk-data-input-number-box';
import goodPromotion from './components/good-promotion';
import grantCoupon from './components/grant-coupon';
import goodService from './components/good-service';
import goodCoupon from './components/good-coupon';
import goodEvaluation from './components/good-evaluation';
import priceFormat from '../../../components/price-format/price-format';
import {getGoodInfo} from "@/faasmall/api/good";
import graceRichText  from '@/faasmall/utils/rechText'
import {addCart} from "@/faasmall/api/cart";
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
var that;
export default {
  components: {
    swiperList,
    vkDataGoodsSkuPopup,
    vkDataInputNumberBox,
    priceFormat,
    goodService,
    goodCoupon,
    goodPromotion,
    grantCoupon,
    goodEvaluation,
  },
  mounted() {
    this.getCartNumber().then((res)=>{
      this.cartNum = res;
    })
  },
  data() {
    return {
      cartNum:0,
      goodId:'',
      serviceShow:false,
      //是否收藏
      collectFlag:false,
      goodInfo: {
        stocks:0,//库存
        sales:0,//销量
        views:0,//浏览
        servicesData:[],
        skuData:[], //sku
        spuData:[], //spu
        orderEvaluateData:[], //评价
        parameter:[],
        //价格
        price:0,
        //商品可用优惠卷
        grantCoupon:[],
        //购买商品赠送优惠卷
        giftCoupon:[],
      },
      form:{
        skuMode:1,
        buyNowText:"立即购买",
        addCartText:"加入购物车",
        noStockText:"该商品已抢完",
        minBuyNum:1,
        maxBuyNum:10000,
        stepBuyNum:1,
        stepStrictly:false,
        hideStock:false,
        theme:"default", // 主题
      },
      showSku: false,
      selectArr: [], //存放被选中的值
      selectSpecWhole:[],
      typeList:[{
        typeName: '详情'
      }, {
        typeName: '参数'
      }],
      typeCurrent: 0,
      classifyTabCurrent: 1
    };
  },
  computed: {
    ...mapGetters(['isLogin','memberInfo','shopData']),
    baddgeStyle: function () {
      let style = {};
      if (this.cartNum.length === 1) {
        style.borderRadius = '50%';
        style.width = '30rpx';
        style.height = '30rpx';
        style.textAlign = 'center';
        style.lineHeight = '24rpx';
      } else {
        style.borderRadius = '15rpx';
        style.padding = '5rpx 7rpx';
      }
      return style;
    }
  },
  onShow(){
    this.reset();
    this.init();
  },
  onLoad(options) {
    that = this;
    this.goodId = options.id;
    debugger
    //this.$refs.skuPopup.init();
    this.init();
  },
  methods: {
    ...mapActions(['addFootPrint','addCollect','collectExist','getCartNumber']),
    reset(){
      this.goodInfo = {
          servicesData:[],
          skuData:[],
          spuData:[],
          orderEvaluateData:[],
          parameter:[],
          price:0,
          grantCoupon:[],
          giftCoupon:[]
      }
    },
    toFootPrint(){
      this.addFootPrint({goodId:this.goodId});
    },
    goCart(){
      uni.switchTab({
        url: '/pages/tabbar/cart/index'
      });
    },
    toCollect(){
      this.addCollect({goodId:this.goodId}).then((res)=>{
        if(res.code === 0){
          this.$refs.uToast.show({
            title: '收藏成功',
          })
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    collectStatus(){
      //是否登陆
      this.collectExist({id:this.goodId}).then((res)=>{
        if(res.code === 0){
          this.collectFlag = res.data;
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    classifyTabChange(index){
      this.classifyTabCurrent = index;
    },
    typeChange(index) {
      this.typeCurrent = index;
    },
    // 初始化
    init(){
      this.toFootPrint();
      this.findGoodsInfo();
      this.collectStatus();
    },
    getGoodInfo(){

    },
    findGoodsInfo(){
      console.info(that.goodId);
      return new Promise(function (resolve, reject) {
        getGoodInfo({id:that.goodId}).then((res)=>{
          that.goodInfo = res.data;
          that.goodInfo.content = graceRichText.format(that.goodInfo.content);
          console.info(that.goodInfo);
          resolve(that.goodInfo);
        }).catch(error=>{
          console.error(error)
          reject(error);
        })
      })
    },
    //规格弹窗开关
    toggleSpec() {
      this.showSku = true;
    },
    // sku组件 开始-----------------------------------------------------------
    openSkuPopup(){
      console.log("监听 - 打开sku组件");
      // that.$refs.skuPopup.selectSku({
      // 	sku:["白色","256G","公开版"],
      // 	num:5
      // });
    },
    closeSkuPopup(){
      console.log("监听 - 关闭sku组件");
      //this.$refs.skuPopup.init();
    },
    handleSku(selectSku){
      debugger
      selectSku.name = this.goodInfo.name;
      selectSku.goodId = this.goodInfo.id;
      selectSku.number = selectSku.buy_num;
      selectSku.goodSkuName = selectSku.selectWhole.join(",");
      selectSku.goodSkuId = selectSku.id;
      selectSku.message = '';
      // if(selectSku.hasOwnProperty('thumbnail')){
      //   if(this.$isEmpty(selectSku.thumbnail)){
      //     selectSku.thumbnail = this.goodInfo.thumbnail;
      //   }
      // }else {
      //   selectSku.thumbnail = this.goodInfo.thumbnail;
      // }
    },
    // 加入购物车前的判断
    addCartFn(obj){
      let { selectSku } = obj;
      // 模拟添加到购物车,请替换成你自己的添加到购物车逻辑
      let res = {};
      let name = selectSku.goods_name;
      if(selectSku.sku_name != "默认"){
        name += "-"+selectSku.sku_name;
      }
      res.msg = `${name} 已添加到购物车`;
      if(typeof obj.success == "function") obj.success(res);
    },
    // 加入购物车按钮
    addCart(selectSku){
      console.log("监听 - 加入购物车");
      console.log(selectSku)
      this.handleSku(selectSku);
      addCart(selectSku).then((response)=>{
        if (response.code === 0) {
          this.$refs.uToast.show({
            type: 'success',
            title: '成功',
            message: "加入成功",
            iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
          })
        } else {
          this.$refs.uToast.show({
            type: 'error',
            icon: false,
            title: '失败',
            message: response.msg,
            iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
          })
        }
      }).catch(error=>{
        console.error(error)
      });
    },
    // 立即购买
    buyNow(selectSku){
      console.log("监听 - 立即购买");
      this.handleSku(selectSku);
      var confirmGoodList = [];
      //uni.navigateTo({
      //  url: 'pages/common/order/submit?goodInfo=' + encodeURIComponent(JSON.stringify(selectSku))
      //});
      confirmGoodList.push({
        source:'good',
        goodId: this.goodInfo.id,
        goodSkuId: selectSku.goodSkuId,
        number: selectSku.number
      });
      this.jump('/pages/common/order/submit', {goodList: confirmGoodList,source:'goodInfo',type:1});
    },
    // 路由跳转
    jump(path, parmas) {
      this.$Router.push({
        path: path,
        query: parmas
      });
    },
    selectGood(selectSku){

    },
    selectArray(selectArray){
      console.log('选中：' + selectArray)
    },
    selectWhole(selectWhole){
      console.log('选中：' + selectWhole.join(" "))
      this.selectSpecWhole = selectWhole;
    },
    toast(msg){
      uni.showToast({
        title: msg,
        icon:"none"
      });
    },
    // 参数配置开始 -----------------------------------------------------------
    goodsChange(e){
      that.goods_id = e.detail.value;
      that.sku_key = true;
    },
    showCloseChange(e){
      that.form.showClose = e.detail.value;
      that.sku_key = true;
    },
    maskCloseAbleChange(e){
      that.form.maskCloseAble = e.detail.value;
      that.sku_key = true;
    },
    skuModeChange(e){
      that.form.skuMode = e.detail.value;
      that.sku_key = true;
    },
    themeChange(e){
      that.form.theme = e.detail.value;
      that.sku_key = true;
    },
    stepStrictlyChange(e){
      that.form.stepStrictly = e.detail.value;
      that.sku_key = true;
    },
    hideStockChange(e){
      that.form.hideStock = e.detail.value;
      that.sku_key = true;
    },
    // 参数配置结束 -----------------------------------------------------------
    arrayToStr(array){
      return array.join("·");
    },
    couponSelect(){
      this.couponData.showCouponPicker = true;
      if (this.couponData.couponList.length) {
        this.couponData.showCouponPicker = true;
      } else {
        //this.$util.showToast('暂无优惠券')
      }
    }
  }
};
</script>

<style lang="scss">
.fm-badge {
  position: absolute;
  //font-size: 4rpx;
  line-height: 10px;
  color: #ffffff;
  top: -10rpx;
  right: -10rpx;
  background-color: #fa5151;
}
page {
  background-color: #f4f4f4;
}
.active{
  border-bottom: 6rpx solid #ff0000;
}
.price {
  align-items: baseline;
}
.productDetail {
  //position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 666;
  overflow: scroll;
  //margin-top: 88rpx;
  padding-bottom: 120rpx;
  .title-wrapper {
    padding: 40rpx 25rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    .price-content {
      margin-bottom: 20rpx;
      display: flex;
      align-items: center;
      .icon-share {
        width: 134rpx;
        height: 60rpx;
      }
    }
    .name {
      font-weight: bold;
      color: #333333;
      line-height: 40rpx;
    }
  }
  .discount {
    display: flex;
    width: 100%;
    flex-direction: row;
    padding: 35rpx 25rpx;
    font-size: 26rpx;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 20rpx;

    .title {
      font-weight: bold;
      margin-right: 35rpx;
    }

    .content {
      flex: 1;
      line-height: 40rpx;
      font-weight: 500;
      margin-right: 26rpx;
    }
  }

  .guige-wrapper {
    .item-wrapper {
      display: flex;
      width: 100%;
      height: 95rpx;
      align-items: center;
      flex-direction: row;
      padding: 0 25rpx;
      font-size: 26rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom: 1rpx solid #dadada;

      &:last-child {
        border-bottom: 0;
        //margin-bottom: 20rpx;
      }

      .title {
        font-weight: bold;
        margin-right: 35rpx;
      }

      .content {
        flex: 1;
        //margin-right: 26rpx;
      }

      .right-icon {
        flex: 0 0 14rpx;
        //width: 14rpx;
        //height: 22rpx;
      }
    }
  }


  .detail-wrapper {
    margin: 20rpx 0;
    background-color: #fff;
    .title {
      width: 100%;
      height: 94rpx;
      line-height: 94rpx;
      padding: 0 26rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #333333;
      box-sizing: border-box;
      text-align: center;
    }

    .content {
      width: 100%;
      padding: 20rpx;
      .product-detail-img {
        width: 100%;
        height: auto;
      }
    }
  }

  .footer-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 666;
    display: flex;
    width: 100%;
    height: 120rpx;
    align-items: center;
    background-color: #fff;
    border-top: 1rpx solid #fbfbfb;
    padding: 0 26rpx;
    box-sizing: border-box;

    .footer-icon-wrapper {
      flex: 1;
      display: flex;
      margin-right: 18rpx;
      justify-content: space-between;

      .footer-icon-item {
        //width: 80rpx;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        .footer-icon {
          width: 40rpx;
          height: 40rpx;
          margin-bottom: 10rpx;
          //background-color: #999999;
        }

        .footer-text {
          font-size: 20rpx;
          font-weight: 500;
        }
      }
    }

    .footer-btn-wrapper {
      width: 428rpx;
      height: 76rpx;

      .footer-btn {
        display: inline-block;
        width: 206rpx;
        height: 76rpx;
        border-radius: 38rpx;
        text-align: center;
        line-height: 76rpx;
        color: #fff;
        font-weight: 500;
        font-size: 28rpx;
        margin-right: 16rpx;

        &:last-child {
          margin-right: 0;
        }

        &.add-cart {
          background-color: #ffbe46;
        }

        &.buy {
          background-color: #fe3a3a;
        }
      }
    }
  }

  .set-wrapper {
    position: fixed;
    top: 180rpx;
    right: 26rpx;
    z-index: 3;

    .set-content {
      position: relative;
      width: 234rpx;
      height: 185rpx;
      background-color: #000;
      opacity: 0.7;
      border-radius: 10rpx;

      &::before {
        content: '';
        position: absolute;
        top: -14rpx;
        right: 13rpx;
        width: 0;
        border-width: 0 14rpx 14rpx 14rpx;
        border-style: solid;
        border-color: transparent transparent #000 transparent;
      }

      .set-item {
        display: flex;
        width: 100%;
        height: 92rpx;
        border-bottom: 1rpx solid #dadada;
        align-items: center;
        padding: 0 26rpx;
        box-sizing: border-box;

        &:last-child {
          border-bottom: 0;
        }

        .icon {
          width: 40rpx;
          height: 40rpx;
          margin-right: 14rpx;
          background-color: #ffffff;
        }

        .title {
          font-size: 28rpx;
          color: #ffffff;
          font-weight: 500;
          margin-right: 50rpx;
        }

        .dorp {
          width: 16rpx;
          height: 16rpx;
          background-color: #fd3144;
          border-radius: 50%;
        }
      }
    }
  }

  /*  弹出层 */
  .popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    overflow: hidden;

    &.show {
      display: block;

      .mask {
        animation: showPopup 0.2s linear both;
      }

      .layer {
        animation: showLayer 0.2s linear both;
      }
    }

    &.hide {
      .mask {
        animation: hidePopup 0.2s linear both;
      }

      .layer {
        animation: hideLayer 0.2s linear both;
      }
    }

    &.none {
      display: none;
    }

    .mask {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .layer {
      display: flex;
      width: 100%;
      // height: 1014rpx;
      flex-direction: column;
      // min-height: 40vh;
      // max-height: 1014rpx;
      position: fixed;
      z-index: 99;
      bottom: 0;
      border-radius: 10upx 10upx 0 0;
      background-color: #fff;

      .specification-wrapper {
        width: 100%;
        padding: 30rpx 25rpx;
        box-sizing: border-box;
        .specification-wrapper-content {
          width: 100%;
          max-height: 900rpx;
          min-height: 600rpx;
          &::-webkit-scrollbar {
            /*隐藏滚轮*/
            display: none;
          }

          .specification-header {
            width: 100%;
            display: flex;
            flex-direction: row;
            position: relative;
            margin-bottom: 40rpx;

            .specification-left {
              width: 180rpx;
              height: 180rpx;
              flex: 0 0 180rpx;

              .product-img {
                width: 180rpx;
                height: 180rpx;
                background-color: #999999;
              }
            }

            .specification-right {
              flex: 1;
              padding: 0 35rpx 0 28rpx;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              font-weight: 500;

              .price-content {
                color: #fe3a3a;
                margin-bottom: 20rpx;

                .sign {
                  font-size: 28rpx;
                }

                .price {
                  font-size: 48rpx;
                }
              }

              .inventory {
                font-size: 24rpx;
                color: #999999;
                margin-bottom: 14rpx;
              }

              .choose {
                font-size: 28rpx;
                color: #333333;
              }
            }
          }

          .specification-content {
            font-weight: 500;

            .specification-item {
              margin-bottom: 40rpx;

              &:last-child {
                margin-bottom: 0;
              }

              .item-title {
                margin-bottom: 20rpx;
                font-size: 28rpx;
                color: #999999;
              }

              .item-wrapper {
                display: flex;
                flex-direction: row;
                flex-flow: wrap;

                .item-content {
                  display: inline-block;
                  padding: 15rpx 35rpx;
                  border-radius: 10rpx;
                  background-color: #ffffff;
                  color: #333333;
                  font-size: 28rpx;
                  margin-right: 20rpx;
                  border: 2rpx solid #f4f4f4;
                  box-sizing: border-box;

                  &.actived {
                    border-color: #fe3a3a;
                    color: #fe3a3a;
                  }

                  &.noactived {
                    background-color: #f4f4f4;
                    border-color: #f4f4f4;
                  }
                }
              }
            }
          }
        }
        .close {
          position: absolute;
          top: 30rpx;
          right: 25rpx;
          width: 50rpx;
          height: 50rpx;
          text-align: center;
          line-height: 50rpx;
          .close-item {
            width: 50rpx;
            height: 50rpx;
          }
        }
      }

      .btn-wrapper {
        display: flex;
        width: 100%;
        height: 120rpx;
        flex: 0 0 120rpx;
        align-items: center;
        justify-content: space-between;
        padding: 0 26rpx;
        box-sizing: border-box;

        .layer-btn {
          width: 335rpx;
          height: 76rpx;
          border-radius: 38rpx;
          color: #fff;
          line-height: 76rpx;
          text-align: center;
          font-weight: 500;
          font-size: 28rpx;

          &.add-cart {
            background: #ffbe46;
          }

          &.buy {
            background: #fe3a3a;
          }
        }
        .sure {
          width: 698rpx;
          height: 76rpx;
          border-radius: 38rpx;
          color: #fff;
          line-height: 76rpx;
          text-align: center;
          font-weight: 500;
          font-size: 28rpx;
          background: #fe3a3a;
        }
      }
    }

    @keyframes showPopup {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    @keyframes hidePopup {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }

    @keyframes showLayer {
      0% {
        transform: translateY(120%);
      }

      100% {
        transform: translateY(0%);
      }
    }

    @keyframes hideLayer {
      0% {
        transform: translateY(0);
      }

      100% {
        transform: translateY(120%);
      }
    }
  }
}
.iconfont{
  //font-size: 40rpx !important;
}
</style>
