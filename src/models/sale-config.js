import { _delete, get, patch, post, put } from '../lin/plugins/axios'

class SaleConfig {
  handleError = true

  async getSaleConfigList() {
    const res = await get('v1/member/sale', { handleError: this.handleError })
    return res
  }

  async createSaleConfig(data) {
    const res = await post('v1/member/sale', data, { handleError: this.handleError })
    return res
  }

  async editSaleConfig(data) {
    const { id } = data
    delete data.id
    const res = await put(`v1/member/sale/${id}`, data, { handleError: this.handleError })
    return res
  }

  async deleteSaleConfig(id) {
    const res = await _delete(`v1/member/sale/${id}`, { handleError: this.handleError })
    return res
  }

  async modifyStatus(id) {
    const res = await patch(`v1/member/sale/${id}`, { handleError: this.handleError })
    return res
  }
}

export default SaleConfig
