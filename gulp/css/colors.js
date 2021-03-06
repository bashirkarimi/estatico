'use strict';

/**
 * @function `gulp css:colors`
 * @desc Import colors from JSON and save to Sass file (based on Handlebars template). Optionally it can import colors from ColorSchemer HTML export.
 *
 * Non-alphanumeric characters are removed from the name.
 * Works with JSON, too. Just replace the HTML file with a JSON one (containing "colorName": "#000000" pairs).
 */

var gulp = require('gulp');

var taskName = 'css:colors',
	taskConfig = {
		src: './source/assets/css/templates/_colors.scss',
		dest: './source/assets/.tmp',
		input: 'source/assets/css/data/colors.json', // Optional: Replace this with a HTML file
		watch: 'source/assets/css/data/colors.json' // Optional: Replace this with a HTML file
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		path = require('path'),
		dataHelper = require('../../helpers/data.js'),
		handlebars = require('gulp-hb');

	var filePath = path.resolve(taskConfig.input),
		colors = dataHelper.getColors(filePath);

	return gulp.src(taskConfig.src)
		.pipe(plumber())
		.pipe(handlebars({
			handlebars: helpers.handlebars.Handlebars.create(),
			data: {
				colors: colors
			},
			helpers: helpers.handlebars.helpers
		}).on('error', helpers.errors))
		.pipe(gulp.dest(taskConfig.dest));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
