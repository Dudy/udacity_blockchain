"use strict";

const express = require('express')
const app = express()
const Blockchain = require('./simpleChain.js').Blockchain;
const Block = require('./simpleChain.js').Block;
const levelSandbox = require('./levelSandbox.js');

app.use(express.json());

let blockchain = new Blockchain();

async function getBlockFromBlockchainByHeight(blockheight) {
  return await blockchain.getBlock(blockheight);
}

async function getBlock(req, res) {
  let blockheight = req.params['blockheight'];
  let block = await getBlockFromBlockchainByHeight(blockheight);
  if (block) {
    res.send(block);
  } else {
    res.status(404).send({error: 'block ' + blockheight + ' not found'});
  }
}

async function postBlock(req, res) {
  let newBlock = await blockchain.addBlock(new Block(req.body.body));
  res.send(newBlock);
}

app.get('/block/:blockheight', getBlock);
app.post('/block', postBlock);

// <project 4>

const SHA256 = require('crypto-js/sha256');

// 10 minutes = 600 seconds = 600000 millisecons
const registration_time_duration = 10 * 60 * 1000;

async function registrationRequest(req, res) {
  let message = SHA256((Math.random() * (1 << 64)).toString()).toString();
  let blockchainid = req.body.blockchainid;
  let timestamp = new Date().getTime();

  await levelSandbox.store("star_registration_request_" + blockchainid, timestamp);

  res.send({
    "message": message,
    "timestamp": timestamp,
    "timeRemainingInMs": registration_time_duration - new Date().getTime() + timestamp
  });
}

app.post('/star/registration', registrationRequest);

// </project 4>

app.listen(8000, () => console.log('Example app listening on port 8000!'))
