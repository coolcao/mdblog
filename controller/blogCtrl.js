'use strict';

var mongo = require('../config/mongo');
var Blog = require('../module/Blog.js');
var Base = require('../module/Base');
var hookService = require('../service/hookService');
var blogService = require('../service/blogService');
var hook = require('../hook.json');
var queryString = require('querystring');
var showdown = require('showdown');
var converter = new showdown.Converter({
    tables:true,
    parseImgDimensions: true
});
var blogService = require('../service/blogService');

var list = function(req, res) {
    var tag = req.query.tag;
    var page = req.query.page >>> 0;

    blogService.listByPage({
        tag: tag
    }, {
        page: page
    }).then(function(data) {
        var blogs = Array.from(data.blogs);
        blogs.forEach(function(item, index, array) {
            item.subcontent = item.content.substring(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            item.content = converter.makeHtml(item.content);
        });
        res.json({
            blogs:blogs,
            pagination:data.pagination
        });

    }).catch(function(err) {
        console.log(err);
        res.send(err);
    });
};

var detail = function detail(req, res) {
    var id = req.params.id;
    blogService.queryById(id).then(function(result) {
        if(result){
            result.content = converter.makeHtml(result.content).replace(/<pre>/g, '<pre class="prettyprint">');
        }
        res.json({ret:0,blog:result});
    }).catch(function(err) {
        res.json({
            ret:500,
            err:err
        });
    });
}

var post = function(req, res) {
    // var body = req.body;
    var body = hook;
    if (!body) {
        console.log('接收github的鉤子請求失敗');
        return res.json({
            ret: 500,
            err: '參數錯誤,body不能爲空'
        });
    }

    var commits = body.commits;
    let added = [];
    let removed = [];
    let updated = [];

    commits.forEach(commit => {
        if(!commit){
            return res.send({
                ret:500,
                err:'此次提交没有commit'
            });
        }
        added = added.concat(commit.added);
        removed = removed.concat(commit.removed);
        updated = updated.concat(commit.modified);
    });

    added.forEach(blog => {
        console.log(`要添加的博客：【${blog}】`);
        blogService.get_and_save(blog).then(result => {
            console.log('添加博客' + path + '成功');
        }).catch(err => {
            console.log(err);
        });
    });

        removed.forEach(function(blog) {
            console.log('刪除的博客：' + blog);
            blogService.remove(blog).then(result => {
                console.log(`删除博客：【${blog}】`);
            }).catch(err => {
                console.log(err);
            });
        });

        modified.forEach(function(blog) {
            console.log('修改的博客：' + blog);
            hookService.content(blog).then(function(_blog) {
                return blogService.update(_blog);
            }).then(result => {
                console.log(`修改博客：【${blog}】`);
            }).catch(function(err) {
                console.log(err);
            });
        });

    res.json({
        added:added,
        removed:removed,
        updated:updated
    });
};

var tags = function tags(req, res) {
    blogService.tags().then(function(tags) {
        tags.forEach(function(item) {
            item.tag = item.catalog;
            delete item.catalog;
        });
        res.json({
            ret: 0,
            tags: tags
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            ret: 500,
            err: err
        });
    });
};


var search = function search(req, res) {
    var kw = req.query.keyWord ? req.query.keyWord : '.';
    var page = req.query.page >>> 0;
    blogService.search(kw, {
        page: page
    }).then(function(data) {
        var blogs = Array.from(data.blogs);
        blogs.forEach(function(item, index, array) {
            item.subcontent = item.content.substring(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            item.content = converter.makeHtml(item.content);
        });
        //手动剔除query中的page参数
        delete req.query.page;
        res.json({
            blogs:blogs,
            pagination:data.pagination
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            ret:500,err:err
        });
    });
}

module.exports = {
    list, post, detail, tags, search
};
