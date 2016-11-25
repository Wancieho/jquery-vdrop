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
	var elements = [];

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);

		create.apply(this);
		events.apply(this);
	}

	function create() {
		var scope = this;
		var theme = this.settings.theme !== '' && this.settings.theme !== undefined ? ' ' + this.settings.theme : '';

		$(this.element).wrap('<div class="vDrop' + theme + '"></div>').parent().append('<a href="#" class="vClicker"></a><ul></ul>');

		if (elements.length === 0) {
			$(document).on('click', function () {
				scope.hide();
			});
		}

		elements.push($(this.element));

		this.render();
	}

	function events() {
		var scope = this;

		$(this.element).siblings('.vClicker').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (!scope.settings.allowMultiple) {
				scope.hide(undefined, $(this).siblings('select'));
			}

			if ($(this).hasClass('open')) {
				scope.hide(scope.element);
			} else {
				$(this).addClass('open').siblings('ul').stop(true).slideDown(scope.settings.transitionSpeed);
			}
		});
	}

	function optionsEvents() {
		var scope = this;

		$(this.element).siblings('ul').find('a').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			choose.apply(scope, [this]);
		});

	}

	function choose(anchor) {
		$(anchor).closest('ul').slideUp(this.settings.transitionSpeed).find('a').removeClass('selected');

		$(anchor).addClass('selected');

		$(anchor).closest('ul').siblings('.vClicker').text($(anchor).text());

		this.hide($(this.element));
	}

	$.extend(Plugin.prototype, {
		render: function () {
			var scope = this;

			$(this.element).siblings('ul').empty();

			$.each($(this.element).find('option'), function (i, option) {
				$(scope.element).siblings('ul').append('<li><a href="#" data-value="' + $(option).val() + '">' + $(option).text() + '</a></li>');
			});

			optionsEvents.apply(this);

			if ($(this.element).find('option[selected]').length === 0) {
				$(this.element).find('option').eq(0).attr('selected', 'selected');
			}

			$(this.element).siblings('ul').children().eq($(this.element).find('option:selected').index()).children().addClass('selected').attr('data-selected', true);

			$(this.element).siblings('.vClicker').text($(this.element).find('option:selected').text());
		},
		hide: function (element, ignore) {
			var scope = this;

			if (element !== undefined) {
				$(element).siblings('.vClicker').removeClass('open').siblings('ul').stop(true).slideUp(this.settings.transitionSpeed);
			} else { 
				$.each(elements, function () {
					if ($(this).attr('name') !== $(ignore).attr('name')) {
						scope.hide(this);
					}
				});
			}
		}
	});

	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			} else {
				if (options === 'render') {
					$(this).data('plugin_' + pluginName).render();
				}
			}
		});
	};
})(jQuery, window, document);