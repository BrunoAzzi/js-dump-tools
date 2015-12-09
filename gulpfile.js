var gulp = require('gulp'),
    cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    requireDir = require('require-dir');

var tasks = requireDir('./tasks');

gulp.task('watch', function () {
  var watcher = gulp.watch(scriptsGlob, ['scripts']); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.scripts[event.path];       // gulp-cached remove api
      remember.forget('scripts', event.path);         // gulp-remember remove api
    }
  });
});
