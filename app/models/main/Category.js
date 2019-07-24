const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    position: {
        type: Number,
        default: 0
    } 
},
    { timestamps: true }

);

const category = mongoose.model('categories', categorySchema);
module.exports = category;