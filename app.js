"use strict"

const express = require('express');
const path = require('path');
const router = require('./router');


const app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'xtpl');

app.use('/public', express.static('public'));

app.use(router);

app.listen(4000, '127.0.0.1', function () {
    console.log('listening 4000');
});