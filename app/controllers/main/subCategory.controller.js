const SubCategory = require('../../models/main/SubCategory')


const index = async (req, res) => {

    if(req.query.id){
        await SubCategory.findById({ _id: req.query.id })
        .select('title description position createdAt')
        .populate('categoryId', 'title')
        .sort({createdAt: -1})
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
        await SubCategory.find({})
        .select('title description position createdAt')
        .populate('categoryId', 'title')
        .sort({createdAt: -1})
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

const store = async (req, res) => {

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
            res.status(201).json({
                status: 'success',
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

const destroy = async (req, res) => {

    await SubCategory.findOneAndDelete({_id: req.params.id}, (err, data) => {
        if(data){
            res.status(200).json({
                status: 'success',
                message: 'Successfully Deleted.'
            })
        }
    })
}

module.exports = {
    index,
    store,
    destroy
}