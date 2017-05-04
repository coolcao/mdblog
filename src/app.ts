/// <reference path="../typings/index.d.ts" />
//# sourceMappingURL=path/to/source.map

require('source-map-support').install();

import * as Koa from 'koa';
import * as serve from 'koa-static';
import router from './routes/router';

const app: Koa = new Koa();

app.use(async (ctx,next) => {
    try{
        await next();
    }catch(err){
        ctx.response.body = {
            ret:500,
            err:err.message || err
        };
        console.log('全局捕捉到错误：' + (err.message || err));
        console.log(err);
    }
});

//time计时
app.use(async (ctx,next) => {
    let start = (new Date()).getTime();
    await next();
    let end = (new Date()).getTime();
    console.log(`${ctx.request.method}    ${ctx.request.url}    ${end - start}ms`);
});

//设置静态目录
app.use(serve(process.cwd() + '/public'));

//router
router(app);


// app.use(async (ctx,next) => {
//     console.log('用户认证');
//     // await next();
//     ctx.response.body = '用户未认证'
// });


app.listen(3000);
console.log('app started at port 3000...');
