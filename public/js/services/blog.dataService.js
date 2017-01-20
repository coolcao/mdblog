'use strict';

angular.module('app').service('blogDataService', ['$http', '$localStorage', '$q', '$filter', function($http, $localStorage, $q, $filter) {



    /**
     * 查询所有博客，如果localStorage中已缓存，并且在24小时之内，则直接使用缓存中的，否则从接口获取，并保存到localStorage
     */
    this.blogs = function(){
        var key = 'blogs';
        return $q(function(resolve,reject){
            try {
                if($localStorage[key] && ((new Date()).getTime() - Date.parse($localStorage[key].time))/1000/3600 < 24 ){
                    console.log('缓存中博客列表时间为：'+$localStorage[key].time+',未过期，直接返回');
                    resolve($localStorage[key].blogs);
                }
                //localStorage中不存在blogs数据或者数据已超过24小时，查询
                else{
                    var url = '/blogs/list';
                    $http.get(url).then(function(result){
                        if(result.status !== 200){
                            reject('请求错误，错误码：【' + result.status + '】');
                        }
                        var blogs = result.data.blogs;
                        if(blogs && (Object.prototype.toString.call(blogs) == '[object Array]') && (blogs.length > 0)){
                            console.log('保存博客列表至缓存');
                            $localStorage[key] = {time:new Date(),blogs:blogs};
                        }
                        resolve(blogs);
                    },function(err){
                        reject(err);
                    });
                }
            } catch (error) {
                reject(error);
            }
            
        });
    }

    this.tags = function() {
        var key = 'blog.tags';

        return $q(function(resolve, reject) {
            if ($localStorage[key] && ((new Date()).getTime() - Date.parse($localStorage[key].time))/1000/3600 < 24) {
                console.log('缓存中tags保存时间为：'+$localStorage[key].time+',未过期，直接返回');
                resolve($localStorage[key].tags);
            } else {
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
                        
                        var savedValue = {
                            tags : tagsTree,
                            time : new Date()
                        }
                        console.log('保存tags至localStorage');
                        $localStorage[key] = savedValue;
                        resolve(savedValue.tags);
                    } else {
                        reject('请求错误，错误码：【' + data.ret + '】');
                    }
                }, function onFailed(err) {
                    reject(err);
                });
            }
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

                    resolve({
                        pagination: pagination,
                        blogs: blogs
                    });
                }
            }, function(err) {
                reject(err);
            });
        });
    }

}]);