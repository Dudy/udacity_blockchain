const express = require('express')
const app = express()
const Blockchain = require('./simpleChain.js').Blockchain;
const Block = require('./simpleChain.js').Block;

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

app.listen(8000, () => console.log('Example app listening on port 8000!'))
