'use strict';

const Base = require('./Base.js');
const mongo = require('../config/mongo');
const ObjectID = require('mongodb').ObjectID;
const CatalogTree = require('./CatalogTree.js');

/**
 {
     "title":"es6學習",
     "catalog":"es6",
     "path":"es6/es6學習筆記",
     "content":"學習es6的筆記"
 }
 **/
class Blog extends Base {
    constructor(iblog) {
        if (iblog) {
            super(iblog._id, iblog.create_time, iblog.update_time);
            this.name = iblog.name;
            this.content = iblog.content;
            this.path = iblog.path;
            this.catalog = iblog.catalog;
            this.tags = iblog.tags;
        } else {
            super();
        }
        this.coll_name = 'blogs';
    };

    static queryAll(){
        return Base.queryAll('blogs');
    }

    static query(query_opt,pagination){
        return Base.query('blogs',query_opt,pagination);
    }
    static count(opt){
        return Base.count('blogs',opt);
    };

    //根据path进行查询
    queryByPath() {
        return mongo.getCollection(this.coll_name).then((coll) => {
            return coll.findOne({
                path: this.path
            });
        });
    };

    updateByPath() {
        return mongo.getCollection(this.coll_name).then((coll) => {
            return coll.update({
                path: this.path
            }, this);
        });
    };

    deleteByPath() {
        return mongo.getCollection(this.coll_name).then((coll) => {
            return coll.deleteOne({
                path: this.path
            });
        });
    };

    catalogs() {
        return mongo.getCollection(this.coll_name).then((coll) => {
            return coll.find({},{catalog:1}).toArray();
        }).then(blogs => {
            let tagArrays = blogs.map(blog => {
                return blog.catalog;
            });
            return new CatalogTree(tagArrays);
        });
    }

    tags(){
        return mongo.getCollection(this.coll_name).then((coll) => {
            return coll.find({},{tags:1}).toArray();
        }).then(blogs => {

            let tags = blogs.reduce((pre,current) => {
                return pre.concat(current.tags);
            },[]).reduce((pre,current) => {
                if(current){
                    if(pre[current]){
                        pre[current] ++;
                    }else{
                        pre[current] = 1;
                    }
                }
                return pre;
            },{});

            let tagArrays = [];
            for(let key in tags){
                tagArrays.push({tag:key,count:tags[key]});
            }

            tagArrays.sort((a,b) => {
                return b.count - a.count;
            });

            // let tagArrays = blogs.map(blog => {
            //     return blog.tags;
            // });
            // return new CatalogTree(tagArrays);
            return tagArrays;
        });
    }
};

Blog.coll_name = 'blogs';


module.exports = Blog;