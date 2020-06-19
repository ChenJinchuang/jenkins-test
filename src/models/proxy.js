import { get, patch, post } from '@/lin/plugins/axios'


class Proxy {
  handleError = true

  async getProxyCompWithBranch() {
    const res = await get('v1/proxy/comp_full', {}, { handleError: this.handleError })
    return res
  }

  async getProxyComps() {
    const res = await get('v1/proxy/comp', {}, { handleError: this.handleError })
    return res
  }

  async getProxyBranchs() {
    const res = await get('v1/proxy/branch', {}, { handleError: this.handleError })
    return res
  }

  async createProxyComp(code, name) {
    const res = await post('v1/proxy/comp', {
      code,
      name,
    }, { handleError: this.handleError })
    return res
  }

  async editProxyComp(id, code, name) {
    const res = await patch(`v1/proxy/comp/${id}`, {
      code,
      name,
    }, { handleError: this.handleError })
    return res
  }

  async createProxyCompBranch(comp_id, code, name) {
    const res = await post('v1/proxy/branch', {
      comp_id,
      code,
      name,
    }, { handleError: this.handleError })
    return res
  }

  async editProxyCompBranch(id, code, name) {
    const res = await patch(`v1/proxy/branch/${id}`, {
      code,
      name,
    }, { handleError: this.handleError })
    return res
  }

  async generateCode(data) {
    const res = await post('v1/proxy/code', {
      comp_id: data.comp_id,
      comp_code: data.comp_code,
      comp_name: data.comp_name,
      branch_id: data.id,
      branch_code: data.code,
      branch_name: data.name,
      count: data.count,
    }, { handleError: this.handleError })
    return res
  }

  async getCodeList(comp_code, branch_code) {
    const res = await get(`v1/proxy/code?comp_code=${comp_code}&branch_code=${branch_code}`)
    return res
  }
}

export default new Proxy()
