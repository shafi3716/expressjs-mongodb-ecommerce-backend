const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'categories'
        }
},
    { timestamps: true }
);

const product = mongoose.model('products', productSchema);
module.exports = product;