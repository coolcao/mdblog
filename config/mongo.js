'use strict';

const config = require('./config');
const MongoClient = require('mongodb').MongoClient;

const getDB = MongoClient.connect(config.mongo.url);

const getCollection = function (coll) {
    if(typeof coll != 'string'){
        console.log(JSON.stringify(coll));
        return Promise.reject(`参数coll必须为字符串类型的集合名称`);
    }
    return getDB.then((db)=>{
        return db.collection(coll);
    })
}


module.exports = {
    getDB: getDB,
    getCollection:getCollection
};
