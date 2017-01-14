"use strict"

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

function _connectDB(callback) {
    const url = config.dburl;
    MongoClient.connect(url, function (err, db) {

        if (err) {
            return callback(err, null);
        }
        callback(null, db);
        db.close();
    });
}



exports.find = function (collectionName, json, C, D) {
    let thisJson = json == null ? {} : json;
    let result = [];
    if (arguments.length == 3) {
        var callback = C;
        var limitNum = 0;
        var skipNum = 0;
    } else if (arguments.length == 4) {
        var callback = D;
        var args = C;
        var limitNum = args.pageNum;
        var skipNum = args.pageNum * args.page;
        var sort = args.sort || {};
    } else {
        throw new Error("参数为3个或4个");
        return;
    }
    _connectDB(function (err, db) {

        let cursor = db.collection(collectionName).find(thisJson).limit(limitNum).skip(skipNum).sort(sort);
        cursor.each(function (err, doc) {

            if (err) {
                callback(err, null);
                db.close(); //关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc); //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                db.close(); //关闭数据库
            }


        });

    });
};


exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        });
    });
};


exports.updateMany = function (collectionName, json1,json2, callback) {
    _connectDB(function(err,db){
        db.collection(collectionName).updateMany(json1,json2,function(err,result){
            callback(err,result);
            db.close();
        });
    });
};



