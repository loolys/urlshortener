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
    //res.writeHead(200, { 'Content-Type': 'application/json' });
    let data = dataB(passed_url, res);
    console.log(data);
  } else {
    console.log("Invalid url");
  }
});

let dataB = function database(url, res, callback) {
  UrlModel.findOne({ original_url: url }, function(err, data) {
    if (err) throw err;
    if (!data){
      console.log("No item found");
      // let newId = JSON.stringify(data["_id"]).slice(21,25)
    } else {
      let jason = {
        original_url: data.original_url,
        short_url: data.short_url,
      };
      res.json(jason);
    }
  });
}

app.listen(4000);
console.log("listening on 4000");
