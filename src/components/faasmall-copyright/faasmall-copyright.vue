<template>
  <!-- copyright -->
  <view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-20 u-p-b-50" v-if="shopData.copyrightContent">
    <view class="copyright-text">{{ shopData.copyrightContent }}</view>
    <view class="copyright-text">{{ shopData.copyrightDate }}</view>
  </view>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  name: "faasmall-copyright",
  data(){
    return{

    }
  },
  computed: {
    ...mapGetters(['shopData']),
  }
}
</script>

<style scoped>

</style>