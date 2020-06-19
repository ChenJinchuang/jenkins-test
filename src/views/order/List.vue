<template>
  <div class="container">
    <div class="header">
      <div class="header-left"><p class="title">订单查询</p></div>
    </div>
    <el-divider />
    <div class="main">
      <div class="query-condition-container">
        <div class="condition-item">
          <span class="condition-label">下单时间</span>
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
        <div class="condition-item">
          <span class="condition-label">票状态</span>
          <el-select v-model="status" filterable placeholder="可选" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="condition-item">
          <span class="condition-label">联系方式</span>
          <el-col :span="17">
            <el-input v-model="tel" placeholder="下单预留手机号码，可选" clearable />
          </el-col>
        </div>
        <div class="condition-item">
          <span class="condition-label">订单号码</span>
          <el-col :span="17">
            <el-input v-model="orderNo" placeholder="订单号，可选" clearable />
          </el-col>
        </div>
        <div v-if="user.groupId !== 1" class="condition-item">
          <span class="condition-label">所属代理</span>
          <el-cascader
            placeholder="可选"
            v-model="proxyCascaderData"
            :options="proxyOptions"
            :props="{ checkStrictly: true }"
            clearable
            filterable
          />
        </div>
        <div>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleExport" v-loading="exportLoading"
            >导出Excel<i class="el-icon-download el-icon--right"
          /></el-button>
        </div>
      </div>
      <div class="table-container">
        <el-table v-loading="loading" :data="tableData" stripe border>
          <el-table-column width="180" fixed label="订单号" align="center">
            <template slot-scope="props">
              <span>{{ props.row.order_info.order_no }}</span>
            </template>
          </el-table-column>
          <el-table-column label="票状态" prop="status" width="80" align="center"> </el-table-column>
          <el-table-column label="航班日期" width="120" align="center">
            <template slot-scope="props">
              {{ props.row.order_info.class_date }}
            </template>
          </el-table-column>
          <el-table-column label="航班时间" align="center">
            <template slot-scope="props">
              {{ props.row.order_info.class_time }}
            </template>
          </el-table-column>
          <el-table-column label="游船名称" width="200" align="center">
            <template slot-scope="props">
              {{ props.row.order_info.boat_name }}
            </template>
          </el-table-column>
          <el-table-column label="登船码头" width="130" align="center">
            <template slot-scope="props">
              {{ props.row.order_info.start_wharf }}
            </template>
          </el-table-column>
          <el-table-column prop="seat_info" label="座位信息" width="150" align="center" />
          <el-table-column prop="ori_price" label="原票价" width="100" align="center" />
          <el-table-column prop="sale_price" label="优惠票价" width="100" align="center" />
          <el-table-column label="取票联系人" align="center" width="130">
            <template slot-scope="props">
              {{ props.row.order_info.name }}
            </template>
          </el-table-column>
          <el-table-column label="联系方式" align="center" width="130">
            <template slot-scope="props">
              {{ props.row.order_info.tel }}
            </template>
          </el-table-column>
          <el-table-column label="渠道公司" align="center" width="150">
            <template slot-scope="props">
              {{ props.row.order_info.proxy_comp_code || '自营渠道' }}
            </template>
          </el-table-column>
          <el-table-column label="渠道机构" align="center" width="150">
            <template slot-scope="props">
              {{ props.row.order_info.proxy_branch_code || '自营渠道' }}
            </template>
          </el-table-column>
          <el-table-column label="渠道成员" align="center" width="150">
            <template slot-scope="props">
              {{ props.row.order_info.proxy_member_code || '自营渠道' }}
            </template>
          </el-table-column>
          <el-table-column label="订单创建时间" width="170" align="center">
            <template slot-scope="props">
              {{ props.row.order_info.create_time }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" width="170" align="center" label="支付完成时间" />
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          v-if="tableData.length && refreshPagination"
          layout="prev, pager, next, jumper"
          :total="total_nums"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import orderModel from '@/models/order.js'
import proxyModel from '@/models/proxy.js'
import optionModel from '@/models/option'

export default {
  name: 'List',
  data() {
    return {
      tableHeight: window.innerHeight - 380,
      loading: false,
      exportLoading: false,
      tableData: [],
      datePicker: [],
      startDate: '', // 开始时间
      endDate: '', // 结束时间
      name: '', // 下单联系人
      tel: '', // 下单预留手机号码
      wharfName: '', // 码头名称
      orderNo: '', // 订单号
      status: '', // 票状态
      proxyCascaderData: [],
      proxyCompCode: '',
      proxyBranchCode: '',
      proxyMemberCode: '',

      statusOptions: [
        {
          label: '已售',
          value: 1,
        },
        {
          label: '已退',
          value: 2,
        },
      ],
      proxyOptions: [],
      proxyCompOptions: [], // 代理所属公司选项列表
      proxyBranchOptions: [], // 代理所属公司选项列表
      proxyMemberOptions: [], // 代理所属公司选项列表
      // 分页相关
      pageCount: 10,
      currentPage: 1,
      refreshPagination: true,
      total_nums: null,
    }
  },
  created() {
    if (this.user.groupId !== 1) {
      this.getProxyOptions()
    }
  },
  methods: {
    handleQuery() {
      const [compCode, branchCode, memberCode] = this.proxyCascaderData
      this.proxyCompCode = compCode || ''
      this.proxyBranchCode = branchCode || ''
      this.proxyMemberCode = memberCode || ''

      if (this.datePicker[0] !== undefined && this.datePicker[1] !== undefined) {
        this.startDate = this.datePicker[0] / 1000
        this.endDate = this.datePicker[1] / 1000 + 86399
      }
      this.loading = true
      this.getOrderList()
    },
    async getOrderList() {
      try {
        const res = await orderModel.getOrderList(
          this.startDate,
          this.endDate,
          this.name,
          this.tel,
          this.wharfName,
          this.orderNo,
          this.status,
          this.proxyCompCode,
          this.proxyBranchCode,
          this.proxyMemberCode,
        )
        this.tableData = res.items
        this.total_nums = res.total
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$message.error(e.data.msg)
      }
    },
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      setTimeout(() => {
        orderModel.page = this.currentPage - 1
        this.getOrderList()
      }, 1000)
    },
    async getProxyOptions() {
      const proxyInfo = await proxyModel.getProxyCompWithBranch()
      this.proxyOptions = optionModel.generateProxyOptions(proxyInfo)
    },

    async handleExport() {
      this.exportLoading = true
      this.$message('正在导出，请稍后')
      const tHeader = [
        '订单号',
        '状态',
        '所属公司',
        '航班日期',
        '航班时间',
        '登船码头',
        '游船名称',
        '座位信息',
        '票价',
        '联系人姓名',
        '联系人手机',
        '所属代理公司',
        '所属公司机构',
        '代理成员编号',
        '订单创建时间',
        '支付完成时间',
      ]
      const filterVal = [
        'order_no',
        'status',
        'comp_code',
        'class_date',
        'class_time',
        'start_wharf',
        'boatName',
        'seat_info',
        'price',
        'name',
        'tel',
        'proxy_comp_code',
        'proxy_branch_code',
        'proxy_member_code',
        'create_time',
        'update_time',
      ]
      const excel = await import('@/vendor/Export2Excel')
      try {
        const res = await orderModel.getAllOrderList(
          this.startDate,
          this.endDate,
          this.name,
          this.tel,
          this.wharf_name,
          this.order_no,
          this.status,
          this.proxyCompCode,
          this.proxyBranchCode,
          this.proxyMemberCode,
        )
        const data = this._formatJson(filterVal, res)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list',
          autoWidth: true,
        })
        this.exportLoading = false
        this.$message({
          message: '导出成功！',
          type: 'success',
        })
      } catch (e) {
        this.exportLoading = false
        this.$message.error('导出失败，请联系管理员')
      }
    },
    _formatJson(filterVal, resData) {
      return resData.map(v => filterVal.map(j => {
        if (
          j === 'order_no'
            || j === 'comp_code'
            || j === 'class_date'
            || j === 'class_time'
            || j === 'start_wharf'
            || j === 'boatName'
            || j === 'name'
            || j === 'tel'
            || j === 'source'
            || j === 'proxy_comp_code'
            || j === 'proxy_branch_code'
            || j === 'proxy_member_code'
            || j === 'create_time'
        ) {
          return v.order_info[j]
        }
        if (j === 'update_time') {
          return v.create_time
        }
        return v[j]
      }))
    },
  },
  computed: {
    ...mapGetters(['user']),
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

  .query-condition-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .condition-item {
      display: flex;
      align-items: center;
      margin-right: 30px;
      padding: 10px 0 10px 0;

      .condition-label {
        margin-right: 10px;
      }
    }
  }

  .table-container {
    margin-top: 15px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
