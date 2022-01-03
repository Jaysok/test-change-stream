# test-change-stream
mongodb change stream demo

# How to start

1. set `MONGO_URI` using `.env`
2. [MongoDB must meet the requirements below](https://www.mongodb.com/basics/change-streams)
  * The database must be in a replica set or sharded cluster.
  * The database must use the WiredTiger storage engine.
  * The replica set or sharded cluster must use replica set protocol version 1.
  
3. There is only one API, `/push` for inserting a document to the database. 
