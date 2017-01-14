"use strict"

const formidable = require('formidable');
const md5 = require('md5');
const db = require("../models/db");

exports.showRegister = function (req, res, next) {
    res.render("register", {
        title: '班级说说注册'
    });
};

exports.doRegister = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let username = fields.username;
        let password = fields.password;
        db.find("users", {
            "username": username
        }, function (err, result) {
            if (err) {
                return res.send("-3"); //服务器错误
            }
            if (result.length != 0) {
                return res.send("-1");
            }
            password = md5(md5(password) + "稻草");
            db.insertOne("users", {
                "username": username,
                "password": password
            }, function (err, result) {
                if (err) {
                    return res.send("-3");
                }
                //写入session
                req.session.login = "1";
                req.session.username = username;
                res.send("1");
            });
        });
    });
};

exports.showLogin = function (req, res, next) {
    res.render("login", {
        title: '班级说说登录'
    });
};

exports.doLogin = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let username = fields.username;
        let password = fields.password;
        let passwordAfter = md5(md5(password) + "稻草");
        db.find("users", {
            "username": username
        }, function (err, result) {
            if (err) {
                return res.send("-3"); //服务器错误
            }
            if (result.length == 0) {
                return res.send("-1");  //用户名不存在
            }
            if(passwordAfter==result[0].password){
                req.session.login = "1";
                req.session.username = username;
                res.send("1");
            }else{
                return res.send("-2");  //密码错误
            }
        });
    });
};


exports.showLogout=function(req,res,next){
    req.session.login='';
    req.session.username='';
    res.redirect('back');
}