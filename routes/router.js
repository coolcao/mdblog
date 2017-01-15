/**
 * Created by coolcao on 16/8/3.
 */

'use strict';

const blog = require('./blog');
const core = require('./core');

module.exports = function (app) {
    app.use('/blogs', blog);
    app.use('/',core);
};
