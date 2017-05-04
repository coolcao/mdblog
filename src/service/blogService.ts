/**
 * Created by coolcao on 16/8/3.
 */

import Blog from '../module/Blog';
import hookService from './hookService';
import { ObjectID } from 'mongodb';
import Pagination from '../module/Pagination';
import config from '../config/config.js';

const coll_name = 'blogs';

export default {
  save(iblog: Blog) {
    let blog = new Blog(iblog);
    return blog.save();
  },

  list(opt: { tag, catalog, query }) {
    let tag = opt.tag;
    let catalog = opt.catalog;
    let query: any = {
    };
    if (tag) {
      query.tags = tag;
    }
    if (catalog) {
      query.catalog = catalog;
    }
    return new Promise(function (resolve, reject) {
      Blog.query(query, null).then(function (blogs) {
        resolve(blogs);
      }).catch(function (err) {
        console.log(err);
        reject(err);
      });
    });
  },

  listByPage(opt: { tag, catalog }, pagination: Pagination) {
    let tag = opt.tag;
    let catalog = opt.catalog;
    let page = pagination && pagination.page ? pagination.page : config.pagination.page;
    let limit = pagination && pagination.limit ? pagination.limit : config.pagination.limit;
    let query: any = {
    };
    if (tag) {
      query.tags = tag;
    }
    if (catalog) {
      query.catalog = catalog;
    }
    let list = function list(query) {
      return Blog.query(query, {
        page: page,
        limit: limit
      });
    }
    return new Promise(function (resolve, reject) {
      Promise.all([list(query), Blog.count(query)]).then(function (values) {
        let docs = values[0];
        let count = values[1];
        let _pagination = new Pagination(page, limit, count);
        resolve({
          blogs: docs,
          pagination: _pagination
        });
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  search(kw, pagination) {
    let page = pagination && pagination.page ? pagination.page : config.pagination.page;
    let limit = pagination && pagination.limit ? pagination.limit : config.pagination.limit;
    let query = {
      "$or": [
        { "path": { "$regex": ".*" + kw + ".*" } },
        { "content": { "$regex": ".*" + kw + ".*" } },
        { "name": { "$regex": ".*" + kw + ".*" } }
      ]
    };
    let blog = new Blog({});
    let queryFun = function (query) {
      return Blog.query(query, { page: page, limit: limit });
    }
    return new Promise(function (resolve, reject) {
      Promise.all([queryFun(query), Blog.count(query)]).then(function (values) {
        let docs = values[0];
        let count = values[1];
        let _pagination = new Pagination(page, limit, count);
        resolve({
          blogs: docs,
          pagination: _pagination
        });
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  queryById(id) {
    let blog = new Blog({ _id: id });
    return blog.queryById();
  },

  queryByPath(path) {
    let blog = new Blog({ path: path });
    return blog.queryByPath();
  },

  queryAll() {
    return Blog.queryAll();
  },


  updateByPath(iblog) {
    let blog = new Blog(iblog);
    return new Promise(function (resolve, reject) {
      blog.queryByPath().then(function (b: Blog) {
        if (b && b._id) {
          blog._id = b._id;
          blog.update_time = new Date();
          blog.updateByPath().then(function (result) {
            resolve(result);
          });
        } else {
          console.log(b);
          reject('根據path進行更新時，查詢出的博客爲空，或者其id爲空');
        }
      }).catch(function (err) {
        console.log(err);
        reject(err);
      });
    });
  },


  remove(path) {
    let blog = new Blog({
      path: path
    });
    return blog.deleteByPath();
  },

  tags() {
    let blog = new Blog({});
    return blog.getTags();
  },


  catalogs() {
    let blog = new Blog({});
    return blog.catalogs();
  },

  get_and_save(path) {
    let p = new Promise(function (resolve, reject) {
      if (!path) {
        reject('獲取並保存blog時，path不能爲空');
      } else {
        var blog = new Blog({
          path: path
        });
        blog.queryByPath().then(function (b) {
          if (b) {
            console.log('博客<<' + path + '>>已存在，不再存儲');
          } else {
            this.hookService.content(path).then(function (iblog) {
              if (iblog) {
                var blog = new Blog(iblog);
                blog.save();
              }
            }).catch(function (err) {
              reject(err);
            });
          }
        }).catch(function (err) {
          reject(err);
        });
      }
    });
    return p;
  }
} 
