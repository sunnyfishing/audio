//加载gulp
var gulp=require("gulp");
//加载压缩js模块
var uglify=require("gulp-uglify");
//编译ES6
var babel = require("gulp-babel");
//编译sass
var sass = require("gulp-ruby-sass");	//会同时生成两个相同的css文件，一个在css文件下，一个在scss文件下---》因为之前在工具里装的预编译，会自动生成一个css文件
//即时刷新
var connect = require("gulp-connect");

var webserver = require("gulp-webserver")

var proxy = require('http-proxy-middleware')
//1.处理html
gulp.task("chanHtml",function(){
	gulp.src("./*.html").pipe(connect.reload());
});

//2.定义一个任务通过scss文件变化改变css文件
gulp.task("chanScssHome",function(){
	sass("./*.scss",{
		style : "expanded"
	}).pipe(gulp.dest("./"));
})

//3.定义一个任务通过css文件变化改变页面样式
gulp.task("chanCss",function(){
	gulp.src("./*.html").pipe(connect.reload());
})

//4.定义一个任务，用来压缩js代码
gulp.task("chanJs",function(){
	gulp.src("./*.js")
		.pipe(babel({
			presets:['es0215']
		}))
		.pipe(uglify())
		.pipe(gulp.dest("./"))
})
//改变端口号，使8080用来给Tomcat，这样可以使用Tomcat获取本地json数据
gulp.task("webserver", function () {
	console.log('webserver.');
	gulp.src('./')
		.pipe(
			webserver({
				host: 'localhost',
				port: 4000,
				livereload: true,
				directoryListing: {
					enable: true,
					path: './'
				},
			}
		)
	)
	
})

//5.定义一个监听器监听scss和css文件的变化，当有变化时，执行相应的任务
gulp.task("chanLis",function(){
	/*connect.server({
		livereload:true
	});*/
	console.log('chanLis.');
	gulp.watch("./*.html", ["chanHtml"]);			//监听dev下所有的html
	gulp.watch("./*scss",["chanScssHome"]);	//监听scss文件的变化
	gulp.watch("./*.css",["chanCss"]);		//监听css文件的变化
})
//以上形成了 在打开chanLis监听器的情况下  当改变scss文件时，页面自动刷新

gulp.task('default', ["chanLis","webserver"], function () {
	console.log('done.');
})

//生成最终项目
