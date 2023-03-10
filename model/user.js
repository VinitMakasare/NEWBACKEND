const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new  mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    verified:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model('User', userSchema);

