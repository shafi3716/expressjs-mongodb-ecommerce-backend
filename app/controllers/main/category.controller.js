const Category = require('../../models/main/Category')
const SubCategory = require('../../models/main/SubCategory')
const {client} = require('../../../service/redis')

const index = async (req, res) => {

    if(req.query.id){
        await Category.findById({ _id: req.query.id })
        .select('title description position createdAt')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                res.status(200).json(data)
            }
        })
    }
    else{
        await Category.find()
        .select('title description position createdAt')
        .sort({createdAt: -1})
        .limit(10)
        .then( data => {
            if(data){
                sendResponseData(res,data);
                client.setex('category',3600, JSON.stringify(data))
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
        client.del('category')
        helperDataQuery()
    })
    .catch(error => {
        res.json({
            message: 'ERROR Occured.',
            error
        })
    })
}

const destroy = async (req,res) => {

    await Category.findOneAndDelete({_id: req.params.id}, (err, data) => {
        if(data){
            res.status(200).json({
                status: 'success',
                message: 'Successfully Deleted.'
            })
            client.del('category')
            helperDataQuery()
        }
    })
    await SubCategory.deleteMany({categoryId: req.params.id})
}

const helperDataQuery = async (skip,limit,res) => {
    console.log('database')

    if (skip && limit){
        await Category.find()
        .select('title description position createdAt')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .then( data => {
            if(data){
                sendResponseData(res,data);
                client.setex('category',3600, JSON.stringify(data))
            }
        })
    }
    else{
        await Category.find()
        .select('title description position createdAt')
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                client.setex('category',3600, JSON.stringify(data))
            }
        })
    }
} 

// send response data
const sendResponseData = (res,data) => {
    res.status(200).json(data)
}

// get cache data 
const cacheData = async (req,res,next) => {

    if (req.query.skip && req.query.limit){
        helperDataQuery(parseInt(req.query.skip),parseInt(req.query.limit),res)
    }

    await client.get('category', (err , data) => {
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