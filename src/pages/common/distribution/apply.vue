<template>
  <view>
    <faasmall-navbar title="分销申请" :is-back="true"></faasmall-navbar>
    <view>
      <u-form :model="form" ref="uForm" >
        <u-form-item label="姓名"><u-input v-model="form.name" /></u-form-item>
      </u-form>
    </view>
  </view>
</template>

<script>
export default {
  name: "apply",
  data(){
    return{
      form:{
        name:'',
      },
      rules: {
        'form.name': {
          type: 'string',
          required: true,
          message: '请填写姓名',
          trigger: ['blur', 'change']
        },
      },
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  }
}
</script>

<style scoped>

</style>