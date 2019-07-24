const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({

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
    },
    categoryId:[{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }]
},
    { timestamps: true }

);

const subCategory = mongoose.model('subCategories', subCategorySchema);
module.exports = subCategory;