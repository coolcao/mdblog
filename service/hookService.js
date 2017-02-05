'use strict';

const request = require('request');
const config = require('../config/config');
const Promise = require('bluebird');
const mdblogTools = require('./mdblogTools.js');

let options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/vnd.github.v3+json'
    }
};

//根據path獲取文件內容
const content = function(path) {
    //這裏要對文件名裏的/進行urlencode轉碼，否則請求不到
    // var fullPath = config.github.url.content + urlencode(path);
    let fullPath = config.github.url.content + encodeURIComponent(path);
    options.url = fullPath;

    const p = new Promise(function(resolve, reject) {
        request.get(options, function(err, response, body) {

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

                Array.isArray(as) && as.pop();

                body.catalog = as;

                //设置标题
                let mdblogInfo = mdblogTools.parseBlogInfo(body.content);
                if(mdblogInfo){
                    body.create_time = new Date(mdblogInfo.time);
                    body.update_time = new Date(mdblogInfo.time);
                    body.tags = mdblogInfo.tags;
                }
                
                resolve(body);
            }
        });
    });

    return p;
};

module.exports = {
    content
};
