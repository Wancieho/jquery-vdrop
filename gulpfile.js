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
		' * Version: 0.0.1\n' +
		' * Dependancies: jquery-1.*\n' +
		' * Date: 24/11/2016\n' +
		' */\n';

gulp.task('default', [
	'js-copy',
	'js-minify'
]);

gulp.task('jquery-copy', function () {
	return gulp.src('source/js/jquery.vdrop.js')
			.pipe(strip())
			.pipe(header(license))
			.pipe(gulp.dest('dist/js'));
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
});