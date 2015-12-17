var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),

    del = require('del'),

    bases = {
        app: 'app/',
        dist: 'dist/',
    },

    paths = {
        scripts: ['scripts/**/*.js'],
        libs: {
            dateRangeSlider: ['lib/jQDateRangeSlider-min.js'],
            utf8: ['lib/utf8.js']
        },
        styles: ['styles/**/*.css'],
        html: ['index.html', '404.html'],
        images: ['images/**/*.png', 'images/**/*.gif'],
        bootstrap: {
            fonts: ['bower_components/bootstrap/dist/fonts/*']
        },
        favicons: ['images/favicons/*']
    };

    gulp.task('build', ['templates', 'lib2', 'styles', 'assets', 'workers', 'scripts', 'favicons', 'clean'], function() {
        return gulp.src(paths.html, {cwd: bases.app})
            .pipe(gulp.dest(bases.dist));
    });

    gulp.task('styles', ['clean'], function() {
        var bowerConfig = {
                overrides: {
                    "bootstrap": { main: ['./dist/css/bootstrap.min.css'] }
                }
            }
        var filterJS = plugins.filter(['**/*.min.css','*.min.css'], { restore: true });

        gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(filterJS)
            .pipe(plugins.addSrc(paths.styles, {cwd: bases.app}))
    		.pipe(plugins.concat('main.css'))
    		.pipe(plugins.uglifycss())
    		.pipe(gulp.dest(bases.dist + 'css/'));
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

        gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(plugins.addSrc('app/lib/jQDateRangeSlider-min.js'))
    		.pipe(plugins.concat('main.js'))
            // .pipe(plugins.babel({
            //     presets: ['es2015']
            // }))
    		// .pipe(plugins.uglify())
    		.pipe(gulp.dest('dist/js/lib'));
    });

    gulp.task('templates', ['clean'], function() {
        gulp.src(['app/templates/**/*.dust'])
            .pipe(plugins.dust())
            .pipe(plugins.concat('compiled.js'))
            // .pipe(plugins.uglify())
            .pipe(gulp.dest('dist/templates'));
    });

    gulp.task('workers', ['clean'], function () {
        gulp.src('app/workers/*')
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

        gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(plugins.addSrc('app/lib/utf8.js'))
            .pipe(plugins.flatten())
    		// .pipe(plugins.concat('main.js'))
    		.pipe(gulp.dest('dist/js/lib'));
    });

    gulp.task('clean', function() {
        return gulp.src(bases.dist)
            .pipe(plugins.clean());
    });

    gulp.task('assets', ['clean'], function () {
        gulp.src(paths.images, {cwd: bases.app})
            .pipe(gulp.dest(bases.dist + 'images/'));

        gulp.src(paths.bootstrap.fonts)
            .pipe(gulp.dest(bases.dist + 'fonts/'));
    });

    gulp.task('scripts', ['clean'], function () {
        gulp.src(paths.scripts, {cwd: bases.app})
            .pipe(plugins.concat('app.js'))
    		.pipe(gulp.dest(bases.dist + 'js/'));
    });

    gulp.task('lib2', ['clean'], function() {
        var filterSpecialLibs = plugins.filter(['**/oboe-browser.js', '**/papaparse.js'], { restore: true }),
            bowerConfig = {
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
            };

        gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(plugins.addSrc(paths.libs.dateRangeSlider, {cwd: bases.app}))
    		.pipe(plugins.concat('main.js'))
            // .pipe(plugins.babel({
            //     presets: ['es2015']
            // }))
    		// .pipe(plugins.uglify())
    		.pipe(gulp.dest('dist/js/lib'));

        bowerConfig.overrides.papaparse = { ingnore: false }
        bowerConfig.overrides.oboe = { ingnore: false }

        gulp.src('./bower.json')
            .pipe(plugins.mainBowerFiles(bowerConfig))
            .pipe(filterSpecialLibs)
            .pipe(plugins.addSrc(paths.libs.utf8, {cwd: bases.app}))
            .pipe(plugins.flatten())
    		.pipe(gulp.dest(bases.dist + 'js/lib'));
    });

    gulp.task('favicons', ['clean'], function () {
        gulp.src(paths.favicons, {cwd: bases.app})
    		.pipe(gulp.dest(bases.dist + 'images/favicons'));
    });
