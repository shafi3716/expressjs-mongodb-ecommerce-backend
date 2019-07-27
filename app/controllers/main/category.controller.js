const Category = require('../../models/main/Category')
const SubCategory = require('../../models/main/SubCategory')

const indexCategory = async (req, res) => {

    if(req.query.id){
        await Category.findById({ _id: req.query.id })
        .select('title description position subCategoryId')
        .populate('subCategoryId')
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
    else{
        await Category.find()
        .select('title description position subCategoryId')
        .populate('subCategoryId')
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
}


const storeCategory = async (req, res) => {

    const {title,description,position} = req.body

    await new Category({
        title: title,
        description: description,
        position: position
    })
    .save()
    .then( data => {
        res.status(201).json({
            status: 'success',
            message: 'Successfully Saved.',
            data: data,
        })
    })
    .catch(error => {
        res.json({
            message: 'ERROR Occured.',
            error
        })
    })
}

const deleteCatgeory = async (req,res) => {

    res.status(200).json(req.params.id)
}

// subcategory

const indexSubCategory = async (req, res) => {

    if(req.query.id){
        await SubCategory.findById({ _id: req.query.id })
        .select('title description position')
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
        .catch(error => {
            res.json({
                message: 'ERROR Occured.',
                error
                })
            })
    }
    else{
        await SubCategory.find()
        .select('title description position')
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
        .catch(error => {
            res.json({
                message: 'ERROR Occured.',
                error
                })
            })
    }
  
}

const storeSubCategory = async (req, res) => {

    const { title , description, position, categoryId } = req.body

    await new SubCategory({
     title: title,
     description: description,
     position: position,
     categoryId: categoryId
    })
    .save()
    .then( data => {
         if(data){
            res.status(200).json({
                message: 'Successfully Saved.',
                data: data,
            })
         }    
    })
    .catch(error => {
     res.json({
         message: 'ERROR Occured.',
         error
         })
     })
}

module.exports = {
    indexCategory,
    storeCategory,
    deleteCatgeory,
    indexSubCategory,
    storeSubCategory
}