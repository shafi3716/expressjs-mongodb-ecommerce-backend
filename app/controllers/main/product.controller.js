const Product = require('../../models/main/Product')
const RootPath = require('../../../root-path')
const fs = require('fs')
const {client} = require('../../../service/redis')

const index = async (req, res) => {

    await Product.find()
    .select('createdAt description feature position title price quantity images')
    .populate({ path: 'categoryId', select: 'title'})
    .populate({ path: 'subCategoryId', select: 'title'})
    .populate({ path: 'images', options: { limit: 1 } })
    .sort({createdAt: -1})
    .then( data => {
        if(data){
            sendResponseData(res,data)
            // client.setex('product',3600, JSON.stringify(data))
        }
    })
}

const store = async (req , res) => {

    const { title, description, categoryId , subCategoryId, price, quantity, position , feature } = req.body;
    
    let product = new Product({ title, description, categoryId, subCategoryId, price,quantity, position, feature })

    for (let i=0; i < req.files.length; i++){
        product.images.push({path: req.files[i].path, extension: req.files[i].mimetype})
    }

    await product
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