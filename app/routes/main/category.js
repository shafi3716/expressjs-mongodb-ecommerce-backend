const express = require('express')
const router = express.Router()
const passport = require('passport')
const CategoryController = require('../../controllers/main/category.controller')

//------------------------------- category --------------------------------------------------------
// get
router.get('/', passport.authenticate("jwt", { session: false }),CategoryController.cacheData, CategoryController.index);
// store
router.post('/', passport.authenticate("jwt", { session: false }), CategoryController.store);
// delete
router.delete('/:id',passport.authenticate("jwt", { session: false }), CategoryController.destroy);

module.exports = router;