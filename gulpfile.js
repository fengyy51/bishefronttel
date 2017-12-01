//引入gulp和gulp插件
  var gulp = require('gulp'),  
  runSequence = require('run-sequence'),   
  rev = require('gulp-rev'),    
  revCollector = require('gulp-rev-collector');
var minifyHTML=require('gulp-minify-html');

var clean=require('gulp-clean');
//定义css、js文件路径，是本地css,js文件的路径，可自行配置
gulp.task('clean',function(){
    return gulp.src(['./dist','./rev'],{read:false})
        .pipe(clean());
        // .pipe(rimraf());
})
gulp.task("css", function(){
    return gulp.src(["./dist/act/css/*.css","./dist/map/css/*.css","./dist/goods/css/*.css","./dist/personal/css/*.css","./dist/util/css/*.css","./dist/prize/css/*.css","./dist/vote/css/*.css"])
    .pipe(rev())
    // .pipe(gulp.dest("./dist/../css"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("./rev/css/"));
});
gulp.task("js", function(){
    return gulp.src(["./dist/map/js/*.js","./dist/act/js/*.js","./dist/goods/js/*.js","./dist/personal/js/*.js","./dist/util/js/*.js","./dist/prize/js/*.js","./dist/vote/js/*.js"])
        .pipe(rev())
        // .pipe(gulp.dest("./dist/../js"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./rev/js/"));
});
//v2下面全部的aspx添加版本号
gulp.task("rev",function(){
    return gulp.src(['./rev/**/*.json',"./dist/**/page/*.html","./dist/**/*.html"])
    .pipe(
        revCollector({
            replaceReved: true         
        }))
    // .pipe(minifyHTML({
    //     empty:true,
    //     spare:true
    // }))
    .pipe(gulp.dest("./dist"));
});
//开发构建
gulp.task('dev', function (done) {   
  condition = false;   
  runSequence(  
  // ['clean'],     
  ['css'],       
  ['js'],        
  ['rev'],        
  done);
});
  gulp.task('default', ['dev']);

