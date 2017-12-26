import mongoose from 'mongoose';
import config from '../config';

const db = mongoose.connect(config.mongodbUrl, {
  useMongoClient: true
});

db.on('error', function(err) {
  console.log(err);
});

db.once('open', function() {
  console.log('mongodb connect successed!')
});
