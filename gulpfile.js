(function() {
  var browserify, buffer, coffee, coffeelint, connect, gulp, jasmineBrowser, rename, source, sourcemaps, uglify;

  gulp = require('gulp');

  coffee = require('gulp-coffee');

  coffeelint = require('gulp-coffeelint');

  connect = require('gulp-connect');

  browserify = require('browserify');

  rename = require('gulp-rename');

  source = require('vinyl-source-stream');

  uglify = require('gulp-uglify');

  sourcemaps = require('gulp-sourcemaps');

  buffer = require('vinyl-buffer');

  jasmineBrowser = require('gulp-jasmine-browser');

  gulp.task('jasmine_boundle', function() {
    return browserify({
      entries: ["./spec/main_spec.coffee"],
      debug: true,
      extensions: [".coffee"],
      transform: ["coffeeify"]
    }).bundle().pipe(source('jasmine_boundle.js')).pipe(buffer()).pipe(sourcemaps.init({
      loadMaps: true,
      debug: true
    })).pipe(sourcemaps.write("./")).pipe(connect.reload()).pipe(gulp.dest('./spec/'));
  });

  gulp.task('jasmine', ['jasmine_boundle'], function() {
    return gulp.src(['./spec/jasmine_boundle.js']).pipe(jasmineBrowser.specRunner()).pipe(jasmineBrowser.server({
      port: 8888
    }));
  });

  gulp.task('gulpfile', function() {
    return gulp.src('./gulpfile.coffee').pipe(coffeelint()).pipe(coffeelint.reporter()).pipe(coffee()).pipe(gulp.dest('./'));
  });

  gulp.task('server', function() {
    return connect.server({
      root: ['test', 'dest'],
      port: 8877,
      host: 'localhost',
      livereload: true
    });
  });

  gulp.task('watch', function() {
    gulp.watch('./src/*.coffee', ['coffee', 'coffee_browserify', 'coffee_lint']);
    gulp.watch('./gulpfile.coffee', ['gulpfile']);
    return gulp.watch('./test/*.html', ['html']);
  });

  gulp.task('html', function() {
    return gulp.src('./test/*.html').pipe(connect.reload());
  });

  gulp.task('coffee_lint', function() {
    return gulp.src('./src/*.coffee').pipe(sourcemaps.init({
      loadMaps: true
    })).pipe(coffeelint()).pipe(coffeelint.reporter());
  });

  gulp.task('coffee_browserify', function() {
    return browserify({
      entries: ["./src/test.coffee"],
      debug: true,
      extensions: [".coffee"],
      transform: ["coffeeify"]
    }).bundle().pipe(source('boundle.js')).pipe(buffer()).pipe(sourcemaps.init({
      loadMaps: true,
      debug: true
    })).pipe(uglify({
      debug: true,
      options: {
        sourceMap: true
      }
    })).pipe(sourcemaps.write("./")).pipe(connect.reload()).pipe(gulp.dest('./dest/'));
  });

  gulp.task('default', ['server', 'watch']);

  gulp.task('coffee', function() {
    return gulp.src('./src/*.coffee').pipe(sourcemaps.init({
      loadMaps: true
    })).pipe(coffee()).pipe(gulp.dest('./lib/'));
  });

}).call(this);
