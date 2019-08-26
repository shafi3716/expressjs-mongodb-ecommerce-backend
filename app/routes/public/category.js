const express = require('express')
const router = express.Router()
const CategoryController = require('../../controllers/public/category.controller')

//------------------------------- category --------------------------------------------------------
// get
router.get('/category',CategoryController.cacheData, CategoryController.index);

module.exports = router;