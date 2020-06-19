<template>
    <el-dialog title="生成二维码" :visible.sync="visible"
               :close-on-click-modal="false"
               :show-close="false">
        <el-form :model="temp">
            <el-form-item label="代理公司">
                <el-col :span="12">
                    <el-input disabled v-model="temp.comp_name"/>
                </el-col>
            </el-form-item>
            <el-form-item label="分支机构">
                <el-col :span="12">
                    <el-input disabled v-model="temp.name"/>
                </el-col>
            </el-form-item>
            <el-form-item label="生成数量">
                <el-col :span="12">
                    <el-input-number v-model="temp.count" :min="1" :max="200"></el-input-number>
                </el-col>
            </el-form-item>
<!--            <span style="color: red">点击生成后请耐心等待弹出下载</span>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button :loading="loading" type="primary"
                       @click="handleGenerate">生成
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import proxyModel from '../../../models/proxy'

export default {
  name: 'CodeDialog',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    branch: {
      type: Object,
      required: true,
    },
  },
  watch: {
    show(val) {
      this.visible = val
    },
    branch(val) {
      Object.assign(this.temp, val)
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      temp: {
        id: '',
        code: '',
        name: '',
        comp_id: '',
        comp_name: '',
        comp_code: '',
        count: 1,
      },
    }
  },
  methods: {
    handleGenerate() {
      // this.$emit('generate', this.temp)
      this.loading = true
      try {
        proxyModel.generateCode(this.temp)
        this.loading = false
        this.handleCancel()
        this.$message.success('后台生成中，稍后查看')
        // window.location.href = res.url
      } catch (e) {
        console.log(e)
        this.loading = false
        this.$message.error(typeof (e.data.msg) === 'object' ? Object.values(e.data.msg)
          .join(';') : e.data.msg)
      }
    },
    handleCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>

</style>
