const router = require('express').Router();
const req = require('../database/logo')

const multer = require('multer');

const storage = multer.memoryStorage(); // Stocke l'image en mémoire

const upload = multer({ storage: storage });

//LogIn logUp sign
router.post('/upload',upload.single('image'),req.upload)
router.post('/get',req.get)
// ---- //

module.exports = router;