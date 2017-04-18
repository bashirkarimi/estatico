'use strict';

/**
 * @function `gulp scaffold:copy`
 * @desc Copy module or page
 *
 * * Prompts for type and name of module to be copied as well as the new name.
 * * Non-interactive mode: `gulp scaffold:copy --interactive=false --type={Module|Page|Demo Module|Demo Page} --newType={Module|Page|Demo Module|Demo Page} --name=helloworld --newName=helloworld2`
 */

var gulp = require('gulp'),
	defaultTask = require('./default');

var taskName = 'scaffold:copy',
	taskConfig = {
	},
	getTaskScaffoldConfig = function(config, cb) {
		var helpers = require('require-dir')('../../helpers'),
			scaffoldConfig = {},
			hasAssets;

		// Get custom config and pass to task
		helpers.scaffold.getType(config.types, {
				prompt: 'What do you want to copy?'
			})
			.then(function(response) {
				hasAssets = response.hasAssets;

				return helpers.scaffold.getTarget(response.dest);
			})
			.then(function(response) {
				scaffoldConfig.src = response.src;
				scaffoldConfig.previousOriginalName = response.originalName;
				scaffoldConfig.previousName = response.name;
				scaffoldConfig.previousKeyName = response.keyName;
				scaffoldConfig.previousClassName = response.className;

				return helpers.scaffold.getType(config.types, {
					prompt: 'Where do you want to copy it to?',
					envKey: 'newType',
					filter: function(type) {
						return type.value.hasAssets === hasAssets;
					}
				});
			})
			.then(function(response) {
				scaffoldConfig.dest = response.dest;

				if (response.hasAssets) {
					scaffoldConfig.createStyles = true;
					scaffoldConfig.createScript = true;
				}

				return helpers.scaffold.getName(response.name, response.dest, {
					allowUnderscores: response.allowUnderscores,
					envKey: 'newName'
				});
			})
			.then(function(response) {
				scaffoldConfig.originalName = response.original;
				scaffoldConfig.name = response.sanitized;
				scaffoldConfig.className = response.className;
				scaffoldConfig.keyName = response.keyName;

				scaffoldConfig.replaceContent = function(content, config) {
					return content
						.replace(new RegExp(config.previousOriginalName, 'g'), config.originalName)
						.replace(new RegExp(config.previousName, 'g'), config.name)
						.replace(new RegExp(config.previousClassName, 'g'), config.className)
						.replace(new RegExp(config.previousKeyName, 'g'), config.keyName);
				};

				cb(scaffoldConfig);
			})
			.catch(helpers.errors);
	},

	task = defaultTask.task;

gulp.task(taskName, function(cb) {
	var _ = require('lodash');

	// Extend default task's config
	var config = _.merge({}, defaultTask.taskConfig, taskConfig);

	getTaskScaffoldConfig(config, function(scaffoldConfig) {
		config = _.merge(config, {
			scaffold: scaffoldConfig
		});

		task(config, cb);
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task,
	getTaskScaffoldConfig: getTaskScaffoldConfig
};
