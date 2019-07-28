const Product = require('../../models/main/Product')

const index = async (req, res) => {
    
    if(req.query.id){
        await Product.findById({ _id: req.query.id })
        .populate('categoryId')
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
    else{
        await Product.find()
        .populate('categoryId')
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
}

const store = async (req , res) => {
    
    return res.json(req.body);

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

module.exports = {
    index,
    store
}