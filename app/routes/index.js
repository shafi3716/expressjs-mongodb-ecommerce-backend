var router = require('express').Router()

// ------------------------- administrator router ---------------------------------

// authentication
router.use('/api/auth', require('./auth/auth'))

// category
router.use('/api/category', require('./main/category'))

//subCategory
router.use('/api/subcategory', require('./main/subCategory'))

// product
router.use('/api/product', require('./main/product'))

// ------------------------- public router ---------------------------------

// category
router.use('/api/public/', require('./public/category'))

module.exports = router;