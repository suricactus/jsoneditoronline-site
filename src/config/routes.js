/**
 * Main application routes
 */

'use strict';

var mount = require('koa-mount');
var serve = require('koa-static');

module.exports = function(app) {

	// YEOMAN INJECT ROUTES BELOW
	app.use(mount('/api/files', require('../resources/files')));
  app.use(serve('static'));


};
