const express = require('express');
const mongoose = require('mongoose');
const validUrl = require('valid-url');

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
// let itemOne = UrlModel({
//   original_url: "http://www.google.com",
//   short_url: "http://bitsi.ze/2",
// }).save(function(err) {
//   if (err) throw err;
//   console.log("saved");
// });

const app = express();
const router = express.Router();
app.use(router);

router.get('/new/:url*', function(req, res, next) {
  let passed_url = req.params.url + req.params[0];
  if (validUrl.isUri(passed_url)){
    let data = dataB(passed_url, res);
  } else {
    console.log("Invalid url");
    UrlModel.findOne( {short_url: passed_url }, function(err, data) {
      console.log(data);
      res.redirect(data.original_url);
    });
  }
});

let dataB = function database(url, res, callback) {
  this.url = url;
  UrlModel.findOne({$or: [{original_url: url }, { short_url: url }]}, function(err, data) {
    if (err) throw err;
    if (!data){
      console.log("No item found ");
      console.log(url);
      createDbItem(url, res);
      // database(url, res, callback);
    } else {
      if (url == data.short_url) {
        res.redirect(data.original_url);
      } else {
        let jason = {
          original_url: data.original_url,
          short_url: data.short_url,
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
    short_url: "test url",
  }).save(function(err, data) {
    if (err) throw err;
    console.log("saved");
    console.log(data.id);
    let id = data.id;
    let short_id = JSON.stringify(data.id).slice(21,25);
    console.log(short_id);
    UrlModel.findByIdAndUpdate(id, { $set: { short_url: short_id }},
    { new: true }, function(err, data) {
      if (err) throw err;
      console.log("updated short_url");
      let jason = {
        original_url: data.original_url,
        short_url: data.short_url,
      };
      res.json(jason);
    });
  });
}

app.listen(4000);
console.log("listening on 4000");
