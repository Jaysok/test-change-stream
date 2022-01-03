# test-change-stream
mongodb change stream demo

# How to start

1. set `MONGO_URI` using `.env`
2. [MongoDB must meet the requirements below](https://www.mongodb.com/basics/change-streams)
    * The database must be in a replica set or sharded cluster.
    * The database must use the WiredTiger storage engine.
    * The replica set or sharded cluster must use replica set protocol version 1.

3. `npm start` to start the server and change stream

4. Use the `/push` API for inserting a document to the database.
     * You can add more fields by adding query parameters onto the API
    * If you add a query parameter with `?a=1`, then resulting document would be `{ a: 1, ... }`. If you add query parameters with `?a=1&b=2`, then `{ a: 1, b: 2 }`, and so on.

5. Watch what happens after the document inserted. 
    * Currently, change stream logs the document only when the `matchPipeline is matched.
        * `let matchPipeline = { operationType: "insert", 'fullDocument.message': { $exists: true } }`
