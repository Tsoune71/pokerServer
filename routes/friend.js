const router = require('express').Router();
const req = require('../database/friend')

//LogIn logUp sign
router.post('/search',req.search)
router.post('/delete',req.delete)
router.post('/add',req.add)
router.post('/accept',req.accept)
router.post('/get',req.get)
// ---- //

module.exports = router;