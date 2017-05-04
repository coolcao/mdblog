import * as Koa from 'koa';
import blogRouter from './blog.router';

export default function (app: Koa) {
    app.use(blogRouter.routes());
};
