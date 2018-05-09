let gulp = require("gulp");
let ts = require("gulp-typescript");
let gtslint = require("gulp-tslint");
let merge = require("merge2");
let browserify = require("browserify");
let babelify = require("babelify");
let source = require("vinyl-source-stream");

var tsProject = ts.createProject("./tsconfig.json");

gulp.task('tslint', function () {
  return gulp.src('src/**/*.ts')
    .pipe(gtslint({
      formatter: 'stylish'
    }))
    .pipe(gtslint.report({
      emitError: false
    }))
});

gulp.task('ts', ["browserify"], function () {
  var tsResult = gulp.src('src/**/*.ts')
    .pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('temp/declarations/')),
    tsResult.js.pipe(gulp.dest('temp/'))
  ]);
});

gulp.task('browserify', function () {
  return browserify({
      entries: './temp/index.js',
      standalone: 'riminder-sdk',
      debug: true,
      // transform: [babelify]
    })
    .transform(babelify.configure({
      presets: ["es2015"]
    }))
    .bundle()
    .pipe(source("riminder-sdk.js"))
    .pipe(gulp.dest("dist/"));
})

gulp.task('watch', function () {

  gulp.watch('src/**/*.ts', ['tslint', 'ts', 'browserify']);

});

gulp.task('default', ['tslint', 'ts', 'browserify', 'watch']);