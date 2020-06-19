<template>
  <el-form ref="form" label-width="120px" :model="form" :rules="rules">
    <el-form-item prop="name" aria-label="left" label="规则名称">
      <el-col :span="5">
        <el-input v-model="form.name"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="适用会员" prop="target_level">
      <el-col :span="5">
        <el-radio-group v-model="form.target_level">
          <el-radio-button label="1">普通会员</el-radio-button>
          <el-radio-button label="2">VIP会员</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="优惠类型" prop="type">
      <el-col :span="8">
        <el-radio-group v-model="form.type">
          <el-radio-button label="1">折扣</el-radio-button>
          <el-radio-button disabled label="2">满减</el-radio-button>
          <el-radio-button label="3">立减</el-radio-button>
          <el-radio-button label="4">生日专享</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="适用业务" prop="scope">
      <el-col :span="5">
        <el-radio-group v-model="form.scope">
          <el-radio-button label="1">船票</el-radio-button>
          <!--<el-radio-button label="2">满减</el-radio-button>-->
          <!--<el-radio-button label="3">立减</el-radio-button>-->
          <!--<el-radio-button label="4">生日专享</el-radio-button>-->
        </el-radio-group>
      </el-col>
    </el-form-item>
    <el-form-item label="优惠额度" prop="discount">
      <el-col :span="5">
        <el-input v-model="form.discount"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="最小适用金额" prop="min_price">
      <el-col :span="5">
        <el-input v-model="form.min_price"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="最大适用金额" prop="max_price">
      <el-col :span="5">
        <el-input v-model="form.max_price"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="开始时间" prop="start_time">
      <el-date-picker
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="form.start_time"
        type="datetime"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="end_time">
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="form.end_time" type="datetime" placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="不可用时间"></el-form-item>
    <el-form-item label="有效状态">
      <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用">
      </el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SaleConfig from '../../../../models/sale-config'

const saleConfigModel = new SaleConfig()

export default {
  name: 'SaleConfigForm',
  props: {
    model: Object,
  },

  data() {
    return {
      form: this.model,
      rules: {
        name: [
          {
            required: true,
            message: '请指定规则名称',
            trigger: 'blur',
          },
        ],
        target_level: [
          {
            required: true,
            message: '请指定规则适用的会员等级',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请指定优惠类型',
            trigger: 'blur',
          },
        ],
        scope: [
          {
            required: true,
            message: '请指定优惠适用业务类型',
            trigger: 'blur',
          },
        ],
        discount: [
          {
            required: true,
            message: '优惠额度不能为空',
            trigger: 'blur',
          },
          {
            min: 1,
            message: '优惠额度不能低于1',
            trigger: 'blur',
          },
        ],
        min_price: [
          {
            required: true,
            message: '请指定优惠规则最小适用金额',
            trigger: 'blur',
          },
          {
            min: 1,
            message: '优惠额度不能低于1',
            trigger: 'blur',
          },
        ],
        max_price: [
          {
            required: true,
            message: '请指定优惠规则最大适用金额',
            trigger: 'blur',
          },
          {
            min: 1,
            message: '优惠额度不能低于1',
            trigger: 'blur',
          },
        ],
        // start_time: [
        //   {
        //     required: true,
        //     message: '请指定优惠规则生效开始时间',
        //     trigger: 'blur',
        //   },
        //   {
        //     type: 'date',
        //     required: true,
        //     message: '请指定优惠规则生效开始时间',
        //     trigger: 'change',
        //   },
        // ],
        // end_time: [
        //   {
        //     required: true,
        //     message: '请指定优惠规则失效时间',
        //     trigger: 'blur',
        //   },
        //   {
        //     type: 'date',
        //     required: true,
        //     message: '请指定优惠规则失效时间',
        //     trigger: 'change',
        //   },
        // ],
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res
          try {
            if (!this.form.id) {
              res = await saleConfigModel.createSaleConfig(this.form)
            } else {
              res = await saleConfigModel.editSaleConfig(this.form)
            }
            this.$message.success(res.msg)
            this.$emit('success')
          } catch (e) {
            this.$message.error(Object.values(e.data.msg).join(';'))
          }
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped></style>
