var express = require('express');
var router = express.Router();
const bookController = require('../controller/book')
const userController = require ('../controller/user')

router.post('/addBook',bookController.addBook);
router.get('/getBook',userController.ensureToken,bookController.getAllBooks)
module.exports = router;
