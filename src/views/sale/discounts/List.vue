<template>
  <div class="lin-container">
    <div v-if="switchComponent">
      <component :is="switchTarget" :row="row" @back="handleBack"></component>
    </div>
    <div v-else>
      <div class="lin-title">优惠规则</div>
      <div class="button-container">
        <el-button v-auth="'创建优惠规则'" type="primary" @click="handleAdd">新增规则</el-button>
        <el-button type="warning" icon="el-icon-refresh" circle @click="getList"></el-button>
      </div>
      <div class="table-container">
        <el-table v-loading="loading" :data="tableData" border highlight-current-row>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" align="center" label="规则名称" width="180"></el-table-column>
          <el-table-column prop="target_level" align="center" label="适用会员" width="100">
            <template slot-scope="scope">
              {{ scope.row.target_level | levelEnum }}
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="优惠类型" width="100">
            <template slot-scope="scope">
              {{ scope.row.type | typeEnum }}
            </template>
          </el-table-column>
          <el-table-column prop="scope" align="center" label="适用业务" width="100">
            <template slot-scope="scope">
              {{ scope.row.scope | scopeEnum }}
            </template>
          </el-table-column>
          <el-table-column prop="discount" align="center" label="优惠值" width="100"></el-table-column>
          <el-table-column prop="min_price" align="center" label="最小适用金额" width="120"></el-table-column>
          <el-table-column prop="max_price" align="center" label="最大适用金额" width="120"></el-table-column>
          <el-table-column prop="start_time" align="center" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="end_time" align="center" label="结束时间" width="180"></el-table-column>
          <el-table-column label="不可用时间" align="center" width="180"></el-table-column>
          <el-table-column label="有效状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status ? 'success' : 'danger'">
                {{ scope.row.status | statusEnum }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button @click="modifyStatus(scope.row)" v-auth="'启用/禁用优惠规则'">
                {{ scope.row.status ? '禁用' : '启用' }}
              </el-button>
              <el-button v-auth="'编辑优惠规则'" type="success" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-auth="'删除优惠规则'" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px">
      <span>是否确认删除此优惠规则？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="affirmDelete">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Add from './component/Add'
import Edit from './component/Edit'
import SaleConfig from '../../../models/sale-config'

const saleConfigModel = new SaleConfig()

export default {
  name: 'List',
  data() {
    return {
      loading: false,
      tableData: [],
      switchComponent: false,
      switchTarget: '',
      row: null,
      dialogVisible: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        this.tableData = await saleConfigModel.getSaleConfigList()
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleAdd() {
      this.switchComponent = true
      this.switchTarget = 'Add'
    },
    handleEdit(row) {
      this.row = row
      this.switchComponent = true
      this.switchTarget = 'Edit'
    },
    async modifyStatus(row) {
      try {
        const res = await saleConfigModel.modifyStatus(row.id)
        this.$message.success(res.msg)
        await this.getList()
      } catch (e) {
        this.$message.error(Object.values(e.data.msg).join(';'))
      }
    },

    handleDelete(row) {
      this.row = row
      this.dialogVisible = true
    },
    async affirmDelete() {
      try {
        const res = await saleConfigModel.deleteSaleConfig(this.row.id)
        this.$message.success(res.msg)
        this.dialogVisible = false
        await this.getList()
      } catch (e) {
        this.$message.error(Object.values(e.data.msg).join(';'))
      }
    },
    handleBack() {
      this.switchComponent = false
      this.switchTarget = ''
      this.getList()
    },
  },
  components: {
    Add,
    Edit,
  },
  filters: {
    levelEnum(value) {
      const map = {
        1: '普通会员',
        2: 'VIP会员',
      }
      return map[value]
    },
    typeEnum(value) {
      const map = {
        1: '折扣',
        2: '满减',
        3: '立减',
        4: '生日专享',
      }
      return map[value]
    },
    scopeEnum(value) {
      const map = {
        1: '船票',
      }
      return map[value]
    },
    statusEnum(value) {
      const map = {
        0: '禁用',
        1: '启用',
      }
      return map[value]
    },
  },
}
</script>

<style lang="scss" scoped>
.button-container {
  margin-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  justify-content: space-between;
}

.table-container {
  margin-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
}
</style>
