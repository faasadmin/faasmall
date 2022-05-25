<!--退货地址-->
<template>
  <view>
    <u-index-list :index-list="indexList">
      <template v-for="(item, index) in itemArr">
        <!-- #ifdef APP-NVUE -->
        <u-index-anchor :text="indexList[index]"></u-index-anchor>
        <!-- #endif -->
        <u-index-item>
          <!-- #ifndef APP-NVUE -->
          <u-index-anchor :text="indexList[index]"></u-index-anchor>
          <!-- #endif -->
          <view class="list-cell" v-for="(cell, index) in item">
            {{cell}}
          </view>
        </u-index-item>
      </template>
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
      list:'',
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
      itemArr: [
        ['列表A1','列表A2','列表A3'],
        ['列表B1','列表B2','列表B3'],
        ['列表C1','列表C2','列表C3']
      ]
    }
  },
  onLoad(options) {
    let _this = this;
    this.id = options.id;
    getConfig("shop_settings_express").then(function (res) {
      debugger
      let list = res.data;
      list.sort((a, b) => a.name.localeCompare(b.name, "zh"));
      let data = _this.sortFriend(list);
      _this.list = data;
    });
  },
  methods:{
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
<style lang="scss" scoped>
.list-cell {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 24rpx;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
}
</style>