/**
 * Created by coolcao on 16/8/3.
 */

class Pagination {
  page?: number;
  limit?: number;
  total?: number;
  hasNextPage?: boolean;
  hasPrePage?: boolean;
  nextPage?: number;
  prePage?: number;
  totalPages?: number;
  count?: number;
  pages?: Array<object>;
  constructor(page, limit, total) {
    this.page = page
    this.limit = limit
    // 如果知道总条数，根据总条数计算分页的各个项
    if (total) {
      let pages = []
      let hasPrePage = true
      let hasNextPage = true
      let totalPages = 0
      let prePage = 0
      let nextPage = 0
      let count = 0
      totalPages = Math.ceil(total / limit)
      if (page == 1) {
        hasPrePage = false
      } else {
        prePage = page - 1
      }

      if (page >= totalPages) {
        hasNextPage = false
        count = (total - (page - 1) * limit) >= 0 ? (total - (page - 1) * limit) : 0
      } else {
        nextPage = page + 1
        count = limit
      }

      for (let x = 1; x <= totalPages; x++) {
        if (x === page) {
          pages.push({
            page: x,
            active: true
          })
        } else {
          pages.push({
            page: x,
            active: false
          })
        }
      }
      this.total = total
      this.hasNextPage = hasNextPage
      this.hasPrePage = hasPrePage
      this.nextPage = nextPage
      this.prePage = prePage
      this.totalPages = totalPages
      this.count = count
      this.pages = pages
    }
  }
}

export default Pagination;
