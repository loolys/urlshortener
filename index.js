const express = require('express');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
const path = require('path');

// database setup
const url = process.env.MONGOLAB_URI;
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

// Schema
const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String,
});

const UrlModel = mongoose.model('Url', urlSchema);

const app = express();
const router = express.Router();
app.use(router);

app.get('/', function(req, res) {
  // homepage
  res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/new/:url*', function(req, res, next) {
  let passed_url = req.params.url + req.params[0];
  if (validUrl.isUri(passed_url)){
    let data = dataB(passed_url, res);
  } else {
    // if not valid url, check if short_url in db and redirect, else error
    UrlModel.findOne( {short_url: passed_url }, function(err, data) {
      if(data === null){
        jason = { invalid_url: "Not a valid url" }
        res.json(jason);
      } else {
        res.redirect(data.original_url);
      }
    });
  }
});

let dataB = function database(url, res, callback) {
  this.url = url;
  UrlModel.findOne({$or: [{original_url: url }, { short_url: url }]}, function(err, data) {
    if (err) throw err;
    if (!data){
      createDbItem(url, res);
    } else {
      if (url == data.short_url) {
        res.redirect(data.original_url);
      } else {
        let jason = {
          original_url: data.original_url,
          short_url: "http://127.0.0.1:4000/new/" + data.short_url,
        };
        res.json(jason);
      }
    }
  });
}

function createDbItem(url, res) {
  this.url = url;
  this.res = res;
  let item = UrlModel({
    original_url: url,
    short_url: "test url", // placeholder value
  }).save(function(err, data) {
    if (err) throw err;
    let id = data.id;
    let short_id = JSON.stringify(data.id).slice(21,25); // generate unique id with mongoId
    UrlModel.findByIdAndUpdate(id, { $set: { short_url: short_id }},
    { new: true }, function(err, data) {
      if (err) throw err;
      let jason = {
        original_url: data.original_url,
        short_url: "http://127.0.0.1:4000/new/" + data.short_url,
      };
      res.json(jason);
    });
  });
}

app.listen(4000);
console.log("listening on 4000");
