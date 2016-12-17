
module.exports = function makeDbConnection(MongoClient, url){

  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
    db.close();
  });
};
