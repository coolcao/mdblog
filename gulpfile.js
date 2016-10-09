const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const merge = require('merge-stream');
const cssmin = require('gulp-minify-css');
const nodemon = require('gulp-nodemon');
const less = require('gulp-less');

var path = {
    js:{
        src:{
            lib: [
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-aria/angular-aria.min.js',
                    'bower_components/angular-material/angular-material.min.js',
                    'bower_components/angular-messages/angular-messages.min.js',
                    'bower_components/angular-route/angular-route.min.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/google-code-prettify/bin/prettify.min.js'
                ],
            app: [
                    'public/javascripts/src/app.js',
                    'public/javascripts/src/route.js',
                    'public/javascripts/src/**/**.js'
                ]
            
        },
        dest:'public/javascripts/dist/'

    },
    css:{
        src:{
            lib:[
                'bower_components/angular-material/angular-material.min.css',
                'bower_components/google-code-prettify/bin/prettify.min.css'
                ],
            app:'public/stylesheets/src/*.less'
        },
        dest:'public/stylesheets/dist'
        
    }
};


gulp.task('js',function () {
    console.log('------------gulp/js-----------');
    let js_lib = path.js.src.lib;
    let js_src = path.js.src.app;

    let js_lib_task = gulp.src(js_lib)
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest(path.js.dest));
    let js_src_task = gulp.src(js_src)
        .pipe(concat('js.min.js'))
        .pipe(gulp.dest(path.js.dest));
    return merge([js_lib_task, js_src_task]);
});


gulp.task('css', function () {
    console.log('--------------gulp/css---------------');
    //先将less编译成css并压缩,返回流
    let less_stream = gulp.src(path.css.src.app)
        .pipe(less())
        .pipe(cssmin());
    //将第三方库css压缩
    let min_lib = gulp.src(path.css.src.lib)
        .pipe(cssmin());

    //将流合并输出到目标文件
    return merge([min_lib,less_stream])
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(path.css.dest));
});

gulp.task('clean', function () {
    console.log('--------------gulp/clean---------------');
    return gulp.src([path.js.dest, path.css.dest])
        .pipe(clean());
});

gulp.task('build',['js','css'],function () {
    console.log('--------------gulp/build-----------');
});



gulp.task('default', ['build'], function () {
    console.log('--------------gulp/default--------------');
    nodemon({
        script: './bin/www'
        , ext: 'js html css'
        , env: {'NODE_ENV': 'development'}
    });
    
    
    //监听文件变化,并压缩
    let jswatcher = gulp.watch(path.js.src.app.concat(path.js.src.lib),['js']);
    let csswatcher = gulp.watch(path.css.src.lib.concat(path.css.src.app),['css']);
});