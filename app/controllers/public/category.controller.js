const Category = require('../../models/main/Category')
const {client} = require('../../../service/redis')

const index = async (req,res) => {

    await Category.find()
    .select('title description position createdAt')
    .sort({position: 'asc'})
    .then( data => {
        if(data){
            sendResponseData(res,data);
            client.setex('category',3600, JSON.stringify(data))
        }
    })

}

// send response data
const sendResponseData = (res,data) => {
    res.status(200).json(data)
}

const cacheData = async (req,res,next) => {

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
    cacheData
}