const express = require('express')
const router = express.Router()
const passport = require('passport')
const CategoryController = require('../../controllers/main/category.controller')

// category
router.get('/category', passport.authenticate("jwt", { session: false }), CategoryController.indexCategory);

router.post('/category', passport.authenticate("jwt", { session: false }), CategoryController.storeCategory);

// sub category
router.get('/subcategory', passport.authenticate("jwt", { session: false }), CategoryController.indexSubCategory);

router.post('/subcategory', passport.authenticate("jwt", { session: false }), CategoryController.storeSubCategory);

module.exports = router;