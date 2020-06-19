<template>
    <el-dialog :title="title" :visible.sync="visible"
               :close-on-click-modal="false"
               :show-close="false"
    >
        <el-form :model="temp" label-width="80px">
            <el-form-item label="公司编码" prop="code">
                <el-col :span="12">
                    <el-input :disabled="scene !== 'create'" v-model="temp.code"
                              placeholder="必须与售票系统设置的客户编码一致"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="公司名称" prop="name">
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
export default {
  name: 'CompDialog',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    scene: {
      type: String,
      required: true,
    },
    comp: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '',
      sceneType: {
        create: '新增代理公司',
        edit: '编辑代理公司',
      },
      temp: {
        id: '',
        code: '',
        name: '',
      },
    }
  },
  watch: {
    show(val) {
      this.visible = val
    },

    scene(val) {
      if (val === 'edit' || val === 'create') {
        this.title = this.sceneType[val]
      }
    },
    comp(val) {
      this.temp.id = val.id || ''
      this.temp.code = val.code
      this.temp.name = val.name
    },
  },
  methods: {
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
