<template>
    <div class="container">
        <div class="header">
            <div class="header-left"><p class="title">代理公司分支管理</p></div>
        </div>
        <el-divider/>
        <div class="main">
            <div class="button-container">
                <el-button type="primary" @click="handleAdd" v-auth="['代理信息管理']">新增</el-button>
            </div>
            <div class="table-container">
                <el-table highlight-current-row v-loading="loading" :data="tableData" :height="tableHeight" stripe
                          border>
                    <el-table-column label="序号" width="60" type="index"/>
                    <el-table-column label="所属代理公司" prop="company.name"></el-table-column>
                    <el-table-column label="分支机构编码" prop="code"/>
                    <el-table-column label="分支机构名称" prop="name"/>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" v-auth="['代理信息管理']">编辑</el-button>
                            <el-button @click="generateCode(scope.row)" v-auth="['生成二维码']">生成二维码</el-button>
                            <el-button @click="handleQueryCodeList(scope.row)" v-auth="['查看已生成二维码']">二维码列表</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <BranchDialog :show="showDialog" :scene="scene" :comp="comp" :branch="branch"
                      @submit="handleSubmit"
                      @cancel="handleCloseDialog"/>
        <CodeDialog :show="showCodeDialog" :branch="branch"
                    @cancel="handleCloseCodeDialog"/>
        <CodeListDialog :show="showCodeListDialog" :target="queryCode"
                        @cancel="handleCloseCodeListDialog"/>
    </div>
</template>

<script>
import BranchDialog from './components/BranchDialog'
import CodeDialog from './components/CodeDialog'
import proxyModel from '../../models/proxy'
import CodeListDialog from './components/CodeListDialog'

export default {
  name: 'Branch',
  data() {
    return {
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showCodeListDialog: false,
      scene: '',
      comp: {},
      branch: {},
      queryCode: {},
      tableData: [],
      tableHeight: window.innerHeight - 380,
    }
  },
  created() {
    this.getProxyBranchs()
  },
  methods: {
    async getProxyBranchs() {
      this.tableData = await proxyModel.getProxyBranchs()
    },
    async handleSubmit(form) {
      this.loading = true
      let res = {}
      try {
        if (form.id) {
          res = await proxyModel.editProxyCompBranch(form.id, form.code, form.name)
        } else {
          res = await proxyModel.createProxyCompBranch(form.comp_id, form.code, form.name)
        }
        this.loading = false
        this.$message.success(res.msg)
      } catch (e) {
        this.loading = false
        this.$message.error(typeof (e.data.msg) === 'object' ? Object.values(e.data.msg)
          .join(';') : e.data.msg)
      }
      this.getProxyBranchs()
    },
    handleAdd() {
      this.comp = {
        id: null,
        name: '',
        code: '',
      }
      this.branch = {
        comp_id: null,
        name: '',
        code: '',
      }
      this.scene = 'create'
      this.showDialog = true
    },
    handleEdit(row) {
      this.scene = 'edit'
      this.comp = row.company
      this.branch = {
        id: row.id,
        code: row.code,
        name: row.name,
      }
      this.showDialog = true
    },
    generateCode(row) {
      this.branch = {
        id: row.id,
        code: row.code,
        name: row.name,
        comp_id: row.company.id,
        comp_name: row.company.name,
        comp_code: row.company.code,
      }
      this.showCodeDialog = true
    },
    handleQueryCodeList(row) {
      this.queryCode = {
        comp_code: row.company.code,
        branch_code: row.code,
      }
      this.showCodeListDialog = true
    },
    handleCloseDialog() {
      this.showDialog = false
    },
    handleCloseCodeDialog() {
      this.showCodeDialog = false
    },
    handleCloseCodeListDialog() {
      this.queryCode = {}
      this.showCodeListDialog = false
    },
  },
  components: {
    CodeListDialog,
    BranchDialog,
    CodeDialog,
  },
}
</script>

<style lang="scss" scoped>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        margin-bottom: -24px;

        .header-left {
            float: left;

            .title {
                height: 59px;
                line-height: 59px;
                color: #4c76af;
                font-size: 16px;
                font-weight: 500;
            }
        }

        .header-right {
            float: right;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .main {
        padding-left: 20px;
        padding-right: 20px;

        .table-container {
            margin-top: 20px;
        }
    }

</style>
