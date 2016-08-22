const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const Cache = require('gulp-file-cache');
const cache = new Cache();
const nodemon = require('gulp-nodemon');
//const webpack = require('webpack-stream');
const babel = require('gulp-babel');

const paths = {
  server: ['server/**/*.js'],
  client: ['client/**/*.js', 'client/**/*.css']
};

gulp.task('babel', () =>
    gulp.src(paths.server)
        .pipe(cache.filter())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(cache.cache())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
);

//gulp.task('webpack', function() {
  //return gulp.src('./client/index2.js')
    //.pipe(webpack( require('./webpack.config.js') ))
    //.pipe(gulp.dest('public/'));
//});

gulp.task('serve', ['babel'], () => {
  nodemon({
    script: 'build/app.js',
    watch: 'server',
    tasks: ['babel']
  });
});

gulp.task('default', ['babel', 'serve']);
