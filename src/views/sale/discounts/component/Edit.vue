<template>
  <div class="container">
    <div class="header">
      <el-button icon="el-icon-back" @click="handleBack">返回</el-button>
    </div>
    <div class="main">
      <SaleConfigForm :model="model" @success="handleBack"></SaleConfigForm>
    </div>
  </div>
</template>

<script>
import SaleConfigForm from './SaleConfigForm'

export default {
  name: 'Edit',
  components: { SaleConfigForm },
  props: {
    row: Object,
  },
  data() {
    return {
      model: this.row,
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
