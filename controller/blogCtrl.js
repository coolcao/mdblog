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
    var body = req.body;
    // var body = hook;
    if (!body) {
        console.log('接收github的鉤子請求失敗');
        return res.json({
            ret: 500,
            err: '參數錯誤,body不能爲空'
        });
    }

    var commits = body.commits;
    commits.forEach(function(commit) {
        if (!commit) {
            return res.send({
                ret: 500,
                err: '此次提交沒有head_commit'
            });
        }
        var added = commit.added;
        var removed = commit.removed;
        var modified = commit.modified;

        added.forEach(function(path) {
            console.log('添加的博客：' + path);
            blogService.get_and_save(path).then(function() {
                console.log('添加博客' + path + '成功');
            }).catch(function(err) {
                console.log(err);
            });
        });

        removed.forEach(function(path) {
            console.log('刪除的博客：' + path);
            blogService.remove(path);
        });

        modified.forEach(function(path) {
            console.log('修改的博客：' + path);
            hookService.content(path).then(function(_blog) {
                blogService.update(_blog).catch(function(err) {
                    console.log(err);
                });
            }).catch(function(err) {
                console.log(err);
            });
        });
    });
    res.send(hook);
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