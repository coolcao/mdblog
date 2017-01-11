'use strict';

/**
 * 构建目录树结构
 * @param  {Array} catalogs [目录树数组，结构如下：]
 * [['博客','mongo'],['博客','js'],['随笔','音乐'],['随笔','电影','喜剧电影']]
 * @return {obj}          [树结构]
 */
let createCatalogTree = function createCatalogTree(catalogs) {
    let obj = {
        key: 'catalog',
        count: 0,
        child: []
    };



    let insert = (item, parent) => {
        let key = obj.key;
        let child = obj.child;
        let o = obj; //当前parent所在的对象
        let has = false; //标识item是否已经存在
        let existed = null; //已经存在item的对象

        while (key !== parent) {
            for (let c of child) {
                key = c.key;
                child = c.child;
                o = c;
            }
        }
        if (o.child && Array.isArray(o.child)) {
            for (let ch of o.child) {
                if (ch.key == item) {
                    existed = ch;
                    has = true;
                    break;
                }
            }
        }

        if (existed) {
            existed.count++;
        } else {
            o.child.push({
                key: item,
                count: 1,
                child: []
            });
            // o.count ++;
        }

    };
    catalogs.forEach(catalog => {
        for (let i = 0; i < catalog.length; i++) {
            // console.log(catalog[i]);
            if (i === 0) {
                insert(catalog[i], 'catalog');
            } else {
                insert(catalog[i], catalog[i - 1]);
            }
        }
    });
    //重置顶层目录计数统计
    obj.child.forEach(item => {
        obj.count += item.count;
    });
    return obj;
}


module.exports = {
  createCatalogTree
}