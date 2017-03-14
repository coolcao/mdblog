'use strict';

const showdown = require('showdown')
const CatalogTree = require('../module/CatalogTree.js')
const converter = new showdown.Converter({
    tables: true,
    parseImgDimensions: true
})
const blogService = require('../service/blogService.js');

const list = async(ctx, next) => {
    let tag = ctx.request.query.tag;
    let page = ctx.request.query.page >>> 0;
    let catalog = ctx.request.query.catalog;

    let data = await blogService.listByPage({
        tag: tag,
        catalog: catalog
    }, {
        page: page
    });
    let blogs = Array.from(data.blogs);
    blogs.forEach(function(item, index, array) {
        item.subcontent = item.content.substring(0, 300).replace(/</g, '&lt;').replace(/>/g, '&gt;')
        item.content = converter.makeHtml(item.content)
    })

    ctx.response.body = {
        ret: 0,
        blogs: blogs,
        pagination: data.pagination
    };
};

const listAll = async(ctx, next) => {
    let blogs = await blogService.queryAll();
    blogs.forEach(function(item, index, array) {
        item.content = converter.makeHtml(item.content)
    });
    ctx.response.body = {
        ret: 0,
        blogs: blogs
    };
}

const detail = async(ctx, next) => {
    let id = ctx.params.id;
    let blog = await blogService.queryById(id);
    if (blog) {
        blog.content = converter.makeHtml(blog.content).replace(/<pre>/g, '<pre class="prettyprint">');
    }
    ctx.response.body = {
        ret: 0,
        blog: blog
    };
}

const detailPath = async(ctx, next) => {
    let path = ctx.params.path;
    // 注意这里的path，前端传的时候一定要进行urlencoding，后端这里也要解，但是使用的express库会自动解
    let result = await blogService.queryByPath(path);

    if (result) {
        result.content = converter.makeHtml(result.content).replace(/<pre>/g, '<pre class="prettyprint">');
    }
    ctx.response.body = {
        ret: 0,
        blog: result
    };
}

const post = async(ctx, next) => {
    let body = ctx.request.body;
    if (!body) {
        console.log('接收github的鉤子請求失敗')
        return ctx.response.body = {
            ret: 500,
            err: '參數錯誤,body不能爲空'
        };

    }

    let commits = body.commits
    let added = []
    let removed = []
    let updated = []

    commits.forEach(commit => {
        if (!commit) {
            return ctx.response.body = {
                ret: 500,
                err: '此次提交没有commit'
            };

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

    ctx.response.body = {
        added: added,
        removed: removed,
        updated: updated
    };
}

const tags = async(ctx, next) => {
    let values = null
    let tags = await blogService.tags();
    ctx.response.body = {
        ret: 0,
        tags: tags
    }
}

const catalogs = async(ctx, next) => {
    let catalogs = await blogService.catalogs();
    ctx.response.body = {
        ret: 0,
        catalogs: catalogs
    }
}

const search = async(ctx, next) => {
    let kw = ctx.request.query.keyword ? ctx.request.query.keyword : '.';
    let page = ctx.request.query.page >>> 0
    let data = await blogService.search(kw, {
        page: page
    });
    let blogs = Array.from(data.blogs);

    blogs.forEach((item, index, array) => {
            item.subcontent = item.content.substring(0, 100).replace(/</g, '&lt;').replace(/>/g, '&gt;')
            item.content = converter.makeHtml(item.content)
        })
        // 手动剔除query中的page参数
    delete ctx.request.query.page;

    ctx.response.body = {
        blogs: blogs,
        pagination: data.pagination
    }
}

module.exports = {
    list,
    listAll,
    detail,
    detailPath,
    post,
    tags,
    catalogs,
    search
}