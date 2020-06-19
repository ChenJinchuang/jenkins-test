<template>
    <div class="container">
        <div class="header">
            <div class="header-left"><p class="title">代理公司管理</p></div>
        </div>
        <el-divider/>
        <div class="main">
            <div class="button-container">
                <el-button type="primary" @click="handleAddComp" v-auth="['代理信息管理']">新增</el-button>
            </div>
            <div class="table-container">
                <el-table style="width: 100%"
                          highlight-current-row
                          v-loading="loading"
                          :data="tableData"
                          :height="tableHeight"
                          stripe
                          border>
                    <el-table-column label="序号" width="60" type="index"/>
                    <el-table-column label="公司编码" prop="code"/>
                    <el-table-column label="公司名称" prop="name"/>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleEditComp(scope.row)" v-auth="['代理信息管理']">编辑</el-button>
                            <el-button @click="handleAddBranch(scope.row)" v-auth="['代理信息管理']">添加分支机构</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <CompDialog :show="showCompDialog" :scene="compDialogScene" :comp="comp"
                    @submit="handleCompSubmit" @cancel="handleCloseCompDialog"/>
        <BranchDialog :show="showBranchDialog" :scene="branchDialogScene" :comp="comp"
                      @submit="handleBranchSubmit"
                      @cancel="handleCloseBranchDialog"/>
    </div>
</template>

<script>
import CompDialog from './components/CompDialog'
import BranchDialog from './components/BranchDialog'
import proxyModel from '../../models/proxy'

export default {
  name: 'Company',
  data() {
    return {
      compDialogScene: '',
      branchDialogScene: '',
      loading: false,
      showCompDialog: false,
      showBranchDialog: false,
      tableData: [],
      tableHeight: window.innerHeight - 380,
      comp: {
        id: null,
        name: '',
        code: '',
      },
    }
  },
  created() {
    this.getProxyCompList()
  },
  methods: {
    async getProxyCompList() {
      this.tableData = await proxyModel.getProxyComps()
    },

    async handleCompSubmit(form) {
      this.loading = true
      let res = {}
      try {
        if (form.id) {
          res = await proxyModel.editProxyComp(form.id, form.code, form.name)
        } else {
          res = await proxyModel.createProxyComp(form.code, form.name)
        }
        this.loading = false
        this.$message.success(res.msg)
      } catch (e) {
        this.loading = false
        this.$message.error(typeof (e.data.msg) === 'object' ? Object.values(e.data.msg)
          .join(';') : e.data.msg)
      }
      this.getProxyCompList()
    },

    async handleBranchSubmit(form) {
      this.loading = true
      try {
        const res = await proxyModel.createProxyCompBranch(form.comp_id, form.code, form.name)
        this.loading = false
        this.$message.success(res.msg)
      } catch (e) {
        console.log(e)
        this.loading = false
        this.$message.error(typeof (e.data.msg) === 'object' ? Object.values(e.data.msg)
          .join(';') : e.data.msg)
      }
    },

    handleAddComp() {
      this.comp = {
        id: null,
        name: '',
        code: '',
      }
      this.compDialogScene = 'create'
      this.showCompDialog = true
    },

    handleEditComp(row) {
      this.comp = row
      this.compDialogScene = 'edit'
      this.showCompDialog = true
    },

    handleAddBranch(row) {
      this.branchDialogScene = 'createForCompList'
      this.comp = row
      this.showBranchDialog = true
    },

    handleCloseCompDialog() {
      this.showCompDialog = false
    },

    handleCloseBranchDialog() {
      this.showBranchDialog = false
    },
  },
  components: {
    CompDialog,
    BranchDialog,
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
