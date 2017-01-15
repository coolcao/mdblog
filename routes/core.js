/**
 * Created by coolcao on 16/8/3.
 */
'use strict';

const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    console.log('index');
    res.render('index',{title:"coolcao的小站"});
});

module.exports = router;

