'use strict'

const Promise = require('bluebird')
const mongo = require('./config/mongo')
const fs = require('fs')
const filePath = '/Users/coolcao/mycode/coolcao/blogs'
const Blog = require('./module/Blog.js');

let mds = []
let dirs = []
let rootStat = fs.statSync(filePath)

let isHidden = function (path) {
  return (/(^|.\/)\.+[^\/\.]/g).test(path)
}

let isMd = function (path) {
  return (/.+\.md$/).test(path)
}

let listMdFilesExceptHidden = function (path) {
  let files = []
  let dirPath = function (path, files) {
    // 隐藏文件不显示
    if (isHidden(path)) {
      console.log(path + ' is hidden')
      return
    }

    let stat = fs.statSync(path)
    if (stat.isDirectory()) {
      let list = fs.readdirSync(path).map(item => {
        return path + '/' + item
      })
      list.forEach(item => {
        dirPath(item, files)
      })
    }else if (stat.isFile()) {
      if (isMd(path)) {
        files.push(path)
      }
    }
  }
  dirPath(path, files)
  return files
}

mongo.getDB.then(db => {
  let coll = db.collection('blogs');
  let list = listMdFilesExceptHidden(filePath);
  let ps = [];
  list.forEach(item => {
    let subpath = item.replace(filePath + '/','');
    let array = subpath.split('/');
    let name = array.pop();
    let catalog = array;
    let data = fs.readFileSync(item,'utf-8');
    let blog = new Blog({content:data,path:subpath,name:name,catalog:catalog});
    console.log(blog.path);
    ps.push(coll.insert(blog));
  });
  Promise.all(ps).then(result => {
    console.log('所有md文档已插入数据库');
    return db.close();
  }).then(result => {
    console.log('数据库已关闭');
  }).catch(err => {
    console.log(err);
  });
}).catch(err => {
  console.log(err);
});


