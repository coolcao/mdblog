/// <reference path="../../typings/index.d.ts" />
//# sourceMappingURL=path/to/source.map

import * as  mongo from '../config/mongo';
import { ObjectID, Collection } from 'mongodb';
import Pagination from './Pagination';
import config from '../config/config';

class Base {
  _id: ObjectID;
  create_time: Date;
  update_time: Date;
  coll_name: string;
  //构造器
  constructor(_id = new ObjectID(), create_time = new Date(), update_time = new Date()) {
    this._id = _id;
    this.create_time = create_time;
    this.update_time = update_time;
  }
  //重写_id的set,get方法
  set id(_id: ObjectID) {
    this._id = _id;
  }
  get id(): ObjectID {
    return this._id;
  }

  //静态方法
  static queryById(coll_name: String, _id: ObjectID) {
    return mongo.getCollection(coll_name).then((coll: Collection) => {
      return coll.findOne({ _id: _id });
    });
  };
  static query(coll_name: String, query_opt: Object, pagination: Pagination) {
    let page = pagination && pagination.page || config.pagination.page;
    let limit = pagination && pagination.limit || config.pagination.limit;
    return mongo.getCollection(coll_name).then((coll: Collection) => {
      return coll.find(query_opt).skip((page - 1) * limit).limit(limit).sort({
        update_time: -1
      }).toArray();
    })
  };

  static queryAll(coll_name) {
    return mongo.getCollection(coll_name).then((coll: Collection) => {
      return coll.find().sort({ update_time: -1 }).toArray();
    });
  }

  static save(coll_name, ibase) {
    return mongo.getCollection(coll_name).then((coll: Collection) => {
      return coll.save(ibase);
    })
  };
  static update(coll_name, ibase) {
    return mongo.getCollection(coll_name).then((coll: Collection) => {
      return coll.update({
        _id: ibase._id
      }, ibase);
    });
  };
  static count(coll_name, opt) {
    return mongo.getCollection(coll_name).then((coll: Collection) => {
      return coll.count(opt);
    });
  };

  //实例方法
  queryById() {
    return Base.queryById(this.coll_name, this.id);
  }
  save() {
    return Base.save(this.coll_name, this);
  }
  update() {
    return Base.update(this.coll_name, this);
  }

};

export default Base ;
