var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');
var less = require('gulp-less');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var header = require('gulp-header');
var license = '/*\n' +
		' * Project: vDrop\n' +
		' * Description: Select dropdown jQuery plug-in\n' +
		' * Author: https://github.com/Wancieho\n' +
		' * License: MIT\n' +
		' * Version: 0.0.4\n' +
		' * Dependancies: jquery-1.*\n' +
		' * Date: 24/11/2016\n' +
		' */\n';

gulp.task('default', [
	'css-copy',
	'css-minify',
	'jquery-copy',
	'js-copy',
	'js-minify'
]);

gulp.task('css-copy', function () {
	return gulp.src('source/css/vdrop.less')
			.pipe(less())
			.pipe(gulp.dest('dist/css'));
});

gulp.task('css-minify', function () {
	return gulp.src('source/css/vdrop.less')
			.pipe(less())
			.pipe(minify({compatibility: 'ie8'}))
			.pipe(rename('vdrop.min.css'))
			.pipe(gulp.dest('dist/css'));
});

gulp.task('jquery-copy', function () {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
			.pipe(strip())
			.pipe(header(license))
			.pipe(gulp.dest('demo'));
});

gulp.task('js-copy', function () {
	return gulp.src('source/js/jquery.vdrop.js')
			.pipe(strip())
			.pipe(header(license))
			.pipe(gulp.dest('dist/js'));
});

gulp.task('js-minify', function () {
	return gulp.src('source/js/jquery.vdrop.js')
			.pipe(uglify())
			.pipe(header(license))
			.pipe(rename('jquery.vdrop.min.js'))
			.pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
	gulp.watch('source/js/jquery.vdrop.js', ['js-copy']);
	gulp.watch('source/js/jquery.vdrop.js', ['js-minify']);
	gulp.watch('source/css/vdrop.less', ['css-copy']);
	gulp.watch('source/css/vdrop.less', ['css-minify']);
});