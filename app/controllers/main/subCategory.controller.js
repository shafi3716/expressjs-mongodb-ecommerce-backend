const SubCategory = require('../../models/main/SubCategory')
const {client} = require('../../../service/redis')

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
                sendResponseData(res,data);
                client.setex('subcategory',3600, JSON.stringify(data))
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
            client.del('subcategory')
            cacheHelperIndex()
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
        res.status(200).json({
            status: 'success',
            message: 'Successfully Deleted.'
        })
        client.del('subcategory')
        cacheHelperIndex()
    })
}

const cacheHelperIndex = async () => {
    console.log('database')

    await SubCategory.find({})
        .select('title description position createdAt')
        .populate('categoryId', 'title')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                client.setex('subcategory',3600, JSON.stringify(data))
            }
        })
        .catch(error => {
            res.json({
                message: 'ERROR Occured.',
                error
                })
            })

} 

// send response data
const sendResponseData = (res,data) => {
    res.status(200).json(data)
}

// get cache data 
const cacheData = async (req,res,next) => {

    await client.get('subcategory', (err , data) => {
        if(data){
            console.log('redis')
            sendResponseData(res,JSON.parse(data));
        }
        else{
            console.log('database')
            next();
        }
    })  
}

module.exports = {
    index,
    store,
    destroy,
    cacheData
}