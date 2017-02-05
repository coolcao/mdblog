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

    this.catalogs = function () {
        var key = 'blog.catalogs';
        return  $q(function (resolve,reject) {
            if ($localStorage[key] && ((new Date()).getTime() - Date.parse($localStorage[key].time))/1000/3600 < 24) {
                console.log('缓存中tags保存时间为：'+$localStorage[key].time+',未过期，直接返回');
                resolve($localStorage[key].catalogs);
            } else {
                $http.get('/blogs/catalogs').then(function onSuccess(result) {
                    var data = result && result.data;
                    var ret = data && data.ret;
                    var catalogsTree = data && data.catalogs;
                    if (ret == 0) {
                        if (catalogsTree && catalogsTree.child) {
                            catalogsTree.child.sort(function(a, b) {
                                return a.count - b.count < 0;
                            });
                        }
                        
                        var savedValue = {
                            catalogs: catalogsTree,
                            time : new Date()
                        }
                        console.log('保存tags至localStorage');
                        $localStorage[key] = savedValue;
                        resolve(savedValue.catalogs);
                    } else {
                        reject('请求错误，错误码：【' + data.ret + '】');
                    }
                }, function onFailed(err) {
                    reject(err);
                });
            }
        });
    }

}]);