<template>
  <div class="container">
    <div class="header">
      <el-button icon="el-icon-back" @click="handleBack">返回</el-button>
    </div>
    <div class="main">
      <SaleConfigForm :model="form"></SaleConfigForm>
    </div>
  </div>
</template>

<script>
import SaleConfigForm from './SaleConfigForm'

export default {
  name: 'Add',
  components: { SaleConfigForm },
  data() {
    return {
      form: {
        target_level: null,
        type: null,
        discount: 0,
        min_price: 0,
        max_price: 0,
        start_time: '',
        end_time: '',
        status: false,
      },
    }
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding-left: 30px;
  padding-right: 30px;

  .header {
    margin-top: 30px;
    text-align: right;
  }

  .main {
    margin-top: 30px;
  }
}
</style>
