"use strict";

// Load plugins
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean vendor
function clean() {
    return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
    // Bootstrap
    var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
        .pipe(gulp.dest('./vendor/bootstrap'));
    // Popper.js
    var popperjs = gulp.src('./node_modules/popper.js/dist/*')
        .pipe(gulp.dest('./vendor/popper.js'));
    // jQuery
    var jquery = gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./vendor/jquery'));
    // jQuery Easing
    var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
        .pipe(gulp.dest('./vendor/jquery-easing'));
    // jQuery i18next
    var jqueryi18next = gulp.src('./node_modules/jquery-i18next/*.js')
        .pipe(gulp.dest('./vendor/jquery-i18next'));
    var i18next = gulp.src('./node_modules/i18next/*.js')
        .pipe(gulp.dest('./vendor/i18next'));
    // i18next XHR bckend
    var i18nextXHR = gulp.src('./node_modules/i18next-xhr-backend/*.js')
        .pipe(gulp.dest('./vendor/i18next-xhr-backend'));
    // jQuery parallax
    var jqueryparallax = gulp.src('./node_modules/jquery-parallax/scripts/*.js')
        .pipe(gulp.dest('./vendor/jquery-parallax'));
    // jQuery countTo
    var countto = gulp.src('./node_modules/jquery-countto/*.js')
        .pipe(gulp.dest('./vendor/jquery-countto'));
    var forkawesome = gulp.src('./node_modules/fork-awesome/css/*.css')
        .pipe(gulp.dest('./vendor/fork-awesome'));
    return merge(
        bootstrap,
        popperjs,
        jquery,
        jqueryEasing,
        jqueryi18next,
        i18nextXHR,
        jqueryparallax,
        countto,
        forkawesome
    );
}

// Watch files
function watchFiles() {
    gulp.watch("./**/*.css", browserSyncReload);
    gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
