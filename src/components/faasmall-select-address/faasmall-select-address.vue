<template>
  <view class="sh-server-box">
    <u-toast ref="uToast"></u-toast>
    <u-popup v-model="showModal" mode="bottom" :closeable="true" close-icon-pos="top-right">
      <view class="server-modal">
        <view class="server-modal-box page_box">
          <view class="modal-content content_box faas-select-address" style="height: 63vh;">
            <view class="faas-header">
              <text class="faas-header-title">所在地址</text>
              <text class="iconfont iconpopup_close fr" @click="showModal = false"></text>
            </view>
            <view class="faas-body flex align-center">
              <view class="faas-body-item" @click="active = 0" :class="active === 0 ? 'faas-body-item-1' : 'faas-body-item-0'"
              >{{ province }}
              </view>
              <view
                  class="faas-body-item"
                  v-if="provinceIndex !== -1"
                  @click="active = 1"
                  :class="active === 1 ? 'faas-body-item-1' : 'faas-body-item-0'"
              >{{ city }}
              </view>
              <view
                  class="faas-body-item"
                  v-if="cityIndex !== -1"
                  @click="active = 2"
                  :class="active === 2 ? 'faas-body-item-1' : 'faas-body-item-0'"
              >{{ district }}
              </view>
            </view>
            <view class="faas-item">
              <template v-if="list.length > 0">
                <scroll-view class="faas-scroll" scroll-y>
                  <view
                      class="faas-scroll-item"
                      v-if="active === 0"
                      @click="
                () => {
                  setActive('provinceIndex', index);
                }
              "
                      :class="provinceIndex === index ? 'faas-scroll-item-1' : 'faas-scroll-item-0'"
                      v-for="(item, index) in list"
                      :key="index"
                  >{{ item.name }}
                  </view>
                  <template v-if="provinceIndex !== -1">
                    <view
                        class="faas-scroll-item"
                        v-if="active === 1"
                        @click="
                  () => {
                    setActive('cityIndex', index);
                  }
                "
                        :class="cityIndex === index ? 'faas-scroll-item-1' : 'faas-scroll-item-0'"
                        v-for="(item, index) in list[provinceIndex].children"
                        :key="index"
                    >{{ item.name }}
                    </view>
                    <template v-if="cityIndex !== -1">
                      <view
                          class="faas-scroll-item"
                          v-if="active === 2"
                          @click="
                    () => {
                      setActive('districtIndex', index);
                    }
                  "
                          :class="districtIndex === index ? 'faas-scroll-item-1' : 'faas-scroll-item-0'"
                          v-for="(item, index) in list[provinceIndex].children[cityIndex].children"
                          :key="index"
                      >{{ item.name }}
                      </view>
                    </template>
                  </template>
                </scroll-view>
              </template>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'faasmall-select-address',
  components: {},
  props: {
    value: {
      type: Boolean
    },
    select: {
      type: Object,
      default: function () {
        return {
          province: '',
          city: '',
          district: ''
        };
      }
    }
  },
  data() {
    return {
      active: 0,
      province: '请选择',
      city: '请选择',
      district: '请选择',
      provinceIndex: -1,
      cityIndex: -1,
      districtIndex: -1
    };
  },
  computed: {
    showModal: {
      get: function ({ value }) {
        return value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    },
    ...mapGetters({list: 'addressJson'})
  },
  created() {
    debugger
    this.getAddress();
  },
  methods: {
    ...mapActions(['getAddress']),
    setActive: function (key, index) {
      this[key] = index;
      if (key === 'provinceIndex') {
        this.active = 1;
        this.province = this.list[index].name;
        this.city = '请选择';
        this.district = '请选择';
        this.cityIndex = -1;
        this.districtIndex = -1;
      } else if (key === 'cityIndex') {
        this.active = 2;
        this.city = this.list[this.provinceIndex].children[index].name;
      } else {
        this.district = this.list[this.provinceIndex].children[this.cityIndex].children[index].name;
        this.showModal = false;
        this.$emit('select', [
          { index: this.provinceIndex, name: this.province },
          { index: this.cityIndex, name: this.city },
          { index: index, name: this.district }
        ]);
      }
    }
  },
  watch: {
    select: {
      deep:true,
      handler(newVal) {
        let { province, city, district } = newVal;
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].name === province) {
            this.provinceIndex = i;
            this.province = this.list[i].name;
            this.active = 0;
          }
        }
        if (this.list.length > 0 && this.provinceIndex > -1) {
          for (let i = 0; i < this.list[this.provinceIndex].children.length; i++) {
            let name = this.list[this.provinceIndex].children[i].name;
            if (name === city) {
              this.cityIndex = i;
              this.city = name;
              this.active = 1;
            }
          }
          if (this.cityIndex > -1) {
            for (let i = 0; i < this.list[this.provinceIndex].children[this.cityIndex].children.length; i++) {
              let name = this.list[this.provinceIndex].children[this.cityIndex].children[i].name;
              if (name === district) {
                this.districtIndex = i;
                this.district = name;
                this.active = 2;
              }
            }
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.faas-select-address {
  height: 63vh;
  padding: 0 32rpx;
}

.faas-header {
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  margin-top: 16rpx;
}

.iconpopup_close {
  font-size: 28rpx;
  width: 28rpx;
  height: 28rpx;
  line-height: 1;
  color: #9d9d9d;
  margin-top: 18px;
}

.faas-header-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #999999;
}

.faas-body {
  border-bottom: 1rpx solid #e5e5e5;
  padding: 0 8rpx;
  margin-top: 32rpx;
}

.faas-body-item {
  font-size: 28rpx;
  font-weight: 500;
  color: #222222;
  margin-right: 57rpx;
  padding: 15rpx 0;
}

.faas-body-item-0 {
  border-bottom: 4rpx solid transparent;
}

.faas-body-item-1 {
  border-bottom-style: solid;
  border-bottom-width: 4rpx;
  border-color: #FF0505;
}

.faas-item {
  height: calc(63vh - 160rpx);
}

.faas-item .faas-scroll {
  height: calc(63vh - 160rpx);
  padding-top: 16rpx;
}

.faas-scroll-item {
  height: 72rpx;
  line-height: 72rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
}

.faas-scroll-item-1 {
  font-weight: bold;
  color: #FF0505;
}

.faas-scroll-item-0 {
  font-weight: 500;
  color: #222222;
}
</style>
