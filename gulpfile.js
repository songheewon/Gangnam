(function() {

  'use strict';

  // Include Gulp & Plugins
  var gulp         = require('gulp'),
      sass         = require('gulp-sass')(require('sass')),
      rtlcss       = require('gulp-rtlcss'),
      cleanCSS     = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      concat       = require('gulp-concat'),
      rename       = require('gulp-rename'),
      uglify       = require('gulp-uglify'),
      jshint       = require('gulp-jshint'),
      plumber      = require('gulp-plumber'),
      gutil        = require('gulp-util'),
      replace      = require('gulp-replace'),
      size         = require('gulp-size'),
      zip          = require('gulp-zip'),
      fs           = require('fs');

  // Set the compiler to use Dart Sass instead of Node Sass
  sass.compiler = require('dart-sass');

  var onError = function( err ) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
  };

  // SASS
  gulp.task('sass', function (done) {
    return gulp.src('./assets/sass/*.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({suffix: '-min'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./assets/css'))
    .pipe(rtlcss())                     // Convert to RTL
    .pipe(rename({ suffix: '-rtl' }))   // Rename style.css to 'style-rtl.css'
    .pipe(gulp.dest('./assets/css'))    // Output RTL stylesheets
    .pipe(size())
    done();
  });

  // inlineCSS
  gulp.task('inlinecss', function(done) {
    return gulp.src(['partials/inline-css.hbs'])
    .pipe(replace('@@compiled_css', fs.readFileSync('assets/css/style-min.css')))
    .pipe(gulp.dest('partials/compiled'))
    done();
  });

  // inlineCSS-RTL
  gulp.task('inlinecss-rtl', function(done) {
    return gulp.src(['partials/inline-css-rtl.hbs'])
    .pipe(replace('@@compiled_css_rtl', fs.readFileSync('assets/css/style-min-rtl.css')))
    .pipe(gulp.dest('partials/compiled'))
    done();
  });

  // JavaScript
  gulp.task('js', function(done) {
    return gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap-transition/scripts/transition.js',
      './bower_components/zoom.js/dist/zoom.js',
      './bower_components/jquery.fitvids/jquery.fitvids.js',
      './node_modules/lazysizes/lazysizes.min.js',
      './node_modules/evil-icons/assets/evil-icons.min.js',
      './node_modules/clipboard/dist/clipboard.js',
      './node_modules/prismjs/prism.js',
      './assets/js/app.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./assets/js'))
      .pipe(size())
      done();
  });

  // Watch
  gulp.task('watch', function() {
    gulp.watch('assets/sass/**/*.scss', gulp.series('build_css'));
    gulp.watch('./assets/js/app.js', gulp.series('js'));
  });

  gulp.task(
    'build_css',
    gulp.series('sass', 'inlinecss', 'inlinecss-rtl')
  );

  gulp.task(
    'build',
    gulp.series('build_css', 'js')
  );

  gulp.task('zip', function () {
    return gulp.src([
      './**',
      '!node_modules/**',
      '!bower_components/**',
      '!.git/**',
      '!.DS_Store'
    ], { dot: true })
    .pipe(zip('gangnam.zip'))
    .pipe(gulp.dest('../'))
    done();
  });

  gulp.task(
    'default',
    gulp.series('build', 'watch')
  );

})();