/**
 * Koa config
 */

'use strict';

var config = require('./environment');
var morgan = require('koa-morgan');
var cors = require('koa-cors');


module.exports = function(app) {

  // Logger
  app.use(morgan.middleware(config.logType));
	app.use(cors());
};
