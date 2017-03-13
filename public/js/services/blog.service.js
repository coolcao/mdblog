'use strict';

angular.module('app').service('blogService', ['$http', '$localStorage', '$q', '$filter','blogDataService','paginationFactory' ,function($http, $localStorage, $q, $filter,blogDataService,paginationFactory) {

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

        //如果缓存中有数据，则直接从缓存中取
        if($localStorage[key] && ((new Date()).getTime() - Date.parse($localStorage[key].time))/1000/3600 < 24){
            return blogDataService.blogs().then(function(blogs){
                if(catalog){
                    blogs = blogs.filter(function(blog){
                        return blog.catalog.indexOf(catalog) > -1;
                    });
                }
                if(tag){
                    blogs = blogs.filter(function(blog){
                        return blog.tags.indexOf(tag) > -1;
                    });
                }
                return blogs;
            }).then(function(blogs){
                //分页，每页条数
                var limit = 5;
                //符合条件的博客的所有条数
                var total = blogs.length;
                //生成分页对象
                var pagination = paginationFactory.init(page,limit,total);
                
                //分页后的博客
                var _blogs = blogs.slice(limit*(page-1),limit*page);

                _blogs.forEach(function (item) {
                    item.subcontent = item.content.substring(0, 500).replace(/</g, '&lt;').replace(/>/g, '&gt;')
                });

                return {blogs:_blogs,pagination:pagination}
            });
        }else{

            //异步获取所有数据
            // var url = '/blogs/list';
            // $http.get(url).then(function(result){
            //     if(result.status !== 200){
            //         reject('异步请求错误，错误码：【' + result.status + '】');
            //     }
            //     var blogs = result.data.blogs;
            //     if(blogs && (Object.prototype.toString.call(blogs) == '[object Array]') && (blogs.length > 0)){
            //         console.log('保存博客列表至缓存');
            //         $localStorage[key] = {time:new Date(),blogs:blogs};
            //     }
            // },function(err){
            //     console.log('异步获取所有博客数据出错：');
            //     console.log(err);
            // });

            //直接从接口获取
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
        }
    };


    this.recent = function() {
        return blogDataService.blogs().then(function(blogs){
            return blogs.slice(0,5);
        });
    };


    this.detail = function(path) {

        return blogDataService.blogs().then(function(blogs){
            var _blog = null;
            for(var blog of blogs){
                if(blog.path == path){
                    _blog = blog;

                    //使用谷歌美化代码
                    var reg = /<code[^>]*([\s\S]*?)<\/code>/g
                    var codes = _blog.content.match(reg);
                    if (codes) {
                        let coder = codes.map((item) => {
                            return $filter('prettyprint')(item)
                        })
                        for (let i = 0; i < codes.length; i++) {
                            _blog.content = _blog.content.replace(codes[i], coder[i]);
                        }
                    }
                    break;
                }
            }
            return _blog;
        });

    };


    this.tags = function() {
        return blogDataService.tags().then(function(tags){
            // var values = [];
            // var q = [];
            // q = q.concat(tagsTree.child);
            // while(q.length > 0){
            //     var t = q.shift();
            //     values.push(t.child);
            // }
            // return {tags:tagsTree,tagsValues:values}
            return tags;
        });
    }

    this.catalogs = function() {
        return blogDataService.catalogs().then(function(catalogTree){
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
            return {catalogs:catalogTree,catalogValues:values.sort(function (a,b) {
                return b.count - a.count;
            })}
        });
    }

    this.search = function(opt) {

        var keyword = opt.keyword;
        var page = opt.page;

        return blogDataService.blogs().then(function(blogs){
            var _blogs = blogs.filter(function(blog){
                var reg = new RegExp(keyword);
                //搜索博客名称，路径，正文里包含关键字的博客
                return blog.name.match(reg) || blog.path.match(reg) || blog.content.match(reg);
            });
            return _blogs;
        }).then(function(blogs){

            var page = opt.page || 1;
            //分页，每页条数
            var limit = 5;
            //符合条件的博客的所有条数
            var total = blogs.length;
            //生成分页对象
            var pagination = paginationFactory.init(page,limit,total);
            //分页后的博客
            var _blogs = blogs.slice(limit*(page-1),limit*page);
            return {blogs:_blogs,pagination:pagination}

        });

    }

}]);