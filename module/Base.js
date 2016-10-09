'use strict';

var mongo = require('../config/mongo');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config/config.js');


class Base{
    //构造器
    constructor(_id=new ObjectID(),create_time=new Date(),update_time=new Date()){
        this._id = _id;
        this.create_time = create_time;
        this.update_time = update_time;
    }
    //重写_id的set,get方法
    set id(_id){
        this._id = _id;
    }
    get id(){
        return this._id;
    }

    //静态方法
    static queryById(coll_name,_id){
        if(typeof _id === 'string'){
            try{
                _id = new ObjectID(_id);
            }catch(err){
                console.log(`id:[${_id}]不能转换成ObjectId类型`);
            }
        }
        return mongo.getCollection(coll_name).then((coll)=>{
            return coll.findOne({_id:_id});
        })
    };
    static query(coll_name,query_opt,pagination){
        console.log(Base.coll_name);
        let page = pagination && pagination.page || config.pagination.page;
        let limit = pagination && pagination.limit || config.pagination.limit;
        return mongo.getCollection(coll_name).then((coll)=>{
            return coll.find(query_opt).skip((page - 1) * limit).limit(limit).sort({
                _id: -1
            }).toArray();
        })
    };

    static save(coll_name,ibase){
        return mongo.getCollection(coll_name).then((coll)=>{
            return coll.save(ibase);
        })
    };
    static update(coll_name,ibase){
        return mongo.getCollection(coll_name).then((coll)=>{
            return coll.update({
                _id:ibase._id
            },ibase);
        });
    };
    static count(coll_name  ,opt){
        return mongo.getCollection(coll_name).then((coll)=>{
            return coll.count(opt);
        });
    };

    //实例方法
    queryById(){
        return Base.queryById(this.coll_name,this.id);
    }
    save(){
        return Base.save(this.coll_name,this);
    }
    update(){
        return Base.update(this.coll_name,this);
    }

};

module.exports = Base;
