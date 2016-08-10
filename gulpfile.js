// ---------------------------------
// Gulp plugins
// ---------------------------------
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// ---------------------------------
// Variables
// ---------------------------------
var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

// ---------------------------------
// Tasks
// ---------------------------------
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('useref', function () {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence(['sass', 'useref', 'images', 'fonts'], callback);
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch']);
});
