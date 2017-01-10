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

mongo.getCollection('blogs').then(coll => {
  let list = listMdFilesExceptHidden(filePath)
  list.forEach(item => {
    let subpath = item.replace(filePath + '/','');
    let array = subpath.split('/');
    let name = array.pop();
    let catalog = array;

    fs.readFile(item,'utf-8',function(err,data){
      let blog = new Blog({content:data,path:subpath,name:name,catalog:catalog});
      coll.insert(blog).then(result => {
        console.log(`insert ${blog.name} success`);
      }).catch(err => {
        console.log(`insert ${blog.name} fail! ${err.message}`);
      });
    });
  })
})


