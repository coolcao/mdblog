/**
 * Created by coolcao on 16/8/3.
 */
var Pagination = function Pagination(page, limit, total) {
    this.page = page;
    this.limit = limit;
    //如果知道总条数，根据总条数计算分页的各个项
    if (total) {
        var pages = [];
        var hasPrePage = true;
        var hasNextPage = true;
        var totalPages = 0;
        var prePage = 0;
        var nextPage = 0;
        var count = 0;
        totalPages = Math.ceil(total / limit);
        if (page == 1) {
            hasPrePage = false;
        } else {
            prePage = page - 1;
        }

        if (page >= totalPages) {
            hasNextPage = false;
            count = (total - (page - 1) * limit) >= 0 ? (total - (page - 1) * limit) : 0;
        } else {
            nextPage = page + 1;
            count = limit;
        }

        for (var x = 1; x <= totalPages; x++) {
            if (x === page) {
                pages.push({
                    page: x,
                    active: true
                });
            } else {
                pages.push({
                    page: x,
                    active: false
                });
            }
        }
        this.total = total;
        this.hasNextPage = hasNextPage;
        this.hasPrePage = hasPrePage;
        this.nextPage = nextPage;
        this.prePage = prePage;
        this.totalPages = totalPages;
        this.count = count;
        this.pages = pages;
    }
};

module.exports = Pagination;

