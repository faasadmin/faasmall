<template>
  <view>
    <u-toast ref="uToast"/>
    <view>
      <view v-show="!empty" class="head_box">
        <view class="tool-box u-flex u-row-between">
          <view class="count-box">
            共
            <text class="all-num">{{ cartList.length }}</text>
            件商品
          </view>
          <text class="" @tap="isTool = !isTool">{{ isTool ? '完成' : '编辑' }}</text>
        </view>
      </view>
      <view class="good-container">
        <scroll-view v-if="!empty" class="scrool-more" scroll-with-animation="true" scroll-y="true" style="height: 100%;width: 100%;">
          <!-- 列表 -->
          <u-checkbox-group v-if="!empty" activeColor="#FF0505" @change="checkboxGroupChange">
            <view v-for="(good, index) in cartList" :key="index" class="collect-list u-flex u-row-left u-col-center">
              <u-checkbox v-model="good.checked" :name="good.goodId" class="u-p-l-10" shape="circle">
                <view style="height: 160rpx"></view>
              </u-checkbox>
              <view class="goods-wrap">
                <view class="goods-box u-flex u-col-top" @tap="$Router.push({path:'/pages/common/good/info',query:{id:good.goodId}})">
                  <u-image :src="good.thumbnail" class="goods_img" height="90px" width="90px"></u-image>
                  <view class="u-m-l-20">
                    <view class="goods-title u-ellipsis-2 u-m-b-10">{{ good.name }}</view>
                    <view class="order-sku u-ellipsis-1">
                      <text class="order-num">{{ good.price && good.goodSkuName ? good.goodSkuName : '' }}</text>
                    </view>
                    <view class="order-price-box u-flex u-row-between">
                      <text class="order-price">￥{{ good.price ? good.price : 0 }}</text>
                      <u-number-box
                          :index="index"
                          :long-press="false"
                          :max="!good.price ? 0: (good.stocks > 999 ? 999 : good.stocks)"
                          :min="0"
                          :step="1"
                          :value="good.number"
                          disabled-input
                          @min="onMin(good)"
                          @minus="changeNum($event, good)"
                          @plus="changeNum($event, good)"
                      ></u-number-box>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </u-checkbox-group>
        </scroll-view>

        <!-- 数据为空 -->
        <faasmall-empty v-if="empty" :image="$FILE_URL + '/file/img/good/empty_cart.png'" tipText="购物车空空如也,快去逛逛吧~"></faasmall-empty>
      </view>
      <view style="height: 60px;" v-show="!empty">
        <view class="good-footer">
          <view class="tools-box u-flex u-row-between">
            <u-checkbox :value="allSelected" activeColor="#FF0505" shape="circle" @change="onAllSel">
              全选（{{ totalCount.totalNum }}）
            </u-checkbox>
            <view class="u-flex">
              <view v-show="!isTool" class="price">￥{{ totalCount.totalPrice.toFixed(2) }}</view>
              <u-button v-show="!isTool" shape="square" :disabled="!isSel"  @click="onPay" type="error">结算</u-button>
              <u-button v-show="isTool" shape="square" @click="goodsDelete" type="warning">删除</u-button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

let timer = null;
export default {
  components: {},
  data() {
    const _this = this;
    return {
      $FILE_URL: _this.$FILE_URL,
      isTool: false
    };
  },
  computed: {
    ...mapGetters(['totalCount', 'isSel', 'cartList', 'allSelected', 'authType', 'isLogin']),
    empty() {
      return !this.cartList.length;
    }
  },
  onShow() {
    this.isLogin && this.getCartList();
    //this.getCartList();
  },
  onHide() {
    this.isTool = false;
  },
  methods: {
    ...mapActions(['getCartList', 'deleteCart', 'updateCart']),
    // 到达最小值
    onMin(good) {
      uni.showModal({
        title: '删除提示',
        confirmColor: '#f0c785',
        content: `是否确认从购物车中删除此商品?`,
        success: res => {
          res.confirm && this.deleteCart({ids: [good.id]});
        }
      });
    },
    // 更改商品数
    async changeNum(e, good) {
      uni.showLoading({
        mask: true
      });
      e.value > 0 && this.updateCart({ids: [good.id], number: e.value});
      uni.hideLoading();
      await this.getCartList();
    },
    // 单选
    checkboxGroupChange(e) {
      this.$store.commit('checkCartList');
    },
    // 路由跳转
    jump(path, parmas) {
      this.$Router.push({
        path: path,
        query: parmas
      });
    },
    // 全选
    onAllSel() {
      let that = this;
      that.$store.commit('changeAllSellect'); //按钮切换全选。
      that.$store.commit('getAllSellectCartList', that.allSelected); //列表全选
    },
    // 结算
    onPay() {
      let that = this;
      if (this.isSel) {
        let conFirmCartList = [];
        for (let item of this.cartList) {
          if (item.checked) {
            debugger
            conFirmCartList.push({
              goodId: item.goodId,
              goodSkuId: item.goodSkuId,
              number: item.number
            });
          }
        }
        that.jump('/pages/common/order/submit', {goodList: conFirmCartList,source:'cart',type:1});
      }
    },
    // 删除
    goodsDelete() {
      let that = this;
      let {cartList} = this;
      let selectedIdsArray = [];
      cartList.map(item => {
        if (item.checked) {
          selectedIdsArray.push(item.id);
        }
      });
      this.deleteCart({ids: selectedIdsArray});
    }
  }
};
</script>

<style lang="scss">

/* 解决移除原生导航栏后页面与手机状态栏重叠问题 */
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #ffffff;
}

.top_view {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #ffffff;
  top: 0;
  z-index: 999;
}

.good-container {
  width: 100%;
  height: 100%;
}

.good-wrap {
  padding: 20px;
  background: #FFFFFF;

  .good-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .good-checkbox {
      width: 10%;
      margin-right: 10px;
    }

    .good-img {
      width: 30%;
      margin-right: 10px;
    }

    .good-desc {
      width: 60%;
    }
  }
}

.good-footer {
  position: fixed;
  bottom: calc(var(--window-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background-color: #FFFFFF;
  padding: 0 20px 0 20px;
  z-index: 1000;

  .good-all-checkbox {
    display: flex;
    flex-direction: row;

    .good-all-note {
      color: red;
    }
  }

  .good-operate {
    display: flex;
    flex-direction: row;
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 888;
  background-color: rgba(0, 0, 0, 0.6);
}

.recycle-popup-container {
  display: flex;
  justify-content: center;

  .recycle-popup-wrap {
    position: absolute;
    top: 25%;
    bottom: 25%;
    z-index: 998;
    width: 90%;
    border-radius: 25px;
    background: #f0f4f7;
    padding: 0 20px 0 20px;

    .recycle-title {
      padding: 20px 0 20px 0;
      display: flex;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
    }

    .recycle-list {
      flex: 1;
      position: relative;

      .scrool-more {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }

      .list {
        height: 80 rpx;
        line-height: 80 rpx;
        text-align: center;
        background: #e0e0e0;

      }
    }

    .recycle-good-wrap {
      .recycle-good {
        display: flex;

        .recycle-good-img {
          flex: 0 0 20%;
        }

        .recycle-good-desc {
          flex: 0 0 70%;
          margin-left: 5px;
          display: flex;

          .recycle-good-ext-wrap {
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
            height: 100%;

            .recycle-good-ext-name {
              position: absolute;
              top: 10px;
            }

            .recycle-good-ext-gold {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              position: absolute;
              bottom: 10px;
              width: 100%;
            }
          }

        }
      }
    }

    .recycle-info {
      position: absolute;
      bottom: 10px;
      left: 0px;
      padding: 0 20px 0 20px;

      .recycle-info-select {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .recycle-info-operate {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
}

// 总计商品
.head_box {
  .tool-box {
    height: 90rpx;
    padding: 0 30rpx;
    background: #f7f5f6;

    .count-box {
      font-size: 26rpx;
      color: #999;
      .all-num {
        color: #FF0505;
      }
    }
  }
}

.tools-box {
  height: 100rpx;
  width: 100%;
  background: #fff;
  .price {
    color: #ff0000;
    margin-right: 20rpx;
  }
}

// 购物车项
.collect-list {
  background: #fff;
  width: 100%;
  margin-bottom: 20rpx;
  padding: 20rpx 10rpx;
  // 商品卡片包裹
  .goods-wrap {
    position: relative;
    .order-sku {
      font-size: 24rpx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      width: 440rpx;
      margin-bottom: 20rpx;
      .order-num {
        margin-right: 10rpx;
      }
    }

    .order-price-box {
      .order-price {
        font-size: 26rpx;
        font-weight: 600;
        color: #ff0000;
      }
    }
  }

  .price-box {
    width: 420rpx;
    .price {
      color: #e1212b;
    }
  }
}
</style>
