let find = (item, tree) => {
  let q = [];
  let r = null;
  q.push(tree);
  while (q.length) {
    let t = q.shift();
    if (t.key == item) {
      r = t;
      break;
    }
    q = q.concat(t.child);
  }
  return r;
}

class CatalogTree {
  key: string;
  count: number;
  child: Array<object>;
  constructor(catalogs) {
    this.key = 'catalog';
    this.count = 0;
    this.child = [];
    if (catalogs && Array.isArray(catalogs)) {
      catalogs.forEach(catalog => {
        if (Array.isArray(catalog) && catalog.length > 0) {
          // this.count ++;
          this.insert(catalog);
        }
      });
    }
  }

  find(item) {
    return find(item, this);
  }

  /**
   * 插入目录
   * @param  {Array} catalog 目录数组，型如：['技术','前端','nodejs']
   */
  insert(catalog) {
    if (!Array.isArray(catalog)) {
      throw new Error('catalog类型错误，只能是数组');
    }

    //如果目录数组为空，则直接返回
    if (catalog.length <= 0) {
      return this;
    }

    //每进行一次正常插入，计数加1
    this.count++;

    let tree = this;
    let last_found = this;

    while (catalog.length > 0) {
      let item = catalog.shift();
      tree = find(item, tree);
      if (tree) {
        tree.count++;
        last_found = tree;
      } else {
        let new_node = {
          key: item,
          count: 1,
          child: []
        };
        last_found.child.push(new_node);
        while (catalog.length > 0) {
          new_node.child.push(new_node = {
            key: catalog.shift(),
            count: 1,
            child: []
          });
        }
        break;
      }

    }

    return this;
  }

  /**
   * 以数组统计的形式返回目录
   * @return {Array}
   */
  values() {
    let q = [];
    let r = [];
    q = q.concat(this.child);
    while (q.length > 0) {
      let t = q.shift();
      r.push({ key: t.key, count: t.count });
      q = q.concat(t.child);
    }
    return r;
  }
}

export default CatalogTree;

