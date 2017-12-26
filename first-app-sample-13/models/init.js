var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://127.0.0.1:27017/firstapp', {
  useMongoClient: true
});

db.on('error', function(err) {
  console.log(err);
});

db.once('open', function() {
  console.log('mongodb connect successed!')
});