"use strict"

exports.showIndex = function (req, res, next) {
    res.render('index', {
        title: '班级说说首页'
    });
};