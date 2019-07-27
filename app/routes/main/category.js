const express = require('express')
const router = express.Router()
const passport = require('passport')
const CategoryController = require('../../controllers/main/category.controller')

//------------------------------- category --------------------------------------------------------
// get
router.get('/category', passport.authenticate("jwt", { session: false }), CategoryController.indexCategory);
// store
router.post('/category', passport.authenticate("jwt", { session: false }), CategoryController.storeCategory);
// delete
router.delete('/category/:id',passport.authenticate("jwt", { session: false }), CategoryController.deleteCatgeory);


// ------------------------------ subCategory ------------------------------------------------------
router.get('/subcategory', passport.authenticate("jwt", { session: false }), CategoryController.indexSubCategory);

router.post('/subcategory', passport.authenticate("jwt", { session: false }), CategoryController.storeSubCategory);

module.exports = router;