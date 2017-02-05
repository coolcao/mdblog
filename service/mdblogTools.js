'use strict';

let required = function(arg) {
    throw new Error(`parameter ${arg} must be required!`);
}

let parseBlogInfo = function(content = required('content')) {
    let reg = /(<!--mdblog)([\s\S]*?)(mdblog-->\s)/;
    let result = content.match(reg);
    if (result) {
        let blogInfo = JSON.parse(result[2]);
        blogInfo.tags = blogInfo.tags.split(',');
        if (blogInfo && blogInfo.time) {
            blogInfo.date = Date.parse(blogInfo.time);
        }
        return blogInfo;
    }else{
        return null;
    }

}

module.exports = {
    parseBlogInfo
}