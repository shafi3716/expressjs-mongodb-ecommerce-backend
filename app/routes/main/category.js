const express = require('express')
const router = express.Router()
const passport = require('passport')
const CategoryController = require('../../controllers/main/category.controller')

//------------------------------- category --------------------------------------------------------
// get
router.get('/category', passport.authenticate("jwt", { session: false }),CategoryController.cacheData, CategoryController.index);
// store
router.post('/category', passport.authenticate("jwt", { session: false }), CategoryController.store);
// delete
router.delete('/category/:id',passport.authenticate("jwt", { session: false }), CategoryController.destroy);

module.exports = router;