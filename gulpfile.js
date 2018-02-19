var gulp = require('gulp');
var ts = require('gulp-typescript');
var react = require('gulp-react');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var merge = require('merge2');
var jsonMerge = require('gulp-merge-json');
var jsonmin = require('gulp-jsonmin');


var tsProject = ts.createProject('js/tsconfig.json');

gulp.task('card-data', function(){
  gulp.src('js/data/cards/**/*.json')
  .pipe(jsonMerge({
      fileName: 'cards.json',
      startObj: [],
      concatArrays: true
  }))
  .pipe(jsonmin())
  .pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function() {
    var tsResult = tsProject.src()
      .pipe(tsProject());
      return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('default', ['scripts', 'card-data'], function() {
    return browserify({entries: './build/app.js'})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['js/**/*.ts', 'js/**/*.tsx', 'js/**/*.json'], ['default']);
});
