/**
 * Created by coolcao on 16/8/3.
 */
'use strict';

const express = require('express');
const router = express.Router();

const blogCtrl = require('../controller/blogCtrl');

router.get('/',blogCtrl.list);
router.post('/',blogCtrl.post);
router.get('/tags',blogCtrl.tags)
router.get('/search',blogCtrl.search);
router.get('/:path',blogCtrl.detailPath);

module.exports = router;

