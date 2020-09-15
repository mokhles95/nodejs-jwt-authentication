var express = require('express');
var router = express.Router();
const userController = require('../controller/user')

router.post('/addUser', userController.addUser);
router.get('/login',userController.login)
module.exports = router;
