var mongoose = require('mongoose'); var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    rol: String,
    name: String,
    surname: String,
    address: String,
    bio: String,
    created: Date,
}, { timestamps: true });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);