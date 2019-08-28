const Product = require('../../models/main/Product')
const RootPath = require('../../../root-path')
const fs = require('fs')
const {client} = require('../../../service/redis')

const index = async (req, res) => {
    
    if(req.query.id){
        await Product.findById({ _id: req.query.id })
        .select('createdAt description feature image position title price quantity')
        .populate({ path: 'categoryId', select: 'title'})
        .populate({ path: 'subCategoryId', select: 'title'})
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                res.status(200).json(data);
            }
        })
    }
    else{
        await Product.find({})
        .select('createdAt description feature image position title price quantity')
        .populate({ path: 'categoryId', select: 'title'})
        .populate({ path: 'subCategoryId', select: 'title'})
        .sort({createdAt: -1})
        .then( data => {
            if(data){
                sendResponseData(res,data);
                client.setex('product',3600, JSON.stringify(data))
            }
        })
    }
}

const store = async (req , res) => {
    
    const { title, description, categoryId , subCategoryId, price, quantity, position , feature } = req.body;
    
    await new Product({
        title,
        description,
        image: req.file.path,
        categoryId,
        subCategoryId,
        price,
        quantity,
        position,
        feature
    })
    .save()
    .then( data => {
        res.status(201).json({
            status: 'success',
            message: 'Successfully Saved.',
            data: data
        })
        client.del('product')
        cacheHelperIndex()
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
            let path = RootPath.projectRootPath + '/' + data.image;

            fs.unlink(path, (err) => {
                // if (err) {
                //     return console.log(err)
                // }
                //file removed
            })
            
            res.status(200).json({
                status: 'success',
                message: 'Successfully Deleted.'
            })

            client.del('product')
            cacheHelperIndex()  
        }
    })
}

const cacheHelperIndex = async () => {
    console.log('database')

    await Product.find({})
    .select('createdAt description feature image position title price quantity')
    .populate({ path: 'categoryId', select: 'title'})
    .populate({ path: 'subCategoryId', select: 'title'})
    .sort({createdAt: -1})
    .then( data => {
        if(data){
            client.setex('product',3600, JSON.stringify(data))
        }
    })
} 

// send response data
const sendResponseData = (res,data) => {
    res.status(200).json(data)
}

// get cache data 
const cacheData = async (req,res,next) => {

    await client.get('product', (err , data) => {
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