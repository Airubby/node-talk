"use strict"

exports.showIndex = function (req, res, next) {
    res.render('index', {
        title: '班级说说首页',
        login: req.session.login == "1" ? true : false,
        username: req.session.username
    });
};