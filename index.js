require('dotenv').config();
const { MongoClient } = require("mongodb");
const http = require('http');
const { URL } = require('url');

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let db;
let collection;
let changeStream;

async function run() {
  try {
    await initServer();
    await initMongo();
    await initChangeStream(db);
  } finally {
    // await client.close();
  }
}

run().catch(console.error);

function initServer() {
  const server = http.createServer();

  server.on('request', async (req, res) => {
    if (req.url.indexOf('push') >= 0) {
      const url = new URL('http://localhost:8000' + req.url);
      const searchParams = url.searchParams;      
      const item = await insertItem(searchParams);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.write(JSON.stringify(item, null, 4));
      return res.end();
    }
    
    res.statusCode = 200;
    res.write("hi");
    return res.end();
  });

  server.listen(8000);
}

async function initMongo() {  
  await client.connect();
  db = await client.db("test");
  collection = await db.collection('stream_test');
  console.log("Connected successfully to server");
}

async function initChangeStream() {  
  const watchPipline = [
    {
      $match: {
        operationType: "insert",
        "fullDocument.message": { $exists: true },
      },
    },
  ];
  const watchOptions = {
    fullDocument: "updateLookup",
  };
  
  changeStream = collection.watch(watchPipline, watchOptions);
  
  changeStream.on('change', next => {
    console.log(JSON.stringify(next, null, 4));
  });
  changeStream.on('error', console.error);
}

function randomString(len) {
  let charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890';
  let csLen = charSet.length;
  return [...Array(len)].map(_ => charSet[Math.floor(Math.random()*csLen)]).join('');
}

async function insertItem(paramMap) {
  const item = { message: randomString(10), createAt: new Date() };
  for (let key of paramMap.keys()) {
    console.log(key);
    let value = paramMap.get(key);
    item[key] = value;
  }
  let {insertedId} = await collection.insertOne(item);
  return await collection.findOne({_id: insertedId});
}