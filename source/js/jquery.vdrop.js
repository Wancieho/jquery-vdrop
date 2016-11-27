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
		//store persistent elements as variables eg. select, ul, vClicker to improve DOM iteration

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

		//store all selects in an array so that any document clicks will close all when allowMultiple = false
		selects.push($(this.select));

		this.update();
	}

	function events() {
		var scope = this;

		$(this.select).siblings('.vClicker').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			//if allowMultiple setting is false then hide all selects except this clicked select
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
//			$(scope.element).find('option:selected').attr('data-selected', true);

//			$(this).parent().find('a').removeClass('selected');
		});

//		$(this.select).siblings('ul').on('mouseout', function () {
//			$(scope.select).find('option[data-selected]').attr('selected', 'selected').removeAttr('data-selected');
//		});
	}

	function choose(anchor) {
		$(anchor).closest('ul').slideUp(this.settings.transitionSpeed).find('a').removeClass('selected');

		$(this.select).find('option').removeAttr('selected');
		console.debug($(anchor).attr('data-index'));
		$(this.select).find('option').eq($(anchor).attr('data-index')).attr('selected', 'selected');
//		$(anchor).addClass('selected');
//
//		$(anchor).closest('ul').siblings('.vClicker').text($(anchor).text());
//
//		this.close($(this.select));
	}

	$.extend(Plugin.prototype, {
		update: function () {
			var scope = this;

			$(this.select).siblings('ul').empty();

			//generate LIs for each option
			$.each($(this.select).find('option'), function (i, option) {
				$(scope.select).siblings('ul').append('<li><a href="#" data-value="' + $(option).val() + '" data-index="' + i + '">' + $(option).text() + '</a></li>');
			});

			optionsEvents.apply(this);

			//if not option has selected property set then set it to the first option
			if ($(this.select).find('option[selected]').length === 0) {
				$(this.select).find('option').eq(0).attr('selected', 'selected');
			}

			//add selected class based on selected option
			//#TODO: doesnt work with optgroup because optgroup counts as an index
			$(this.select).siblings('ul').children().eq($(this.select).find('option:selected').index()).children().addClass('selected');

			$(this.select).siblings('.vClicker').text($(this.select).find('option:selected').text());
		},
		close: function (select, ignore) {
			var scope = this;

			//#TODO: check that select is a jQuery object instead of null/undefined checks
			if (select !== undefined && select !== null) {
				//only close dropdown if it's open
				if ($(select).siblings('.vClicker').hasClass('open')) {
					$(select).siblings('.vClicker').removeClass('open').siblings('ul').stop(true).slideUp(this.settings.transitionSpeed);

//					$(select).find('option[data-selected]').attr('selected', 'selected').removeAttr('data-selected');

//				setTimeout(function () {
//					scope.update();
//				}, 2000);
				}
			} else { //no select was specified then hide all. Re-call hide method with select as parameter
				$.each(selects, function () {
					//don't hide clicked select
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