;
(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'vDrop';
	var defaults = {
		theme: ''
	};

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);

		create.apply(this);
		events.apply(this);
	}

	function create() {
		var theme = this.settings.theme !== '' && this.settings.theme !== undefined ? ' ' + this.settings.theme : '';

		$(this.element).wrap('<div class="vDrop' + theme + '"></div>').parent().append('<a href="#" class="vClicker"></a><ul></ul>');

		this.render();
	}

	function events() {
		$(this.element).siblings('.vClicker').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			$(this).siblings('ul').slideToggle(300);
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
		$(anchor).closest('ul').slideUp(300)
				.siblings('a').text($(anchor).text());
	}

	$.extend(Plugin.prototype, {
		render: function () {
			var scope = this;

			//generate LIs for each option
			$.each($(this.element).find('option'), function (i, option) {
				$(scope.element).siblings('ul').append('<li><a href="#">' + $(option).text() + '</a></li>');
			});

			optionsEvents.apply(this);

			//if not option has selected property set then set it to the first option
			if ($(this.element).find('option[selected]').length === 0) {
				$(this.element).find('option').eq(0).attr('selected', 'selected');
			}

			$(this.element).siblings('.vClicker').text($(this.element).find('option:selected').val());
		}
	});

	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);