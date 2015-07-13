/// <binding AfterBuild='build:dev' ProjectOpened='tsd, watch:dev' />
/*
 This file in the main entry point for defining Gulp tasks and using Gulp plugins.
 Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
 */

var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var assign = require('object-assign');

var uglify = require('gulp-uglify');

var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');

var sourcemaps = require('gulp-sourcemaps');


// Helpers
var ObjToArray = function (obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key]
    })
};
/*
 * p = path
 */
var p = function () {
    return arguments != null ? ObjToArray(arguments).join('/') : undefined;
};

var deleteFileOnDeletedEvent = function (watcher) {
    watcher.on('change', function (event) {
        // added, deleted or changed

        if (event.type === 'deleted') {
            console.log('Deleted file ' + event.path);
            var pathToDelete = p(paths.wwwroot, paths.content.base);
            var indexOfContentPath = event.path.indexOf(paths.content.base);
            var lengthOfContentPath = paths.content.base.length;

            pathToDelete += event.path.substr(indexOfContentPath + lengthOfContentPath, event.path.length);
            del(pathToDelete);
        } else if (event.type === 'added') {
            console.log('Added file ' + event.path);
        } else {
            console.log('Changed file ' + event.path);
        }
    });
}

var paths = {
    base: "./src",
    dest: "./dist",
    sample: "./samples"
};

var config = {
    ts: {
        src: p(paths.base, '**/*.ts'),
        dest: paths.dest,
        sample: {
            src: p(paths.sample, '**/*.ts'),
            dest: paths.sample
        },
        base: {
            module: 'system',
            target: "es5",
            noImplicitAny: true,
            typescript: require('typescript')
        },
        dev: {},
        prod: {
            removeComments: true
        }
    }
};


gulp.task('default', function () {
    // place code for your default task here
});


// Main tasks
gulp.task('default', ['watch:dev']);
gulp.task('build', ['scripts']);
gulp.task('build:dev', ['scripts:dev']);
gulp.task('clean', function () {
    del([
        '!' + paths.dest,
        p(paths.dest, '**')
    ]);
});

gulp.task('watch:sample', function () {
    var tsSampleWatcher = gulp.watch(config.ts.sample.src, ['build:sample']);
    deleteFileOnDeletedEvent(tsSampleWatcher);
});

gulp.task('build:sample', function () {
    var tsConfig = assign(config.ts.base, config.ts.dev);

    gulp.src(config.ts.sample.src)
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfig))
        .pipe(rename({ext: 'js'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.ts.sample.dest));
});


// Scripts
gulp.task('scripts', ['ts']);
gulp.task('scripts:dev', ['ts:dev']);

// TypeScript
gulp.task('ts', function () {
    var tsConfig = assign(config.ts.base, config.ts.prod);

    gulp.src(config.ts.src)
        .pipe(ts(tsConfig))
        .pipe(rename({ext: 'js'}))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(config.ts.dest));
});
gulp.task('ts:dev', function () {
    var tsConfig = assign(config.ts.base, config.ts.dev);

    gulp.src(config.ts.src)
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfig))
        .pipe(rename({ext: 'js'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.ts.dest));
});
gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});


gulp.task('watch', function () {
    gulp.watch(config.ts.src, ['ts']);
});
gulp.task('watch:dev', function () {
    var tsWatcher = gulp.watch(config.ts.src, ['ts:dev']);
    deleteFileOnDeletedEvent(tsWatcher);
});