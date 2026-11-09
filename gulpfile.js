const gulp = require('gulp'),
  dartSass = require('sass'),
  sass = require('gulp-sass')(dartSass),
  autoprefixer = require('gulp-autoprefixer').default,
  { deleteAsync } = require('del'),
  sync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  webpackStream = require('webpack-stream');

// Styles
function scss(done) {
  return gulp
    .src('source/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest('docs/css'))
    .pipe(sync.stream());
}

exports.scss = scss;

// JS
const js = () => {
  return gulp
    .src(['source/js/*.js'])
    .pipe(gulp.dest('docs/js'))
    .pipe(sync.stream());
};


exports.js = js;

// HTML
const html = () => {
  return gulp
    .src(['source/**/*.html', '!source/**/_*.html'], { base: 'source' })
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      }),
    )
    .pipe(gulp.dest('docs'));
};

// Copy
const copy = () => {
  return gulp
    .src(
      [
        'source/fonts/*.{ttf,woff2,woff,otf}',
        'source/*.ico',
        'source/img/**/*.{jpg,png,svg,gif,webp,mp4,webm}',
        'source/css/**/*.css',
        'source/files/**/*',
        'source/**/*.php',
      ],
      {
        base: 'source',
        encoding: false,
      },
    )
    .pipe(gulp.dest('docs'));
};

exports.copy = copy;

// Clean
const clean = () => {
  return deleteAsync('docs');
};

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'docs',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload
const reload = (done) => {
  sync.reload();
  done();
};

// Watcher
const watcher = () => {
  gulp.watch('source/scss/**/*.scss', gulp.series(scss, reload));
  gulp.watch('source/js/*.js', gulp.series(js, reload));
  gulp.watch('source/*.html', gulp.series(html, reload));
};

// build
const build = gulp.series(clean, gulp.parallel(scss, js, html, copy));

exports.build = build;

// Default
exports.default = gulp.series(build, gulp.series(server, watcher));
