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

		this.$clicker = this.$select.siblings('a');
		this.$ul = this.$select.siblings('ul');

		this.$clicker.on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (selects.length === 0) {
				$(document).on('click', function () {
					scope.close();
				});
			}

			//allowMultiple=false then hide all dropdowns except clicked dropdown
			if (!scope.settings.allowMultiple) {
				scope.close(null, scope.$select);
			}

			//only display list and change arrow states if there are options
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

		//store all selects in an array for allowMultiple=false conditions
		selects.push(this.$select);

		this.update();
	}

	function choose(index) {
		//#TODO: dont write selected if option already selected
		this.$select.find('option').removeAttr('selected').eq(index).attr('selected', 'selected');
		console.debug(index);
		refresh.apply(this);
	}

	function refresh() {
		//update clicker text to reflect selected option text
		this.$clicker.find('span').text(this.$select.find('option:selected').text());

		this.$ul.find('a').removeClass('selected');
//		console.debug(this.$select.find('option:selected').index());
		this.$ul.children().eq(this.$select.find('option:selected').index()).children().addClass('selected');
	}

	$.extend(Plugin.prototype, {
		update: function () {
			var scope = this;

			this.$ul.empty();

			//generate LIs for each option
			$.each(this.$select.find('option'), function (i, option) {
				scope.$ul.append('<li><a href="#" data-value="' + $(option).val() + '" data-index="' + i + '">' + $(option).text() + '</a></li>');
			});

			//no option is selected set it to the first
			if (this.$select.find('option[selected]').length === 0) {
				this.$select.find('option').eq(0).attr('selected', 'selected');
			}

			this.$ul.find('a').on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();

				choose.apply(scope, [parseInt($(this).attr('data-index'))]);
//				scope.close();
			});

			refresh.apply(scope);
		},
		close: function ($select, $ignore) {
			var scope = this;

			if ($select instanceof $) {
				//only close dropdown if it's open
				if ($select.siblings('.vClicker').hasClass('open')) {
					$select.siblings('.vClicker').removeClass('open');

					$select.siblings('ul').stop(true).slideUp(this.settings.transitionSpeed);
				}
			} else { //no select was specified then hide all. Re-call hide method with select as parameter
				$.each(selects, function () {
					//don't hide clicked select
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