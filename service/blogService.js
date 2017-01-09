/**
 * Created by coolcao on 16/8/3.
 */

'use strict'

var Blog = require('../module/Blog');
var hookService = require('./hookService');
var Promise = require('bluebird');
var ObjectID = require('mongodb').ObjectID;
var Pagination = require('../module/pagination.js');
var config = require('../config/config.js');
const coll_name = 'blogs';

//保存到數據庫
var save = function save(iblog) {
    var blog = new Blog(iblog);
    return blog.save();
}


/**
 查询所有，没有分页
 **/
var list = function list(opt) {
    var tag = opt.tag;
    var query = {};
    if (tag) {
        query.catalog = tag;
    }
    return new Promise(function(resolve, reject) {
        Blog.query(query).then(function(blogs) {
            resolve(blogs);
        }).catch(function(err) {
            console.log(err);
            reject(err);
        });
    });

}

/**
 分页查询列表
 **/
var listByPage = function listByPage(opt, pagination) {
    var tag = opt.tag;
    var page = pagination && pagination.page ? pagination.page : config.pagination.page;
    var limit = pagination && pagination.limit ? pagination.limit : config.pagination.limit;
    var query = {};
    if (tag) {
        query.catalog = tag;
    }
    var list = function list(query) {
        return Blog.query(query, {
            page: page,
            limit: limit
        });
    }
    return new Promise(function(resolve, reject) {
        Promise.all([list(query), Blog.count(query)]).then(function(values) {
            var docs = values[0];
            var count = values[1];
            var _pagination = new Pagination(page, limit, count);
            resolve({
                blogs: docs,
                pagination: _pagination
            });
        }).catch(function(err) {
            reject(err);
        });
    });
}

var search = function search(kw,pagination) {
    var page = pagination&&pagination.page?pagination.page:config.pagination.page;
    var limit = pagination&&pagination.limit?pagination.limit:config.pagination.limit;
    var query = {
        "$or":[
            {"path":{"$regex":".+"+kw+".+"}},
            {"content":{"$regex":".+"+kw+".+"}}
        ]
    };
    var blog = new Blog();
    var queryFun = function (query) {
        return Blog.query(query,{page:page,limit:limit});
    }
    return new Promise(function (resolve,reject) {
        Promise.all([queryFun(query),Blog.count(query)]).then(function (values) {
            var docs = values[0];
            var count = values[1];
            var _pagination = new Pagination(page,limit,count);
            resolve({
                blogs:docs,
                pagination:_pagination
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

var queryById = function queryById(id) {
    let blog = new Blog({_id:id});
    return blog.queryById();
}

var updateByPath = function updateByPath(iblog) {
    var blog = new Blog(iblog);
    return new Promise(function(resolve, reject) {
        blog.queryByPath().then(function(b) {
            if (b && b._id) {
                blog._id = b._id;
                blog.updateByPath().then(function(result) {
                    resolve(result);
                });
            } else {
                console.log(b);
                reject('根據path進行更新時，查詢出的博客爲空，或者其id爲空');
            }
        }).catch(function(err) {
            console.log(err);
            reject(err);
        });
    });
}

var remove = function remove(path) {
    var blog = new Blog({
        path: path
    });
    return blog.deleteByPath();
}

var tags = function tags() {
    var blog = new Blog();
    return blog.tags();
}

//獲取博客內容，並保存到數據庫
var get_and_save = function(path) {
    var p = new Promise(function(resolve, reject) {
        if (!path) {
            reject('獲取並保存blog時，path不能爲空');
        } else {
            var blog = new Blog({
                path: path
            });
            blog.queryByPath().then(function(b) {
                if (b) {
                    console.log('博客<<' + path + '>>已存在，不再存儲');
                } else {
                    hookService.content(path).then(function(iblog) {
                        if (iblog) {
                            var blog = new Blog(iblog);
                            blog.save();
                        }
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            }).catch(function(err) {
                reject(err);
            });
        }
    });
    return p;
};

module.exports = {
    save: save,
    list: list,
    listByPage: listByPage,
    search:search,
    tags: tags,
    queryById: queryById,
    update: updateByPath,
    remove: remove,
    get_and_save: get_and_save
};

