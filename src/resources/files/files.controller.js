'use strict';

var co = require('co');
var sqlite3 = require('co-sqlite3');
var uuid = require('node-uuid');
var config = require('../../config/environment');


exports.save = function*(next) {
	var idHash = uuid.v4();
	var self = this;

	yield co(function*() {
		var fileName = self.request.body.name || null;
		var fileBody = self.request.body.json;
    var db = yield sqlite3(config.dbName);

    yield createTable(db);

    var stmt = yield db.prepare('INSERT INTO files(id_hash, name, json) VALUES( ?, ?, ? )');

    yield stmt.run(idHash, fileName, fileBody);

    stmt.finalize();


		self.status = 200;
	  self.body = idHash;
	}).catch(function(err) {
	    console.log(err.stack);
			self.status = 500;
	});
};

exports.get = function*(next) {
	var self = this;

	yield co(function*() {
    var db = yield sqlite3(config.dbName);

    yield createTable(db);

    var row = yield db.get('SELECT * FROM files WHERE id_hash = ? ORDER BY ID DESC ', [
    	self.params.id
  	]);

    if(row) {
    	self.status = 200;
    	self.body = row.json;
    } else {
    	self.status = 404;
    }
	}).catch(function(err) {
			self.status = 500;
	    console.log(err.stack);
	});
};

function* createTable(db) {
	return db.run(`
		CREATE TABLE IF NOT EXISTS files (
  		id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  		id_hash CHAR(100) NOT NULL UNIQUE,
  		name CHAR(100),
  		json TEXT
  	)
  `);
};
