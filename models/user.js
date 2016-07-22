// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var findOrCreate = require('mongoose-findorcreate');

var roles = 'aplicante ejecutivo subgerente gerente todos'.split();

// define the schema for our user model
var userSchema = mongoose.Schema({
    local : {
        name         : {
            type: String,
            required: true,
            trim: true
        },
        surname      : {
            type: String,
            required: true,
            trim: true
        },
        username     : {
            type: String,
            required: true,
            trim: true
        },
        email        : {
            type: String,
            required: true,
            trim: true
        },
        password     : String,
        created      : {
            type: Date,
            default: Date.now
        },
        updated      : {
            type: Date,
            default: Date.now
        },
        role         : {
            type:String,
            enum: roles,
            required: true,
            default: roles[0]
        }
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
