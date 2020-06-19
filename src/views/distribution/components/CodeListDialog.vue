<template>
    <el-dialog title="已生成二维码" :visible.sync="visible"
               :close-on-click-modal="false"
               :show-close="false">
        <el-table v-loading="loading" :data="codeList" height="400" border highlight-current-row>
            <el-table-column label="序号" type="index" width="70"/>
            <el-table-column label="文件名(请留意并确认文件名末尾的数字编号)" width="400" prop="file_name"/>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link type="primary" @click="handleDownload(scope.row)">下载</el-link>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">关闭</el-button>
            <el-button :disabled="disabled" type="primary" @click="refresh">刷新</el-button>
        </div>
    </el-dialog>

</template>

<script>
import proxyModel from '@/models/proxy'

export default {
  name: 'CodeListDialog',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    target: {
      type: Object,
      required: true,
    },
  },
  watch: {
    show(val) {
      this.visible = val
    },
    target() {
      this.getCodeList()
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      codeList: [],
      disabled: false,
    }
  },
  // mounted() {
  //   this.getCodeList()
  // },
  methods: {
    async getCodeList() {
      this.loading = true
      this.disabled = true
      try {
        this.codeList = await proxyModel.getCodeList(this.target.comp_code, this.target.branch_code)
        setTimeout(() => {
          this.disabled = false
          this.loading = false
        }, 1000)
      } catch (e) {
        this.loading = false
        this.disabled = false
      }
    },

    refresh() {
      this.getCodeList()
    },

    handleDownload(row) {
      this.$message.success('正在发起下载')
      window.location.href = row.url
    },

    handleCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>

</style>
