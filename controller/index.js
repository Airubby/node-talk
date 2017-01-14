"use strict"

exports.showIndex = function (req, res, next) {
    res.render('index', {
        title: '班级说说首页',
        login: req.session.login == "1" ? true : false,
        username: req.session.username
    });
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
}