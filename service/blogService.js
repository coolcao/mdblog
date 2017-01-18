/**
 * Created by coolcao on 16/8/3.
 */

'use strict'

const Blog = require('../module/Blog');
const hookService = require('./hookService');
const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;
const Pagination = require('../module/pagination.js');
const config = require('../config/config.js');
const coll_name = 'blogs';

//保存到數據庫
const save = function save(iblog) {
    var blog = new Blog(iblog);
    return blog.save();
}


/**
 查询所有，没有分页
 **/
const list = function list(opt) {
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
const listByPage = function listByPage(opt, pagination) {
    let tag = opt.tag;
    let page = pagination && pagination.page ? pagination.page : config.pagination.page;
    let limit = pagination && pagination.limit ? pagination.limit : config.pagination.limit;
    let query = {};
    if (tag) {
        query.catalog = tag;
    }
    let list = function list(query) {
        return Blog.query(query, {
            page: page,
            limit: limit
        });
    }
    return new Promise(function(resolve, reject) {
        Promise.all([list(query), Blog.count(query)]).then(function(values) {
            let docs = values[0];
            let count = values[1];
            let _pagination = new Pagination(page, limit, count);
            resolve({
                blogs: docs,
                pagination: _pagination
            });
        }).catch(function(err) {
            reject(err);
        });
    });
}

const search = function search(kw,pagination) {
    let page = pagination&&pagination.page?pagination.page:config.pagination.page;
    let limit = pagination&&pagination.limit?pagination.limit:config.pagination.limit;
    let query = {
        "$or":[
            {"path":{"$regex":".+"+kw+".+"}},
            {"content":{"$regex":".+"+kw+".+"}}
        ]
    };
    let blog = new Blog();
    let queryFun = function (query) {
        return Blog.query(query,{page:page,limit:limit});
    }
    return new Promise(function (resolve,reject) {
        Promise.all([queryFun(query),Blog.count(query)]).then(function (values) {
            let docs = values[0];
            let count = values[1];
            let _pagination = new Pagination(page,limit,count);
            resolve({
                blogs:docs,
                pagination:_pagination
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

const queryById = function queryById(id) {
    let blog = new Blog({_id:id});
    return blog.queryById();
}

const queryByPath = (path) => {
    let blog = new Blog({path:path});
    return blog.queryByPath();
}


const updateByPath = function updateByPath(iblog) {
    let blog = new Blog(iblog);
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

const remove = function remove(path) {
    let blog = new Blog({
        path: path
    });
    return blog.deleteByPath();
}

const tags = function tags() {
    let blog = new Blog();
    return blog.tags();
}

//獲取博客內容，並保存到數據庫
const get_and_save = function(path) {
    let p = new Promise(function(resolve, reject) {
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
    get_and_save: get_and_save,
    queryByPath:queryByPath
};

