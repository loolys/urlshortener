const express = require('express');
const mongoose = require('mongoose');

// database setup
const url = process.env.MONGOLAB_URI;
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

const app = express();

app.get('/', function(req, res) {
  res.end("hello");
});

app.listen(4000);
console.log("listening on 4000");
