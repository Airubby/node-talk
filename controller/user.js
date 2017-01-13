"use strict"

const formidable = require('formidable');
const md5 = require('md5');
const db = require("../models/db");

exports.showRegister = function (req, res, next) {
    res.render("register");
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
                res.send("1");
            });
        });
    });
};