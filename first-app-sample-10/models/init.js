var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:32785/firstapp', {
  useMongoClient: true
});