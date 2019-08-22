const Category = require('../../models/main/Category')
const SubCategory = require('../../models/main/SubCategory')
// const client = require('../../../export/redis')

const redis = require('redis');

const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const index = async (req, res) => {

    if(req.query.id){
        await Category.findById({ _id: req.query.id })
        .select('title description position createdAt')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
    else{
        await Category.find()
        .select('title description position createdAt')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                sendResponseData(res,data);
                client.set('category', 3600, data)
            }
        })
    }
}


const store = async (req, res) => {

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

const destroy = async (req,res) => {

    await SubCategory.deleteMany({categoryId: req.params.id})

    await Category.findOneAndDelete({_id: req.params.id}, (err, data) => {
       if(data){
            res.status(200).json({
                status: 'success',
                message: 'Successfully Deleted.'
            })
       }
    })
}

const sendResponseData = (res,data) => {
    res.status(200).json(data)
}

const cacheData = async (req,res,next) => {

    await client.get('category', (err , data) => {
        if(data){
            sendResponseData(res,data);
            console.log('get')
        }
        else{
            console.log('not')
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