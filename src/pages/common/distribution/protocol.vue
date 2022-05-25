<template>
  <view style="padding: 10rpx">
    <text>{{ distributionBasisData.protocolContent }}</text>
  </view>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'protocol',
  computed:{
    ...mapGetters(["distributionOtherData", "distributionRecruitData","distributionBasisData"]),
  },
  data() {
    return {
      content: '',
    };
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: this.distributionBasisData.protocolTitle
    });
  }
};
</script>
