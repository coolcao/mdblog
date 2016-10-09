/**
 * Created by coolcao on 16/8/3.
 */

'use strict';

var blog = require('./blog');
var core = require('./core');

module.exports = function (app) {
    app.use('/blogs', blog);
    app.use('/',core);
};
