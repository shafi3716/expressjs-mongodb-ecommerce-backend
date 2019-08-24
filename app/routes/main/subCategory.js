const express = require('express')
const router = express.Router()
const passport = require('passport')
const SubCategoryController = require('../../controllers/main/subCategory.controller')


// ------------------------------ subCategory ------------------------------------------------------
router.get('/', passport.authenticate("jwt", { session: false }), SubCategoryController.cacheData, SubCategoryController.index);

router.post('/', passport.authenticate("jwt", { session: false }), SubCategoryController.store);

router.delete('/:id', passport.authenticate("jwt", { session: false }), SubCategoryController.destroy);

module.exports = router;