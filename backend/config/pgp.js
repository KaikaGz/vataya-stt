const promise = require("bluebird");
const mysql = require("mysql");
const config = require("./config");
const Pool = require("mysql/lib/Pool");
const Connection = require("mysql/lib/Connection");
promise.promisifyAll([Pool, Connection]);
const db = mysql.createPool(config.db);
if (process.env.NODE_ENV === "development") {
  db.on("connection", function (connection) {
    connection.on("enqueue", function (sequence) {
      // console.log("db connected");
      // if (sequence instanceof mysql.Sequence.Query) {
      if ("Query" === sequence.constructor.name) {
        console.log(sequence.sql);
      }
    });
  });
}
module.exports = db;
