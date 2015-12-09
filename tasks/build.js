var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),

    del = require('del');

    gulp.task('build', ['templates', 'lib', 'special-libs', 'styles', 'images', 'workers', 'scripts', 'fonts', 'clean'], function() {
        return gulp.src(['app/index.html'])
            .pipe(gulp.dest('dist'));
    });

    gulp.task('styles', ['clean'], function() {
        var bowerConfig = {
                overrides: {
                    "bootstrap": { main: ['./dist/css/bootstrap.min.css'] }
                }
            }
        var filterJS = plugins.filter(['**/*.min.css','*.min.css'], { restore: true });

        return gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(filterJS)
            .pipe(plugins.addSrc('app/css/*.css'))
    		.pipe(plugins.concat('main.css'))
    		.pipe(plugins.uglifycss())
    		.pipe(gulp.dest('dist/css'));
    });

    gulp.task('lib', ['clean'], function() {
        var bowerConfig = {
                overrides: {
                    "bootstrap": { main: ['./dist/js/bootstrap.min.js'] },
                    "d3": { main: ['./d3.min.js'] },
                    "jquery": { main: ['./dist/jquery.min.js'] },
                    "dustjs-helpers": { main: ['./dist/dust-helpers.min.js'] },
                    "dustjs-linkedin": { main: ['./dist/dust-core.min.js'] },
                    "eonasdan-bootstrap-datetimepicker": { main: ['./build/js/bootstrap-datetimepicker.min.js'] },
                    "jquery-ui": { main: ['./jquery-ui.min.js'] },
                    "moment": { main: ['./min/moment.min.js'] },
                    "moment-timezone": { main: ['builds/moment-timezone-with-data-2010-2020.min.js'] },
                    "numeral": { main: ['./min/numeral.min.js'] },
                    "oboe": { ignore: true },
                    "papaparse": { ignore: true }
                }
            }

        var filter = plugins.filter(['*.js']);

        return gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(plugins.addSrc('app/lib/jQDateRangeSlider-min.js'))
    		.pipe(plugins.concat('main.js'))
            // .pipe(plugins.babel({
            //     presets: ['es2015']
            // }))
    		// .pipe(plugins.uglify())
    		.pipe(gulp.dest('dist/js/lib'));
    });

    gulp.task('images', ['clean'], function() {
        return gulp.src(['app/images/*'])
            .pipe(gulp.dest('dist/images'));
    });

    gulp.task('templates', ['clean'], function() {
        var stream = gulp.src(['app/templates/**/*.dust'])
            .pipe(plugins.dust())
            .pipe(plugins.concat('compiled.js'))
            // .pipe(plugins.uglify())
            .pipe(gulp.dest('dist/templates'));
        return stream;
    });

    gulp.task('workers', ['clean'], function () {
        return gulp.src('app/workers/*')
    		.pipe(gulp.dest('dist/js/workers/'));
    });

    gulp.task('special-libs', ['clean'], function () {
        var bowerConfig = {
                overrides: {
                    "bootstrap": { ignore: true  },
                    "d3": { ignore: true  },
                    "jquery": { ignore: true  },
                    "dustjs-helpers": { ignore: true  },
                    "dustjs-linkedin": { ignore: true  },
                    "eonasdan-bootstrap-datetimepicker": { ignore: true  },
                    "jquery-ui": { ignore: true  },
                    "moment": { ignore: true  },
                    "moment-timezone": { ignore: true  },
                    "numeral": { ignore: true  },
                    "oboe": { main: ['./dist/oboe-browser.js'] },
                    "papaparse": { main: ['./papaparse.js'] }
                }
            }

        return gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(plugins.addSrc('app/lib/utf8.js'))
            .pipe(plugins.flatten())
    		// .pipe(plugins.concat('main.js'))
    		.pipe(gulp.dest('dist/js/lib'));
    });

    gulp.task('scripts', ['clean'], function () {
        return gulp.src(['app/js/**/*.js', 'app/js/*.js'])
            .pipe(plugins.concat('app.js'))
    		.pipe(gulp.dest('dist/js'));
    });

    gulp.task('fonts', ['clean'], function() {
        return gulp.src(['bower_components/bootstrap/dist/fonts/*'])
            .pipe(gulp.dest('dist/fonts'));
    });

    gulp.task('clean', function(){
        return del(['dist']);
    });
