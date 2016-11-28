/*
 * Project: vDrop
 * Description: Select dropdown jQuery plug-in
 * Author: https://github.com/Wancieho
 * License: MIT
 * Version: 0.0.1
 * Dependancies: jquery-1.*
 * Date: 24/11/2016
 */
;
(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'vDrop';
	var defaults = {
		transitionSpeed: 150,
		allowMultiple: true,
		theme: ''
	};
	var selects = [];

	function Plugin(select, options) {
		this.$select = $(select);
		this.$clicker = null;
		this.$ul = null;
		this.settings = $.extend({}, defaults, options);

		create.apply(this);
	}

	function create() {
		var scope = this;
		var theme = this.settings.theme !== '' && this.settings.theme !== undefined ? ' ' + this.settings.theme : '';

		this.$select.wrap('<div class="vDrop' + theme + '"></div>').parent().append('<a href="#" class="vClicker"><span></span><div class="vArrow"></div></a><ul></ul>');

		this.$clicker = this.$select.siblings('.vClicker');
		this.$ul = this.$select.siblings('ul');

		this.$clicker.on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (selects.length === 0) {
				$(document).on('click', function () {
					scope.close();
				});
			}

			if (!scope.settings.allowMultiple) {
				scope.close(null, scope.$select);
			}

			if (scope.$ul.find('li').length > 0) {
				if ($(this).hasClass('open')) {
					scope.close(scope.$select);
				} else {
					$(this).addClass('open');

					scope.$ul.stop(true).slideDown(scope.settings.transitionSpeed);
				}
			}
		});

		if (selects.length === 0) {
			$(document).on('click', function () {
				scope.close();
			});
		}

		selects.push(this.$select);

		this.update();
	}

	function choose(index) {
		if (index !== selectedOptionIndex.apply(this)) {
			this.$select.find('option').removeAttr('selected').prop('selected', false);
			this.$select.find('option').eq(index).attr('selected', 'selected').prop('selected', true);

			updateUl.apply(this);
		}

		this.close();
	}

	function updateUl() {
		this.$clicker.find('span').text(this.$select.find('option:selected').text());

		this.$ul.find('a').removeClass('selected');

		this.$ul.children('li').eq(selectedOptionIndex.apply(this)).children('a').addClass('selected');
	}

	function selectedOptionIndex() {
		if (this.$select.find('optgroup').length > 0) {
			var counter = 0;
			var index = 0;

			$.each(this.$select.find('optgroup'), function () {
				$.each($(this).find('option'), function () {
					if ($(this).is(':selected')) {
						index = counter;
					}

					counter++;
				});
			});

			return index;
		} else {
			return this.$select.find('option:selected').index();
		}
	}

	$.extend(Plugin.prototype, {
		update: function () {
			var scope = this;

			this.$ul.find('a').unbind();
			this.$ul.empty();

			$.each(this.$select.find('option'), function (i, option) {
				scope.$ul.append('<li><a href="#" data-value="' + $(option).val() + '" data-index="' + i + '">' + $(option).text() + '</a></li>');
			});

			if (this.$select.find('option[selected]').length === 0) {
				this.$select.find('option').eq(0).attr('selected', 'selected');
			}

			if (this.$select.find('option').length !== 0) {
				updateUl.apply(scope);
			}

			this.$ul.find('a').unbind().on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();

				choose.apply(scope, [parseInt($(this).attr('data-index'))]);
			});
		},
		close: function ($select, $ignore) {
			var scope = this;

			if ($select instanceof $) {
				if ($select.siblings('.vClicker').hasClass('open')) {
					$select.siblings('.vClicker').removeClass('open');

					$select.siblings('ul').stop(true).slideUp(this.settings.transitionSpeed);
				}
			} else { 
				$.each(selects, function () {
					if ($ignore === undefined || this.attr('name') !== $ignore.attr('name')) {
						scope.close(this);
					}
				});
			}
		}
	});

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			} else {
				switch (options) {
					case 'update':
						$(this).data('plugin_' + pluginName).update();
						break;

					case 'close':
						$(this).data('plugin_' + pluginName).close($(this));
						break;
				}
			}
		});
	};
})(jQuery, window, document);