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

		//store all elements in an array so that any document clicks will close all
		elements.push($(this.element));

		this.render();
	}

	function events() {
		var scope = this;

		$(this.element).siblings('.vClicker').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			//if allowMultiple setting is false then hide all elements except this clicked element
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

//		$(this.element).siblings('ul').find('a').on('mouseover', function (e) {
//			console.debug($(this).attr('data-selected'));
//		});
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

			//generate LIs for each option
			$.each($(this.element).find('option'), function (i, option) {
				$(scope.element).siblings('ul').append('<li><a href="#" data-value="' + $(option).val() + '">' + $(option).text() + '</a></li>');
			});

			optionsEvents.apply(this);

			//if not option has selected property set then set it to the first option
			if ($(this.element).find('option[selected]').length === 0) {
				$(this.element).find('option').eq(0).attr('selected', 'selected');
			}

			//add selected class based on selected option
			//#TODO: doesnt work with optgroup because optgroup counts as an index
			$(this.element).siblings('ul').children().eq($(this.element).find('option:selected').index()).children().addClass('selected').attr('data-selected', true);

			$(this.element).siblings('.vClicker').text($(this.element).find('option:selected').text());
		},
		hide: function (element, ignore) {
			var scope = this;

			if (element !== undefined) {
				$(element).siblings('.vClicker').removeClass('open').siblings('ul').stop(true).slideUp(this.settings.transitionSpeed);
			} else { //no element was specified then hide all. Re-call hide method with element as parameter
				$.each(elements, function () {
					//don't hide clicked element
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