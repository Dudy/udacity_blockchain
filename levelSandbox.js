"use strict";

/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

function store(key, value) {
  db.put(key, value);
}

function load(key) {
  return db.get(key);
}

function getBlockHeight() {
  return new Promise(resolve => {
    let i = 0;
    db.createReadStream()
      .on('data', function(data) {
          i++;
        }).on('error', function(err) {
          resolve(0);
        }).on('close', function() {
          resolve(i);
        });
  });
}

function print() {
    db.createReadStream()
      .on('data', function(data) {
        console.log(JSON.parse(data.value));
      });
}

module.exports = {
  load: load,
  store: store,
  getBlockHeight: getBlockHeight,
  print: print
}
