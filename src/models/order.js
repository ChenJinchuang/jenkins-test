import { get } from '@/lin/plugins/axios'

class Order {
    page = 0

    count = 10

    handleError = true

    async getOrderList(startDate,
      endDate,
      name,
      tel,
      wharf_name,
      order_no,
      status,
      proxyCompCode,
      proxyBranchCode,
      proxyMemberCode) {
      const result = await get(
        'v1/order/ticket',
        {
          startDate,
          endDate,
          name,
          tel,
          wharf_name,
          order_no,
          status,
          proxyCompCode,
          proxyBranchCode,
          proxyMemberCode,
          page: this.page,
          count: this.count,
        },
        { handleError: this.handleError },
      )
      return result
    }

    async getAllOrderList(startDate,
      endDate,
      name,
      tel,
      wharf_name,
      order_no,
      status,
      proxyCompCode,
      proxyBranchCode,
      proxyMemberCode) {
      const result = await get(
        'v1/order/ticket/all',
        {
          startDate,
          endDate,
          name,
          tel,
          wharf_name,
          order_no,
          status,
          proxyCompCode,
          proxyBranchCode,
          proxyMemberCode,
          page: this.page,
          count: this.count,
        },
        { handleError: this.handleError },
      )
      return result
    }
}

export default new Order()
