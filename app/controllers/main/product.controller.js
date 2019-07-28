const Product = require('../../models/main/Product')
const fs = require('fs')

const index = async (req, res) => {
    
    if(req.query.id){
        await Product.findById({ _id: req.query.id })
        // .populate('categoryId')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
    else{
        await Product.find()
        // .populate('categoryId')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
}

const store = async (req , res) => {
    
    const { title, description, categoryId , subCategoryId, position } = req.body;
    
    await new Product({
        title,
        description,
        image: req.file.path,
        categoryId,
        subCategoryId,
        position,
    })
    .save()
    .then( data => {
        res.status(201).json({
            status: 'success',
            message: 'Successfully Saved.',
            data: data
        })
    })
    .catch(error => {
        res.json({
            message: 'ERROR Occured.',
            error
        })
    })

}

const destroy = async (req, res) => {

    Product.findOneAndDelete({_id: req.params.id}, (err, data) => {
        if(data){
            const path = `./${data.image}`;
            fs.unlink(path, (err) => {
                if (err) {
                  console.log(err)
                  return
                }
              
                //file removed
              })

            res.status(200).json({
                status: 'success',
                message: 'Successfully Deleted.',
                data: data._id
            })
        }
    })
}

module.exports = {
    index,
    store,
    destroy
}