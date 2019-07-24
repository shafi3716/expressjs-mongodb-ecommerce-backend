const express = require('express')
const router = express.Router()
const passport = require('passport')
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads/products')
    },
    filename: function( req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage })

// controller 
const ProductController = require('../../controllers/main/product.controller')

// products 
router.get('/product', passport.authenticate("jwt", { session: false }), ProductController.index);
router.post('/product', upload.single('image'), passport.authenticate("jwt", { session: false }) , ProductController.store);

module.exports = router;