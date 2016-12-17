const mongodb = require('mongodb');
const express = require('express');
const dbconnect = require('./dbconnect');
// database setup
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGOLAB_URI;
//dbconnect(MongoClient, url);

const app = express();

app.get('/', function(req, res) {
  res.end("hello");
});

app.listen(4000);
