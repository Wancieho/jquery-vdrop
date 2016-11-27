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
		transitionSpeed: 200,
		allowMultiple: true,
		theme: ''
	};
	var selects = [];

	function Plugin(select, options) {
		this.select = select;
		this.settings = $.extend({}, defaults, options);

		create.apply(this);
		events.apply(this);
	}

	function create() {
		var scope = this;
		var theme = this.settings.theme !== '' && this.settings.theme !== undefined ? ' ' + this.settings.theme : '';

		$(this.select).wrap('<div class="vDrop' + theme + '"></div>').parent().append('<a href="#" class="vClicker"></a><ul></ul>');

		if (selects.length === 0) {
			$(document).on('click', function () {
				scope.close();
			});
		}

		selects.push($(this.select));

		this.update();
	}

	function events() {
		var scope = this;

		$(this.select).siblings('.vClicker').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (!scope.settings.allowMultiple) {
				scope.close(null, $(this).siblings('select'));
			}

			if ($(this).hasClass('open')) {
				scope.close(scope.select);
			} else {
				$(this).addClass('open').siblings('ul').stop(true).slideDown(scope.settings.transitionSpeed);
			}
		});
	}

	function optionsEvents() {
		var scope = this;

		$(this.select).siblings('ul').find('a').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			choose.apply(scope, [this]);
		});

		$(this.select).siblings('ul').find('li').on('mouseover', function () {

		});

	}

	function choose(anchor) {
		$(anchor).closest('ul').slideUp(this.settings.transitionSpeed).find('a').removeClass('selected');

		$(this.select).find('option').removeAttr('selected');
		console.debug($(anchor).attr('data-index'));
		$(this.select).find('option').eq($(anchor).attr('data-index')).attr('selected', 'selected');
	}

	$.extend(Plugin.prototype, {
		update: function () {
			var scope = this;

			$(this.select).siblings('ul').empty();

			$.each($(this.select).find('option'), function (i, option) {
				$(scope.select).siblings('ul').append('<li><a href="#" data-value="' + $(option).val() + '" data-index="' + i + '">' + $(option).text() + '</a></li>');
			});

			optionsEvents.apply(this);

			if ($(this.select).find('option[selected]').length === 0) {
				$(this.select).find('option').eq(0).attr('selected', 'selected');
			}

			$(this.select).siblings('ul').children().eq($(this.select).find('option:selected').index()).children().addClass('selected');

			$(this.select).siblings('.vClicker').text($(this.select).find('option:selected').text());
		},
		close: function (select, ignore) {
			var scope = this;

			if (select !== undefined && select !== null) {
				if ($(select).siblings('.vClicker').hasClass('open')) {
					$(select).siblings('.vClicker').removeClass('open').siblings('ul').stop(true).slideUp(this.settings.transitionSpeed);


				}
			} else { 
				$.each(selects, function () {
					if ($(this).attr('name') !== $(ignore).attr('name')) {
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