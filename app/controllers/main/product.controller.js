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
    
    const { title, description, categoryId } = req.body;
    
    await new Product({
        title: title,
        description: description,
        image: req.file.path,
        categoryId: categoryId
    })
    .save()
    .then( data => {
        res.status(201).json({
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