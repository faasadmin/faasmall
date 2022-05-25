<!--物流公司-->
<template>
  <view>
    <u-index-list :scrollTop="scrollTop">
      <view v-for="(item, index) in indexList" :key="index">
        <u-index-anchor :index="item" />
        <view class="faas-index-row">
          <view
              class="faas-list-cell"
              @click="back(row)"
              v-for="(row, key) in list[item]"
              :key="key"
          >
            {{ row.name }}
          </view>
        </view>
      </view>
    </u-index-list>
  </view>
</template>

<script>
import {getConfig} from "@/faasmall/api/common";
export default {
  name: "faasmall-express-list",
  data() {
    return {
      id:'',
      mobile:'',
      list:'',
      scrollTop: 0,
      indexList: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
    }
  },
  onLoad(options) {
    let _this = this;
    this.id = options.id;
    this.mobile = options.mobile;
    debugger
    getConfig("shop_settings_express").then(function (res) {
      debugger
      let list = JSON.parse(res.data);
      list.sort((a, b) => a.name.localeCompare(b.name, "zh"));
      let data = _this.sortFriend(list);
      _this.list = data;
    });
  },
  methods:{
    back: function (row) {
      uni.redirectTo({
        url:
            "/pages/common/order/afterSale/alter_sale_return?id=" +
            this.id +
            "&code=" +
            row.code +
            "&name=" +
            row.name+
            "&mobile=" +
            this.mobile
      });
    },
    chineseToEnglish: function (c) {
      let idx = -1;
      let MAP = "ABCDEFGHJKLMNOPQRSTWXYZ";
      let boundaryChar = "驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳";
      if (!String.prototype.localeCompare) {
        throw Error("String.prototype.localeCompare not supported.");
      }
      if (/[^\u4e00-\u9fa5]/.test(c)) {
        return c;
      }
      for (let i = 0; i < boundaryChar.length; i++) {
        if (boundaryChar[i].localeCompare(c, "zh-CN-u-co-pinyin") >= 0) {
          idx = i;
          break;
        }
      }
      return MAP[idx];
    },
    //获取第一个字母
    getFirstUpperChar: function (str) {
      let string = String(str);
      let c = string.substr(0, 1);
      if (/[^\u4e00-\u9fa5]/.test(c)) {
        return c.toUpperCase();
      } else {
        return this.chineseToEnglish(c);
      }
    },
    sortFriend(list) {
      let map = {};
      let _this = this;
      let c = "A".charCodeAt();
      for (; c <= "Z".charCodeAt(); c++) {
        map[String.fromCharCode(c)] = [];
      }
      map["#"] = [];
      let firstCharUpper;
      list.forEach(function (item) {
        firstCharUpper = _this.getFirstUpperChar(item.pinyin);
        if (map.hasOwnProperty(firstCharUpper)) {
          map[firstCharUpper].push(item);
        } else {
          map["#"].push(item);
        }
      });
      let obj = {};
      for (let key in map) {
        if (map[key].length) obj[key] = map[key];
      }
      return obj;
    },
  }
}
</script>
<style scoped>
.faas-index-row > .faas-list-cell:last-child {
  border-bottom: none;
}
.faas-list-cell {
  color: #222222;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffffff;
  border-bottom: 2rpx solid #e5e5e5;
  padding: 0 20rpx;
}
</style>