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
		theme: ''
	};

	function Plugin(element, options) {
	}

	$.extend(Plugin.prototype, {
	});

	$.fn[ pluginName ] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);