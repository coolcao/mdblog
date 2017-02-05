'use strict'

const Promise = require('bluebird')
const mongo = require('./config/mongo')
const fs = require('fs')
const filePath = '/Users/coolcao/mycode/coolcao/blogs'
const Blog = require('./module/Blog.js');
const hexoTools = require('./service/hexoTools.js');
const mdblogTools = require('./service/mdblogTools.js');

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

    let stat = fs.statSync(path);
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


// let data = fs.readFileSync('/Users/coolcao/mycode/coolcao/blogs/js/计算机中的负数为什么使用补码表示.md','utf-8');
// let head = data && mdblogTools.parseBlogInfo(data);
// console.log(head);
// let stats = fs.statSync('/Users/coolcao/mycode/coolcao/blogs/js/计算机中的负数为什么使用补码表示.md');
// console.log(stats);


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
    let stats = fs.statSync(item);
    let mdblogInfo = data && mdblogTools.parseBlogInfo(data);
    let head = data && hexoTools.parseHead(data);
    let iblog = {
      create_time:stats.birthtime,
      update_time:stats.mtime,
      content:data,
      path:subpath,
      name:name,
      catalog:catalog
    }
    console.log(item);
    if(head){
      let title = head && head.title;
      let date = head && head.date;
      iblog.content = head.head && data.replace(head.head,'');
      iblog.name = title || name;
      iblog.tags = head.tags;
      try{
        iblog.create_time = new Date(date);
        iblog.update_time = new Date(date);
      }catch(err){
        console.log(err.message);
      }
    }else if(mdblogInfo){
      iblog.name = mdblogInfo.title;
      iblog.create_time = new Date(mdblogInfo.time);
      iblog.update_time = new Date(mdblogInfo.time);
      iblog.tags = mdblogInfo.tags;
    }
    // let blog = new Blog({content:data,path:subpath,name:title || name,catalog:catalog,create_time:date,update_time:date});
    let blog =  new Blog(iblog);
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



