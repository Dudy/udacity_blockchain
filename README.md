This is the Udacity Blockchain Nanodegree project of Dirk Podolak.

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

## Parameters
body

## Example
### Request

    curl -X "POST" "http://localhost:8000/block"\
         -H 'Content-Type: application/json'\
         -d $'{"body":"block body contents"}'

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
