'use strict'

const mongo = require('../config/mongo')
const Blog = require('../module/Blog.js')
const Base = require('../module/Base')
const hookService = require('../service/hookService')
const blogService = require('../service/blogService')
const queryString = require('querystring')
const showdown = require('showdown')
const CatalogTree = require('../module/CatalogTree.js')
const converter = new showdown.Converter({
    tables: true,
    parseImgDimensions: true
})

const list = function(req, res) {
    let tag = req.query.tag
    let page = req.query.page >>> 0

    blogService.listByPage({
        tag: tag
    }, {
        page: page
    }).then(function(data) {
        let blogs = Array.from(data.blogs)
        blogs.forEach(function(item, index, array) {
            item.subcontent = item.content.substring(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;')
            item.content = converter.makeHtml(item.content)
        })
        res.json({
            blogs: blogs,
            pagination: data.pagination
        })
    }).catch(function(err) {
        console.log(err)
        res.send(err)
    })
}

const listAll = (req,res) => {
    console.time('list all');
    blogService.queryAll().then(blogs => {
        blogs.forEach(function(item, index, array) {
            item.subcontent = item.content.substring(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;')
            item.content = converter.makeHtml(item.content)
        });
        console.timeEnd('list all');
        res.json({blogs:blogs});
    }).catch(err => {
        res.send(err);
    });
}

const detail = function detail(req, res) {
    let id = req.params.id
    blogService.queryById(id).then(function(result) {
        if (result) {
            result.content = converter.makeHtml(result.content).replace(/<pre>/g, '<pre class="prettyprint">')
        }
        res.json({
            ret: 0,
            blog: result
        })
    }).catch(function(err) {
        res.json({
            ret: 500,
            err: err
        })
    })
}

const detailPath = (req, res) => {
    let path = req.params.path
        // 注意这里的path，前端传的时候一定要进行urlencoding，后端这里也要解，但是使用的express库会自动解
    blogService.queryByPath(path).then(function(result) {
        if (result) {
            result.content = converter.makeHtml(result.content).replace(/<pre>/g, '<pre class="prettyprint">')
        }
        res.json({
            ret: 0,
            blog: result
        })
    }).catch(function(err) {
        res.json({
            ret: 500,
            err: err
        })
    })
}

const post = function(req, res) {
    let body = req.body
    if (!body) {
        console.log('接收github的鉤子請求失敗')
        return res.json({
            ret: 500,
            err: '參數錯誤,body不能爲空'
        })
    }

    let commits = body.commits
    let added = []
    let removed = []
    let updated = []

    commits.forEach(commit => {
        if (!commit) {
            return res.send({
                ret: 500,
                err: '此次提交没有commit'
            })
        }
        added = added.concat(commit.added)
        removed = removed.concat(commit.removed)
        updated = updated.concat(commit.modified)
    })

    added.forEach(blog => {
        console.log(`要添加的博客：【${blog}】`)
        blogService.get_and_save(blog).then(result => {
            console.log('添加博客' + path + '成功')
        }).catch(err => {
            console.log(err)
        })
    })

    removed.forEach(function(blog) {
        console.log('刪除的博客：' + blog)
        blogService.remove(blog).then(result => {
            console.log(`删除博客：【${blog}】`)
        }).catch(err => {
            console.log(err)
        })
    })

    updated.forEach(function(blog) {
        console.log('修改的博客：' + blog)
        hookService.content(blog).then(function(_blog) {
            return blogService.update(_blog)
        }).then(result => {
            console.log(`修改博客：【${blog}】`)
        }).catch(function(err) {
            console.log(err)
        })
    })

    res.json({
        added: added,
        removed: removed,
        updated: updated
    })
}

const tags = function tags(req, res) {
    let values = null
    blogService.tags().then(function(tags) {
        res.json({
            ret: 0,
            tags: tags
        })
    }).catch(function(err) {
        console.log(err)
        res.json({
            ret: 500,
            err: err
        })
    })
}

const search = function search(req, res) {
    let kw = req.query.keyword ? req.query.keyword : '.'
    let page = req.query.page >>> 0
    blogService.search(kw, {
        page: page
    }).then(function(data) {
        let blogs = Array.from(data.blogs)
        blogs.forEach(function(item, index, array) {
                item.subcontent = item.content.substring(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;')
                item.content = converter.makeHtml(item.content)
            })
            // 手动剔除query中的page参数
        delete req.query.page
        res.json({
            blogs: blogs,
            pagination: data.pagination
        })
    }).catch(function(err) {
        console.log(err)
        res.json({
            ret: 500,
            err: err
        })
    })
}

module.exports = {
    list,
    listAll,
    post,
    detail,
    detailPath,
    tags,
    search
}