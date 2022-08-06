const mongoose = require('mongoose');

//Par sécurité
const uniqueValidator = require('mongoose-unique-validator');

//Schema des données utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true},
    password: { type: String, required: true },
    isadmin: { type : Boolean ,  default : false ,  required : true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);