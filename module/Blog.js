'use strict';

var Base = require('./Base.js');
var objUtil = require('../utils/objUtil');
var mongo = require('../config/mongo');
var ObjectID = require('mongodb').ObjectID;

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
        } else {
            super();
        }
        this.coll_name = 'blogs';
    };

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

    tags() {
        return mongo.getCollection(this.coll_name).then((coll) => {
            return coll.group(['catalog'], {}, {
                count: 0
            }, "function(doc,prev){prev.count++}");
        });
    }
};

Blog.coll_name = 'blogs';


module.exports = Blog;