'use strict';

var controller = require('./files.controller');
var router = require('koa-router')();
var body = require('koa-body')();


router.post('/', body, controller.save);
router.get('/:id', controller.get);

module.exports = router.routes();
