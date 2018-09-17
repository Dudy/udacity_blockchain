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

const bitcoinMessage = require('bitcoinjs-message');

// 5 minutes = 300 seconds
var validationWindow = 5 * 60;

async function requestValidation(req, res) {
  if (!req.body.address) {
    console.log('Error: request contains no address in body');
    res.status(400).send({error: 'no address provided'});
    return;
  }

  let address = req.body.address;
  let requestTimestamp = new Date().getTime().toString().slice(0,-3);
  let storedTimestamp;
  
  try {
    storedTimestamp = await levelSandbox.load("star_registration_request_" + address);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      // address not found, this is the first validation message request, just go ahead
    } else {
      res.status(500).send({error: 'technical error'});
      return;
    }
  }

  let requestTimestampInt = parseInt(requestTimestamp);
  let storedTimestampInt = parseInt(storedTimestamp);
  let remainingValidationWindow = validationWindow - (requestTimestampInt - storedTimestampInt);

  if (remainingValidationWindow > 0) {
    let message = address + ":" + storedTimestamp + ":starRegistry";

    res.send({
      "address": address,
      "requestTimeStamp": storedTimestamp,
      "message": message,
      "validationWindow": remainingValidationWindow
    });

    return;
  } else {
    console.log('validation window exceeded, starting a new one');
  }
  
  let message = address + ":" + requestTimestamp + ":starRegistry";

  await levelSandbox.store("star_registration_request_" + address, requestTimestamp);

  res.send({
    "address": address,
    "requestTimeStamp": requestTimestamp,
    "message": message,
    "validationWindow": validationWindow
  });
}

async function messageSignatureValidation(req, res) {
  let requestTimestamp = new Date().getTime().toString().slice(0,-3);
  let address = req.body.address;
  let signature = req.body.signature;
  let storedTimestamp;

  try {
    storedTimestamp = await levelSandbox.load("star_registration_request_" + address);

    if (!storedTimestamp) {
      console.log('Error: address ' + address + ' has no timestamp in database (key: star_registration_request_' + address + ')');
      res.status(500).send({error: 'technical error'});
      return;
    } else {
      console.log('stored timestamp found: ' + storedTimestamp);
    }
  } catch (error) {
    if (error.name === 'NotFoundError') {
      console.log('Error: address ' + address + ' not found in database (key: star_registration_request_' + address + ')');
      res.status(400).send({error: 'You need to request for validation first, please use the path /requestValidation to request a validation message.'});
      return;
    } else {
      console.log(error);
      res.status(500).send({error: 'technical error'});
      return;
    }
  }

  let requestTimestampInt = parseInt(requestTimestamp);
  let storedTimestampInt = parseInt(storedTimestamp);
  let remainingValidationWindow = validationWindow - (requestTimestampInt - storedTimestampInt);

  if (remainingValidationWindow <= 0) {
    console.log('signature validation request was not within validation window (' + Math.abs(remainingValidationWindow) + ' seconds too late)');
    res.status(400).send({error: 'Your validation window has expired, please use the path /requestValidation again to request a new validation message.'});
    return;
  } else {
    console.log('signature validation request was within validation window (' + remainingValidationWindow + ' seconds left)');
  }

  let message = address + ":" + storedTimestamp + ":starRegistry";
  let signatureValid = false;

  try {
    signatureValid = bitcoinMessage.verify(message, address, signature);
  } catch (error) {
    console.log(error);
    signatureValid = false;
  }

  if (!signatureValid) {
    console.log('Error: invalid signature provided:');
    console.log('message : ' + message);
    console.log('address : ' + address);
    console.log('signature: ' + signature);
    res.status(400).send({error: 'The signature could not be verified.'});
    return;
  }

  res.send({
    "registerStar": true,
    "status": {
      "address": address,
      "requestTimeStamp": storedTimestamp,
      "message": message,
      "validationWindow": remainingValidationWindow,
      "messageSignature": "valid"
    }
  });
}

app.post('/requestValidation', requestValidation);

app.post('/message-signature/validate', messageSignatureValidation);

// only for testing
app.post('/test/validationWindow', function(req, res) {
  validationWindow = req.body.validationWindow;
  res.status(204).send();
});

// </project 4>

app.listen(8000, () => console.log('Example app listening on port 8000!'))
