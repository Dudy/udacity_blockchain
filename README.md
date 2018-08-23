This is the Udacity Blockchain Nanodegree project of Dirk Podolak.

# Project 1

In the first project I got familiar with the Bitcoin blockchain, installing
everything that is needed locally and getting used to the CLI. I then used the
CLI to create a new block and submit it to the testnet (it's block ID is
04a5352a7604bbe3b9298ecd51d5c0daf4010e867dd3203e5cd0dc7c890ab5e3).

# Project 2

Here I created a private blockchain that is persistant using a leveldb.

# Project 3

Now I added a RESTful API using the express.js framework. The starting point of
the application is the index.js file, so you may start by running

```node index.js```

in a console.

The implemented endpoints are
- GET
- POST

--------------------------------------------------------------------------------

# Get Block by height

Get one specific block from the blockchain that is denoted by the given
blockheight.

**URL** : `/block/:blockheight/`
**Method**: `GET`

## Parameters
None

## Example
### Request

    https://localhost:8000/block/12

### Response
``` json
{
  "hash":"534673b5b0be71b3a4b64e0bc346608547556543623dbba3071f625d8d7afe9e",
  "height":12,
  "body":"block body contents",
  "time":"1535053567",
  "previousBlockHash":"ppp"
}
```

--------------------------------------------------------------------------------
