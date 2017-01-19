'use strict';

angular.module('app').service('blogService', ['$http', '$localStorage', '$q', '$filter', function($http, $localStorage, $q, $filter) {

    /**
     * 查询列表
     * @param  {Object} opt [封装查询条件]
     * @return {Promise}     [查询的列表，封装成Promise]
     */
    this.list = function list(opt) {
        return $q(function(resolve, reject) {
            var page = opt.page || 1;
            var url = '/blogs?page=' + page;
            if (opt.tag) {
                url += ('&tag=' + opt.tag);
            }
            var countPerPage = 5;

            $http.get(url).then(function(result) {
                var blogs = result.data && result.data.blogs;
                var pagination = result.data && result.data.pagination;
                if (pagination) {
                    if (pagination) {
                        var start = 1;
                        var end = (pagination.totalPages > 5) ? 5 : pagination.totalPages;
                        var usePages = [];
                        //他妈的，这段逻辑有点乱，整理一下

                        var totalPages = pagination.totalPages;
                        var currentPage = pagination.page;

                        if (totalPages < countPerPage) {
                            start = 1;
                            end = totalPages;
                        } else {
                            if (currentPage < ((countPerPage / 2 >>> 0) + 1)) {
                                start = 1;
                                end = countPerPage;
                            } else if (currentPage > (totalPages - (countPerPage / 2))) {
                                end = totalPages;
                                start = end - (countPerPage - 1);
                            } else {
                                start = currentPage - (countPerPage / 2 >>> 0);
                                end = currentPage + (countPerPage / 2 >>> 0);
                            }
                        }
                        for (let i = start; i <= end; i++) {
                            usePages.push(pagination.pages[i - 1]);
                        }
                        pagination.usePages = usePages;
                        resolve({
                            pagination: pagination,
                            blogs: blogs
                        });
                    }
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    };


    this.recent = function() {
        var url = '/blogs';
        return $q(function(resolve, reject) {
            $http.get(url).then(function(result) {
                resolve(result.data && result.data.blogs.slice(0, 5));
            }, function(err) {
                reject(err);
            });
        });
    };


    this.detail = function(path) {
        return $q(function(resolve, reject) {
            if (!path) {
                reject('参数错误，path不能为空');
            }
            try {
                path = window.decodeURIComponent(path);
                $http.get('/blogs/' + encodeURIComponent(path)).then(function(result) {
                    var blog = result.data && result.data.blog;
                    if (blog) {
                        var reg = /<code[^>]*([\s\S]*?)<\/code>/g
                        var codes = blog.content.match(reg);
                        if (codes) {
                            let coder = codes.map((item) => {
                                return $filter('prettyprint')(item)
                            })
                            for (let i = 0; i < codes.length; i++) {
                                blog.content = blog.content.replace(codes[i], coder[i]);
                            }
                        }
                    }
                    resolve(blog);
                }, function(err) {
                    reject(err);
                })
            } catch (err) {
                reject(err);
            }
        });

    };


    this.tags = function(argument) {
        return $q(function(resolve, reject) {
            $http.get('/blogs/tags').then(function onSuccess(result) {
                var data = result && result.data;
                var ret = data && data.ret;
                var tagsTree = data && data.tags;
                if (ret == 0) {
                    if (tagsTree && tagsTree.child) {
                        tagsTree.child.sort(function(a, b) {
                            return a.count - b.count < 0;
                        });
                    }
                    var values = [];
                    var q = [];
                    q = q.concat(tagsTree.child);
                    while (q.length > 0) {
                        let t = q.shift();
                        values.push(t);
                        q = q.concat(t.child);
                    }
                    resolve({
                        tags: tagsTree,
                        tagsValues: values
                    });
                } else {
                    reject('请求错误，错误码：【' + data.ret + '】');
                }
            }, function onFailed(err) {
                reject(err);
            });
        });
    }


    this.search = function(opt) {
        return $q(function(resolve, reject) {
            var page = opt.page || 1;
            var url = '/blogs/search?page=' + page;
            if (opt.keyword) {
                url += ('&keyword=' + opt.keyword);
            }
            var countPerPage = 5;
            $http.get(url).then(function(result) {
                let blogs = result.data && result.data.blogs;
                let pagination = result.data && result.data.pagination;
                if (pagination) {
                    var start = 1;
                    var end = (pagination.totalPages > 5) ? 5 : pagination.totalPages;
                    var usePages = [];

                    var totalPages = pagination.totalPages;
                    var currentPage = pagination.page;

                    if (totalPages < countPerPage) {
                        start = 1;
                        end = totalPages;
                    } else {
                        if (currentPage < ((countPerPage / 2 >>> 0) + 1)) {
                            start = 1;
                            end = countPerPage;
                        } else if (currentPage > (totalPages - (countPerPage / 2))) {
                            end = totalPages;
                            start = end - (countPerPage - 1);
                        } else {
                            start = currentPage - (countPerPage / 2 >>> 0);
                            end = currentPage + (countPerPage / 2 >>> 0);
                        }
                    }

                    for (var i = start; i <= end; i++) {
                        usePages.push(pagination.pages[i - 1]);
                    }

                    pagination.usePages = usePages;

                    resolve({pagination:pagination,blogs:blogs});
                }
            }, function(err) {
                reject(err);
            });
        });
    }

}]);