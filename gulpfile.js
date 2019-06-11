var gulp = require('gulp'),
	csso = require('gulp-csso'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename');

gulp.task('default', function () {

	// Javascript
	gulp.src([
			'./src/js/core.js',
			'./src/js/fias.js',
			'./src/js/fias_zip.js'
		])
		.pipe(concat('jquery.fias.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./'));

	// CSS
	gulp.src('./src/css/style.css')
		.pipe(csso())
		.pipe(rename('jquery.fias.min.css'))
		.pipe(gulp.dest('./'));
});