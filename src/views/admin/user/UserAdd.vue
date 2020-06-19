<template>
  <div class="container">
    <div class="title">新建用户</div>
    <div class="wrap"><user-info :groups="groups" :proxys="proxys" /></div>
  </div>
</template>

<script>
import Admin from '@/lin/models/admin'
import proxyModel from '@/models/proxy'
import UserInfo from './UserInfo'

export default {
  components: {
    UserInfo,
  },
  data() {
    return {
      groups: [],
      proxys: [], // 所有代理
    }
  },
  async created() {
    try {
      this.loading = true
      this.groups = await Admin.getAllGroups()
      this.proxys = await proxyModel.getProxyCompWithBranch()
      this.loading = false
    } catch (e) {
      this.loading = false
      console.log(e)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 0px 20px;
  }
}
</style>
