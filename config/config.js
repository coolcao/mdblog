'use strcit';

var env = process.env;
var config = {
    mongo: {
        url: "mongodb://127.0.0.1:27017/coolcao"
    },
    github: {
        url: {
            content: "https://api.github.com/repos/coolcao/blogs/contents/"
        }
    },
    pagination: {
        page: 1, //默认第几页
        limit: 5 //每页的条数
    }
};
if (env.ENV == 'production') {
    config = {
        mongo: {
            url: "mongodb://10.0.0.20:27017/coolcao"
        },
        github: {
            url: {
                content: "https://api.github.com/repos/coolcao/blogs/contents/"
            }
        }
    }
} else if (env.ENV == 'mopaas') {
    var username = env.MONGO_USER;
    var password = env.MONGO_PASS;
    var host = env.MONGO_HOST;
    var port = env.MONGO_PORT;
    var dbname = env.MONGO_DB_NAME;
    config = {
        mongo: {
            url: "mongodb://" + username + ":" + password + "@" + host + ":" + port + "/" + dbname
        },
        github: {
            url: {
                content: "https://api.github.com/repos/coolcao/blogs/contents/"
            }
        }
    }
}

module.exports = config;
