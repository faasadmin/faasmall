<template>
    <view>
      <rich-text :nodes="rule"></rich-text>
    </view>
</template>

<script>
import graceRichText  from '@/faasmall/utils/rechText'
export default {
  name: "grade_rule",
  data(){
    return{
      rule:{},
    }
  },
  onLoad(){
    let rl = this.$Route.query.rule;
    this.rule = graceRichText.format(rl);
  }
}
</script>

<style scoped>

</style>