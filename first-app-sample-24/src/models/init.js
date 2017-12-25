import mongoose from 'mongoose';
import config from '../config';

mongoose.connect(config.mongodbUrl, {
  useMongoClient: true
});
