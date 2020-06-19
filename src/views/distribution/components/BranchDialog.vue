<template>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false"
               :show-close="false">
        <el-form :model="temp" ref="form">
            <el-form-item label="所属代理公司">
                <el-select :disabled="scene !== 'create'" v-model="temp.comp_id" filterable placeholder="请选择">
                    <el-option
                        v-for="item in compOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分支机构编码" prop="code">
                <el-col :span="12">
                    <el-input :disabled="scene !== 'create'&& scene !== 'createForCompList'" v-model="temp.code"
                              placeholder="自定义字母或数字"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="分支机构名称" prop="name">
                <el-col :span="12">
                    <el-input v-model="temp.name" placeholder="中文"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button :loading="loading" type="primary"
                       @click="handleSubmit">保存
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import proxyModel from '../../../models/proxy'

export default {
  name: 'BranchDialog',
  props: {
    show: Boolean,
    scene: String,
    comp: Object,
    branch: Object,
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '',
      sceneType: {
        creat: '新增分支机构',
        createForCompList: '新增分支机构',
        edit: '编辑分支机构',
      },
      temp: {
        id: '',
        comp_id: '',
        code: '',
        name: '',
      },
      compOptions: [],
    }
  },
  watch: {
    show(val) {
      this.visible = val
    },
    scene(val) {
      if (val === 'edit' || val === 'create' || val === 'createForCompList') {
        this.title = this.sceneType[val]
      }
    },
    comp(val) {
      if (val) {
        this.temp.comp_id = val.id
      }
    },
    branch(val) {
      this.temp.id = val.id || ''
      this.temp.code = val.code
      this.temp.name = val.name
    },
  },
  created() {
    this.getProxyCompList()
  },
  methods: {
    async getProxyCompList() {
      this.compOptions = await proxyModel.getProxyComps()
    },

    handleSubmit() {
      this.$emit('submit', this.temp)
      this.handleCancel()
    },
    handleCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>

</style>
