This is the Udacity Blockchain Nanodegree project of Dirk Podolak.

# Project 3

Now I added a RESTful API using the express.js framework. The starting point of
the application is the index.js file, so you may start by running

```node index.js```

in a console.

After pulling this code from the git repository, you need to download all
necessary dependencies. npm does this by issuing this command in the git
project directory.

```npm install```

The implemented endpoints are
- GET
- POST

--------------------------------------------------------------------------------

# Get Block by height

Get one specific block from the blockchain that is denoted by the given
blockheight.

**URL** : `/block/:blockheight/`

**Method**: `GET`

## Query Parameters
None

## Path Parameters
:blockheight the height of the block that is requested

## Body
None

## Example
### Request

    http://localhost:8000/block/12

### Response
``` json
{
  "hash": "3c033eb3c7638ab76e5c18ceabea72b2e70120fbe1f6908d4492d3ed8802563a",
  "height": 8,
  "body": "test data 5",
  "time": "1534293440",
  "previousBlockHash": "621b90642c842833d676d22fd53a14b275906a18944979cdceacf49e8e59b96b"
}
```

--------------------------------------------------------------------------------

# Post new Block

Post the content of a new block as a "body" item in a JSON structure like
``` json
{
  "body":"block body contents"
}
```

This will be added to the blockchain as a new block. The new block will be
returned as if it was requested by the above mentioned GET method.

**URL** : `/block`

**Method**: `POST`

## Query Parameters
None

## Path Parameters
None

## Body
A JSON structure that contains a single "body" attribute that will be used
as the new block's data, see the following example.

## Example
### Request

    curl -X "POST" "http://localhost:8000/block"\
         -H 'Content-Type: application/json'\
         -d $'{"body":"block body contents"}'

### Response
``` json
{
  "hash": "0286c7f91ed2ed52f44cc9e62344939437c148fbcd13ea6fd080d942b2c17a39",
  "height": 15,
  "body": "block body contents",
  "time": "1535053866",
  "previousBlockHash": "b47e5b0a318c1d735aba8fb1117de5c8a4d793f78ef41772d7405c439a30f414"
}
```

--------------------------------------------------------------------------------
