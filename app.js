const Koa = require('koa');
const serve = require('koa-static');

const router = require('./routes/router.js');

const app = new Koa();

app.use(async (ctx,next) => {
    try{
        await next();
    }catch(err){
        ctx.response.body = {
            ret:500,
            err:err.message || err
        };
        console.log('全局捕捉到错误：' + (err.message || err));
    }
});

//time计时
app.use(async (ctx,next) => {
    let start = new Date();
    await next();
    console.log(`${ctx.request.method}    ${ctx.request.url}    ${new Date() - start}ms`);
});

//设置静态目录
app.use(serve(__dirname + '/public'));

//router
router(app);


// app.use(async (ctx,next) => {
//     console.log('用户认证');
//     // await next();
//     ctx.response.body = '用户未认证'
// });


app.listen(3000);
console.log('app started at port 3000...');