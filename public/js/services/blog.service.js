'use strict';

angular.module('app').service('blogService', ['$http', '$q', 'paginationFactory' ,function($http, $q, paginationFactory) {

    /**
     * 查询列表
     * @param  {Object} opt [封装查询条件]
     * @return {Promise}     [查询的列表，封装成Promise]
     */
    this.list = function list(opt) {

        var key = 'blogs';

        var page = opt.page || 1;
        var tag = opt.tag ;
        var catalog = opt.catalog;

        return $q(function (resolve,reject) {
            var url = '/blogs?page='+page;
            if(tag){
                url += '&tag='+tag;
            }
            if(catalog){
                url += '&catalog=' + catalog;
            }
            $http.get(url).then(function (result) {
                if(result.status !== 200){
                    reject('请求错误，错误码：【' + result.status + '】');
                }
                var blogs = result.data.blogs;
                var pagination = paginationFactory.init(result.data.pagination.page,result.data.pagination.limit,result.data.pagination.total);
                resolve({blogs:blogs,pagination:pagination});
            }).catch(function (err) {
                reject(err);
            });
        });
    };


    this.recent = function() {
        return this.list({page:1}).then(function (result) {
            return result && result.blogs;
        });
    };


    this.detail = function(path) {
        return $q(function (resolve,reject) {
            var url = '/blogs/' + encodeURIComponent(path);
            $http.get(url).then(function (result) {
                if(result.status !== 200){
                    reject('请求错误，错误码：【' + result.status + '】');
                }
                var blog = result.data.blog;

                resolve(blog);
            }).catch(function (error) {
                reject(error);
            });
        });
    };


    this.tags = function() {
        return $q(function (resolve,reject) {
            var url = '/blogs/tags';
            $http.get(url).then(function (result) {
                if(result.status !== 200){
                    reject('请求错误，错误码：【' + result.status + '】');
                }
                var tags = result.data.tags;
                resolve(tags);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    this.catalogs = function() {
        return $q(function (resolve,reject) {
            var url = '/blogs/catalogs';
            $http.get(url).then(function (result) {
                if(result.status !== 200){
                    reject('请求错误，错误码：【' + result.status + '】');
                }
                var catalogTree = result.data.catalogs;
                var values = [];
                var q = [];
                q = q.concat(catalogTree.child);
                while(q.length > 0){
                    var t = q.shift();
                    values.push({catalog:t.key,count:t.count});
                    if(t.child.length > 0){
                        q = q.concat(t.child);
                    }
                }
                resolve({catalogs:catalogTree,catalogValues:values.sort(function (a,b) {
                    return b.count - a.count;
                })})
            }).catch(function (err) {
                reject(err)
            })
        });
    }

    this.search = function(opt) {

        var keyword = opt.keyword;
        var page = opt.page;

        return $q(function (resolve,reject) {
            var url = '/blogs/search?';
            if(keyword){
                url = url + 'keyword=' + keyword;
            }
            if(page){
                url = url + '&page=' + page;
            }
            $http.get(url).then(function (result) {
                if(result.status !== 200){
                    reject('请求错误，错误码：【' + result.status + '】');
                }
                var blogs = result.data.blogs;
                var pagination = result.data.pagination;
                resolve({blogs:blogs,pagination:pagination});
            }).catch(function (error) {
                reject(error);
            })
        });
    }

}]);