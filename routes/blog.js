/**
 * Created by coolcao on 16/8/3.
 */
'use strict';

var express = require('express');
var router = express.Router();

var blogCtrl = require('../controller/blogCtrl');

router.get('/',blogCtrl.list);
router.post('/',blogCtrl.post);
router.get('/tags',blogCtrl.tags)
router.get('/search',blogCtrl.search);
router.get('/:id',blogCtrl.detail);

module.exports = router;

