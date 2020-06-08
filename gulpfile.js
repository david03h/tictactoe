const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge-stream');
require('colors');

var Config = require('./config.js');
const config = new Config();
var src = config.src;
var path = config.path;
const multiPath = typeof src === "object" ? true : false;

multiPath ? console.log("Watching:".red.bold,`[ `.white+`${config.src}`.green+` ]`.white) : console.log("Watching:".red.bold,`[ ${config.src.green} ]`);

gulp.task('sass', function(){
    if(multiPath){
        var returns = [];
        for(let i = 0;i<src.length;i++){
            returns[i] = gulp.src(`${path}/${src[i]}/scss/**/*.scss`)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss([autoprefixer()]))
            .pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(`${path}/${src[i]}/css`));
        }
        return merge(returns);
    }
    else{
        return gulp.src(`${path}/${src}/scss/**/*.scss`)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss([autoprefixer()]))
            .pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(`${path}/${src}/css`));
    }
});

gulp.task('watch', function(){
    if(multiPath){
        gulp.watch(config.getDirectory(),gulp.parallel('sass'));
    }else{
        gulp.watch(`${path}/${src}/scss/**/*.scss`,gulp.parallel('sass'));
    }
});

gulp.task('default', gulp.series('sass','watch'));