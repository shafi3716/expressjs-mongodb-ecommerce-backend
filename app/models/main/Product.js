const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productImages = new Schema({
    path: {
        type: String
    },
    extension: {
        type: String
    }
})

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'categories'
    },
    subCategoryId:{
        type: Schema.Types.ObjectId,
        ref: 'subCategories'
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    position: {
        type: Number,
    },
    feature: {
        type: Boolean,
        require: true
    },
    images: [productImages],
},
    { timestamps: true }
);

const product = mongoose.model('products', productSchema);
module.exports = product;