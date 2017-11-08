var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:32768/firstapp', {
  useMongoClient: true
});