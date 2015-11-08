gulp = require 'gulp'
coffee = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
connect = require 'gulp-connect'
browserify = require 'browserify'
rename = require 'gulp-rename'
source = require 'vinyl-source-stream'
uglify = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'
buffer = require 'vinyl-buffer'
# gutil = require 'gulp-util'
jasmineBrowser = require 'gulp-jasmine-browser'

gulp.task 'jasmine_boundle', ->
  browserify {} =
      entries: ["./spec/main_spec.coffee"],
      debug: true,
      extensions: [".coffee"],
      transform: ["coffeeify"] # npm install --save-dev coffeeify
    .bundle()
    .pipe source('jasmine_boundle.js')
    .pipe buffer()
    .pipe sourcemaps.init {} =
      loadMaps: true
      debug: true
    .pipe uglify {} =
      debug: true
      options:
        sourceMap: true
    .pipe sourcemaps.write("./")  # /* optional second param here */
    .pipe connect.reload()
    .pipe gulp.dest('./spec/')

gulp.task 'jasmine', ['jasmine_boundle'], ->
  return gulp.src(['./spec/jasmine_boundle.js'])
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}))

# Create this Gulpfile
gulp.task 'gulpfile', ->
  gulp.src './gulpfile.coffee'
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    .pipe coffee()
    .pipe gulp.dest './'
    # .on('error', gutil.log('NO BUILD'))

# Run development Server
gulp.task 'server', ->
  connect.server {} =
    root: ['test','dest']
    port: 8877
    host: 'localhost'
    livereload: true

# Watch Sources
gulp.task 'watch', ->
  gulp.watch './src/*.coffee', ['coffee','coffee_browserify','coffee_lint']
  #['browserify'
  gulp.watch './gulpfile.coffee', ['gulpfile']
  gulp.watch './test/*.html', ['html']

# If Html changed -> reload
gulp.task 'html', ->
  gulp.src './test/*.html'
    .pipe connect.reload()

gulp.task 'coffee_lint', ->
  gulp.src './src/*.coffee'
    .pipe sourcemaps.init {} =
      loadMaps: true
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    # .on('error', gutil.log('NO BUILD'))

# Compile Coffee->JS with sourcemap and browserify
gulp.task 'coffee_browserify', ->
  browserify {} =
      entries: ["./src/test.coffee"],
      debug: true,
      extensions: [".coffee"],
      transform: ["coffeeify"] # npm install --save-dev coffeeify
    .bundle()
    .pipe source('boundle.js')
    .pipe buffer()
    .pipe sourcemaps.init {} =
      loadMaps: true
      debug: true
    .pipe uglify {} =
      debug: true
      options:
        sourceMap: true
    .pipe sourcemaps.write("./")  # /* optional second param here */
    .pipe connect.reload()
    .pipe gulp.dest('./dest/')

gulp.task 'default', ['server','watch']

#### Maby use later?

# streamify = require 'gulp-streamify'
# to5ify = require('6to5ify');

gulp.task 'coffee', ->
  gulp.src './src/*.coffee'
    .pipe(sourcemaps.init({loadMaps: true}))
    # .pipe coffeelint()
    # .pipe coffeelint.reporter()
    .pipe coffee()
    # .pipe(sourcemaps.write('./'))
    .pipe gulp.dest './lib/'

# gulp.task 'browserify', ['coffee'], ->
#   browserify('./lib/touch.js',{debug:true})
#     .transform(to5ify)
#     .bundle()
#     # .on('error', gutil.log.bind(gutil, 'Browserify Error'))
#     .pipe source('touch.js')
#     .pipe(buffer())
#     .pipe(sourcemaps.init({loadMaps: true})) # loads map from browserify file
#     .pipe streamify(uglify())
#     .pipe rename('bundle.js')
#     .pipe(sourcemaps.write('./')) # writes .map file
#     .pipe connect.reload()
#     .pipe gulp.dest('./test/')
