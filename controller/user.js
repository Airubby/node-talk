"use strict"

const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');
const gm = require('gm');
const db = require("../models/db");

exports.showRegister = function (req, res, next) {
    res.render("register", {
        "title": '班级说说-注册',
        "login": req.session.login == "1" ? true : false,
        "username": req.session.username,
        "active": 'register'
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
        "title": '班级说说-登录',
        "login": req.session.login == "1" ? true : false,
        "username": req.session.username,
        "active": "login"
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
                return res.send("-1"); //用户名不存在
            }
            if (passwordAfter == result[0].password) {
                req.session.login = "1";
                req.session.username = username;
                res.send("1");
            } else {
                return res.send("-2"); //密码错误
            }
        });
    });
};


exports.showLogout = function (req, res, next) {
    req.session.login = '';
    req.session.username = '';
    res.redirect('back');
}


exports.showSetPhoto = function (req, res, next) {
    if (req.session.login != "1") {
        return res.render("reminder", {
            "info": "这个页面必须登录了才能进入，请登录"
        })
    }
    res.render("setphoto", {
        "title": "班级说说-修改头像",
        "login": req.session.login == "1" ? true : false,
        "username": req.session.username,
        "active": "setphoto"
    })
}

exports.doSetPhoto = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../temp/");
    form.parse(req, function (err, fields, files) {

        let size = files.photoImage.size;
        if (size > (2 * 1024 * 1024)) {
            res.send("图片尺寸应该小于2M");
            //删除图片
            fs.unlink(files.photoImage.path);
            return;
        }
        let oldPath = files.photoImage.path;
        let extName = path.extname(files.photoImage.name);
        if (!['.jpg', '.png', '.gif'].includes(extName)) {
            return res.send('只接受图片');
        }
        let newPath = path.normalize(__dirname + "/../icon") + "/" + req.session.username + extName;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
            //res.send("头像上传成功");
            req.session.photo = req.session.username + extName;
            //跳转到切的业务
            res.redirect("/cutphoto");
        });

    });
};


exports.showCutPhoto = function (req, res, next) {
    if (req.session.login != "1") {
        return res.render("reminder", {
            "info": "这个页面必须登录了才能进入，请登录"
        })
    }
    res.render("cutphoto", {
        "photo": req.session.photo,
        "login": req.session.login == "1" ? true : false,
        "username": req.session.username,
        "active": "setphoto"
    });
};

exports.doCutPhoto = function (req, res, next) {
    if (req.session.login != "1") {
        return res.render("reminder", {
            "info": "这个页面必须登录了才能进入，请登录"
        })
    }

    let filename = req.session.photo;
    let w = req.query.w;
    let h = req.query.h;
    let x = req.query.x;
    let y = req.query.y;

    imageMagick("/icon/" + filename)
        .crop(w, h, x, y)
        .resize(100, 100, '!')
        .write("/icon/" + filename, function (err) {
            if (err) {
                console.log(err)
                return res.send("-1");
            }
            db.updateMany("users", {
                "username": req.session.username
            }, {
                $set: {
                    "phot": req.session.photo
                }
            }, function (err, result) {
                if (err) {
                    return;
                }
                res.send("1");
            });
        });

};

exports.showUserList = function (req, res, next) {
    db.find("users", null, function (err, result) {
        res.render("userlist", {
            "title": "班级说说-成员列表",
            "login": req.session.login == "1" ? true : false,
            "username": req.session.username,
            "active": "userlist",
            "userlist": result
        })
    });
};



exports.showUser = function (req, res, next) {
    //params 是通过冒号    app.get("/user/:user",router.showUser);
    //query 是通过问号
    let username = req.params['username'];
    db.find("message", {
        "username": username
    }, function (err, result) {
        return res.render("usertalk", {
            "title": "个人说说",
            "login": req.session.login == "1" ? true : false,
            "username": username,
            "active": "usercenter",
            "usertalk": result
        });

    });
};