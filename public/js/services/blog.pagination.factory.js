'use strict'

angular.module('app').factory('paginationFactory', function() {
    var pagination = {};
    pagination.init = function(page, limit, total) {
        page = page >>> 0;
        limit = limit >>> 0;
        var _pagination = {};
        _pagination.page = page ;
        _pagination.limit = limit ;
            // 如果知道总条数，根据总条数计算分页的各个项
        if (total) {
            total = total >>> 0;
            var pages = []
            var hasPrePage = true
            var hasNextPage = true
            var totalPages = 0
            var prePage = 0
            var nextPage = 0
            var count = 0
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

            for (var x = 1; x <= totalPages; x++) {
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
            _pagination.total = total
            _pagination.hasNextPage = hasNextPage
            _pagination.hasPrePage = hasPrePage
            _pagination.nextPage = nextPage
            _pagination.prePage = prePage
            _pagination.totalPages = totalPages
            _pagination.count = count
            _pagination.pages = pages

            //拼装前端分页，只留5页
            var start = 1;
            var end = (_pagination.totalPages > 5) ? 5 : _pagination.totalPages;
            var countPerPage = 5;
            var usePages = [];

            if (totalPages < countPerPage) {
                start = 1;
                end = totalPages;
            } else {
                if (page < ((countPerPage / 2 >>> 0) + 1)) {
                    start = 1;
                    end = countPerPage;
                } else if (page > (totalPages - (countPerPage / 2))) {
                    end = totalPages;
                    start = end - (countPerPage - 1);
                } else {
                    start = page - (countPerPage / 2 >>> 0);
                    end = page + (countPerPage / 2 >>> 0);
                }
            }
            for (let i = start; i <= end; i++) {
                usePages.push(_pagination.pages[i - 1]);
            }
            _pagination.usePages = usePages;

        }
        return _pagination;
    };
    return pagination;
});