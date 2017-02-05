'use strict';

angular.module('app').service('blogService', ['$http', '$localStorage', '$q', '$filter','blogDataService','paginationFactory' ,function($http, $localStorage, $q, $filter,blogDataService,paginationFactory) {

    /**
     * 查询列表
     * @param  {Object} opt [封装查询条件]
     * @return {Promise}     [查询的列表，封装成Promise]
     */
    this.list = function list(opt) {

        var page = opt.page || 1;
        var tag = opt.tag ;
        var catalog = opt.catalog;

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
            return {blogs:_blogs,pagination:pagination}
        });

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