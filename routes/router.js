
'use strict';

const blog = require('./blog.router.js');

module.exports = function (app) {
    //router
    app.use(blog.routes());
};
