var router = require('express').Router();

// authentication
router.use('/api', require('./auth/auth'));

// category
router.use('/api', require('./main/category'));

//subCategory
router.use('/api/subcategory', require('./main/subCategory'));

// product
router.use('/api/product', require('./main/product'));

module.exports = router;