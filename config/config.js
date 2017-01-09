'use strcit';

var env = process.env;
var config = {
    mongo: {
        // url: env.MONGO_URL || "mongodb://127.0.0.1:27017/coolcao"
        url: env.MONGO_URL || "mongodb://123.56.221.60:27017/coolcao"
    },
    github: {
        url: {
            content: env.GITHUB_CONTENT || "https://api.github.com/repos/coolcao/blogs/contents/"
        }
    },
    pagination: {
        page: 1, //默认第几页
        limit: 5 //每页的条数
    }
};

module.exports = config;
