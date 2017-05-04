import * as showdown from 'showdown';
import CatalogTree from '../module/CatalogTree';
import blogService from '../service/blogService';
import hookService from '../service/HookService';

const converter = new showdown.Converter({
  tables: true,
  parseImgDimensions: true
})

export default {
  async list(ctx, next) {
    let tag: string = ctx.request.query.tag;
    let page: number = ctx.request.query.page >>> 0;
    let catalog: string = ctx.request.query.catalog;
      
    let data: any = await blogService.listByPage({
      tag: tag,
      catalog: catalog
    }, {
        page: page
      });

    ctx.response.body = {
      ret: 0,
      blogs: data.blogs,
      pagination: data.pagination
    };
  },

  async detail(ctx, next) {
    let id = ctx.params.id;
    let blog = await blogService.queryById(id);
    ctx.response.body = {
      ret: 0,
      blog: blog
    };
  },

  async detailPath(ctx, next) {
    let path = ctx.params.path;
    // 注意这里的path，前端传的时候一定要进行urlencoding，后端这里也要解，但是使用的express库会自动解
    let result = await blogService.queryByPath(path);
    ctx.response.body = {
      ret: 0,
      blog: result
    };
  },


  async post(ctx, next) {
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
        console.log('添加博客' + blog.path + '成功')
      }).catch(err => {
        console.log(err)
      })
    })

    removed.forEach(function (blog) {
      console.log('刪除的博客：' + blog)
      this.blogService.remove(blog).then(result => {
        console.log(`删除博客：【${blog}】`)
      }).catch(err => {
        console.log(err)
      })
    })

    updated.forEach(function (blog) {
      console.log('修改的博客：' + blog)
      this.hookService.content(blog).then(function (_blog) {
        return this.blogService.updateByPath(_blog)
      }).then(result => {
        console.log(`修改博客：【${blog}】`)
      }).catch(function (err) {
        console.log(err)
      })
    })

    ctx.response.body = {
      added: added,
      removed: removed,
      updated: updated
    };
  },

  async tags(ctx, next) {
    let values = null
    let tags = await blogService.tags();
    ctx.response.body = {
      ret: 0,
      tags: tags
    }
  },


  async catalogs(ctx, next) {
    let catalogs = await blogService.catalogs();
    ctx.response.body = {
      ret: 0,
      catalogs: catalogs
    }
  },

  async search(ctx, next) {
    let kw = ctx.request.query.keyword ? ctx.request.query.keyword : '.';
    let page = ctx.request.query.page >>> 0
    let data: any = await blogService.search(kw, {
      page: page
    });
    delete ctx.request.query.page;
    ctx.response.body = {
      blogs: data.blogs,
      pagination: data.pagination
    }
  }
}

