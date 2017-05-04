
import * as Router from 'koa-router';
import * as KoaBody from 'koa-body';
import blogCtrl from '../controller/blog.controller';

const koaBody: KoaBody = new KoaBody({
    multipart: true
});
const router: Router = new Router({
    prefix: '/blogs'
});

router.get('/', koaBody,blogCtrl.list);
router.post('/',koaBody,blogCtrl.post);
router.get('/tags',blogCtrl.tags)
router.get('/catalogs',blogCtrl.catalogs);
router.get('/search',blogCtrl.search);
router.get('/:path',blogCtrl.detailPath);

export default router;

