"use strict"

const express = require('express');
const indexController = require('./controller/index');
const userController = require('./controller/user');

const router = express.Router();

router.get("/", indexController.showIndex);
router.get("/register", userController.showRegister);
router.post("/register", userController.doRegister);


module.exports = router;