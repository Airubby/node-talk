"use strict"

const db = require("../models/db");
const formidable = require("formidable");

exports.showIndex = function (req, res, next) {
    if (req.session.login == "1") {
        db.find("users", {
            username: req.session.username
        }, function (err, result) {
            let photo = result[0].photo || "moren.jpg";
            res.render("index", {
                "login": req.session.login == "1" ? true : false,
                "username": req.session.login == "1" ? req.session.username : "",
                "active": "首页",
                "photo": photo
            });
        });
    } else {
        res.render('index', {
            "title": '班级说说首页',
            "login": req.session.login == "1" ? true : false,
            "username": req.session.username,
            "active": 'index',
            "photo": "moren.jpg"
        });
    }

};


exports.doPublish = function (req, res, next) {
    if (req.session.login != "1") {
        return res.send("非法登录");
    }
    let username = req.session.username;
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        let content = fields.content;
        db.insertOne("message", {
            "username": username,
            "datetime": new Date(),
            "content": content
        }, function (err, result) {
            if (err) {
                return res.send("-3"); //服务器错误
            }
            res.send("1");
        });
    });
};


exports.getPageTalk = function (req, res, next) {
    //这个页面接受一个参数
    //http://127.0.0.1:3000/getalltalk?page=0
    let page = req.query.page;
    db.find("message", null, {
        "pageNum": 12,
        "page": page,
        "sort": {
            "datetime": -1
        }
    }, function (err, result) {
        res.json(result);
    });

};

exports.getAllCount = function (req, res, next) {
    db.getAllCount("message", function (result) {
        res.json(result);
    });
}

exports.getUserTalk = function (req, res, next) {
    let page = req.query.page;
    let username = req.query.username;
    db.find("message", {
        "username": username
    }, {
        "pageNum": 12,
        "page": page,
        "sort": {
            "datetime": -1
        }
    }, function (err, result) {
        res.json(result);
    });
}