const router = require('express').Router();
const req = require('../database/sign')

//LogIn logUp sign
router.post('/verifEmail',req.verifEmail)
router.post('/signUp',req.signUp)
router.post('/signIn',req.signIn)
router.post('/user',req.user)

// ---- //

module.exports = router;