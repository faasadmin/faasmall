<template>
  <view>
    <u-select v-model="visible" :default-value="defIndex" mode="mutil-column" :list="list" @confirm="confirm"></u-select>
  </view>
</template>

<script>
export default {
  name: "faasmall-month-select",
  data(){
    return{
      visible:false,
      defIndex:[],
      list: [
        [
        ],
        [
          {
            value: 1,
            label: '1月'
          },
          {
            value: 2,
            label: '2月'
          },
          {
            value: 3,
            label: '3月'
          },
          {
            value: 4,
            label: '4月'
          },
          {
            value: 5,
            label: '5月'
          },
          {
            value: 6,
            label: '6月'
          },
          {
            value: 7,
            label: '7月'
          },
          {
            value: 8,
            label: '8月'
          },
          {
            value: 9,
            label: '9月'
          },
          {
            value: 10,
            label: '10月'
          },
          {
            value: 11,
            label: '11月'
          },
          {
            value: 12,
            label: '12月'
          }
        ],

      ],
    }
  },
  props: {
    value:{
      type: Boolean,
      default: false
    },
    // list: {
    //   type: Array,
    //   default: () => []
    // },
  },
  watch:{
    value(val) {
      console.log(val);
      this.visible = val;
    },
  },
  mounted() {
    //this.getYear();
    for (let i = 1; i <120; i++) {
      //console.log(this.getYear(i))
      this.list[0].push({
        value: this.getYear(i),
        label: this.getYear(i) + '年'
      })
    }
    this.defIndex.push(this.list[0].length-1);
    var now = new Date();
    var currentMonth = now.getMonth();
    this.defIndex.push(currentMonth+1);
  },
  methods: {
    // 回调参数为包含多个元素的数组，每个元素分别反应每一列的选择情况
    confirm(e) {
      console.log(e);
      this.$emit("currentMonth", e);
    },
    getYear(index) {
      let date1 = new Date();
      let date2 = date1.getFullYear() - 119;
      return date2 + index;
    }
  }
}
</script>

<style scoped>

</style>