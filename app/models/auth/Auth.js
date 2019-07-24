const mongoose = require('mongoose');
const validate = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        // validate: {
        //     validator: (v) => {
        //         return valid.isEmail(v)
        //     },
        //     message: `{v} is not an email`
        // }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6
    }
},
    { timestamps: true }

);

const user = mongoose.model('users', userSchema);
module.exports = user;