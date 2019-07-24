var router = require('express').Router();

// authentication
router.use('/api', require('./auth/auth'));

// category
router.use('/api', require('./main/category'));

// product
router.use('/api', require('./main/product'));

module.exports = router;