var gulp = require('gulp');
var ts = require('gulp-typescript');
var source = require('vinyl-source-stream');
var browserify = require('browserify');


var tsProject = ts.createProject('js/tsconfig.json');

gulp.task('scripts', function() {
    var tsResult = tsProject.src()
      .pipe(tsProject());
      return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('default', ['scripts'], function() {
    return browserify({entries: './build/app.js'})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['js/**/*.ts', 'js/**/*.tsx', 'js/**/*.json'], ['default']);
});
