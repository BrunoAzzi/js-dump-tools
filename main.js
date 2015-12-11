var gulp = global.gulp  = require('gulp');
require('./gulpfile.js');

gulp.start('build');

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000);
