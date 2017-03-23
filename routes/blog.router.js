'use strict';

const Router = require('koa-router');
const KoaBody = require('koa-body');
const koaBody = new KoaBody({
    multipart: true
});
const router = new Router({
    prefix: '/blogs'
});

const blogCtrl = require('../controller/blog.controller.js');

router.get('/', koaBody,blogCtrl.list);
router.post('/',koaBody,blogCtrl.post);
router.get('/tags',blogCtrl.tags)
router.get('/catalogs',blogCtrl.catalogs);
router.get('/search',blogCtrl.search);
router.get('/:path',blogCtrl.detailPath);

module.exports = router;

