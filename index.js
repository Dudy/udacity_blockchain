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
  res.send(await getBlockFromBlockchainByHeightreq.params['blockheight']);
}

async function postBlock(req, res) {
  let newHeight = await blockchain.asyncAddBlock(new Block(req.body.body));
  res.send(await getBlockFromBlockchainByHeight(newHeight));
}

app.get('/block/:blockheight', getBlock);
app.post('/block', postBlock);

app.listen(8000, () => console.log('Example app listening on port 8000!'))
