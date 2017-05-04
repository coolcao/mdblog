import config from './config';
import {MongoClient} from 'mongodb';

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

export {
  getDB,
  getCollection
}

