var gulp = require('gulp'),
    cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    requireDir = require('require-dir');

var tasks = requireDir('./tasks');

gulp.task('default', ['build', 'clean'], function () {
    
});
