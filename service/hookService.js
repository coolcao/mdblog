'use strict';

var request = require('request');
var config = require('../config/config');
var Promise = require('bluebird');

var options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/vnd.github.v3+json'
    }
};

//根據path獲取文件內容
var content = function(path) {
    //這裏要對文件名裏的/進行urlencode轉碼，否則請求不到
    // var fullPath = config.github.url.content + urlencode(path);
    var fullPath = config.github.url.content + encodeURIComponent(path);
    options.url = fullPath;

    var p = new Promise(function(resolve, reject) {
        request.get(options, function(err, response, body) {
            // console.log('---------------------------hook-service-------------------');
            // console.log(err);
            // console.log(response.statusCode);
            // console.log(body);
            // console.log('--------------------------------------------------------');
            if (err || response.statusCode != 200) {
                reject(err || {
                        ret: 500,
                        err: "根據文件名" + path + "獲取文件內容失敗，返回狀態碼:" + response.statusCode
                    });
            }
            if (typeof body == 'string') {
                body = JSON.parse(body);
            }
            if (!body || !body.content) {
                resolve(null);
            } else {
                body.content = (new Buffer(body.content, 'base64')).toString();

                //Get the catalog from path
                var as = body.path.split('/');
                // if (as.length > 1) {
                //     body.catalog = as[0];
                // }
                Array.isArray(as) && as.pop();
                body.catalog = as;
                resolve(body);
            }
        });
    });

    return p;
};

module.exports = {
    content
};
