"use strict"

const express = require('express');
const indexController = require('./controller/index');
const userController = require('./controller/user');

const router = express.Router();

router.get("/", indexController.showIndex);
router.get("/register", userController.showRegister);
router.post("/register", userController.doRegister);
router.get("/login",userController.showLogin);
router.post("/login",userController.doLogin);
router.get("/logout",userController.showLogout);
router.get("/setphoto",userController.showSetPhoto);
router.post("/setphoto",userController.doSetPhoto);
router.get("/cutphoto",userController.showCutPhoto);
router.get("/docutphoto",userController.doCutPhoto);
router.post("/publish",indexController.doPublish);
router.get("/getalltalk",indexController.getAllTalk);
router.get("/getallcount",indexController.getAllCount);
router.get("/userlist",userController.showUserList);
router.get("/user/:username",userController.showUser);


module.exports = router;