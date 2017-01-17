'use strcit';

const mongo = require('./mongo.json');

const env = process.env;
const config = {
    mongo: {
        // url: env.MONGO_URL || "mongodb://127.0.0.1:27017/coolcao"
        url: env.MONGO_URL || `mongodb://${mongo.user}:${mongo.pwd}@123.56.221.60:${mongo.port}/${mongo.db}`
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
