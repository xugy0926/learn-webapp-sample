var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    pass: String
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
