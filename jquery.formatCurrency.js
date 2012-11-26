//  This file is part of the jQuery formatCurrency Plugin.
//
//    The jQuery formatCurrency Plugin is free software: you can redistribute it
//    and/or modify it under the terms of the GNU Lesser General Public License as published 
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.

//    The jQuery formatCurrency Plugin is distributed in the hope that it will
//    be useful, but WITHOUT ANY WARRANTY; without even the implied warranty 
//    of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
//    You should have received a copy of the GNU Lesser General Public License along with 
//    the jQuery formatCurrency Plugin.  If not, see <http://www.gnu.org/licenses/>.

;(function ($) {
	$.formatCurrency = {};
	$.formatCurrencyLive = {};
	$.toNumber = {};
	$.asNumber = {};

	var fclDefaults = {
		decPointCharCodes: [], // by index: 0 - key code for key press event; 1 & 2 key codes for keyup event for the decimal point keys on the keyboard and keypad, respectively
		formatOnBlur: true,
		filterKeys: true,
		formatOnType: true
	};

	var fcDefaults = {
		colorize: false,
		region: '',
		global: true,
		roundToDecimalPlace: 2, // roundToDecimalPlace: -1; for no rounding; 0 to round to the dollar; 1 for one digit cents; 2 for two digit cents; 3 for three digit cents; ...
		eventOnDecimalsEntered: false,
		suppressCurrencySymbol: true
	};

	var tnDefaults = {
		region: '',
		global: true
	};

	var anDefaults = {
		region: '',
		parse: true,
		parseType: 'Float',
		global: true
	};

	$.formatCurrency.regions = [];

	// default Region is en
	$.formatCurrency.regions[''] = {
		symbol: '$',
		positiveFormat: '%s%n',
		negativeFormat: '(%s%n)',
		decimalSymbol: '.',
		digitGroupSymbol: ',',
		groupDigits: true
	};

	$.formatCurrencyLive.setDefaults = function(settings) {
		$.extend(fclDefaults, settings);
	};

	$.fn.formatCurrencyLive = function (settings) {
		return this.each(function () {
			$this = $(this);

			settings = buildSettingsObjGraph(
				settings,
				$.extend(
					{},
					fcDefaults,
					fclDefaults,
					($this.data('formatCurrency') ? $this.data('formatCurrency') : {})
				)
			);

			// setup the decimal point charCode setting according to the region
			if (settings.decimalSymbol == ',')
				settings.decPointCharCodes = [44, 188, 110];
			else
				settings.decPointCharCodes = [46, 190, 110];

			$this.data('formatCurrency', settings);

			if (settings.filterKeys)
				$this.off('keypress.formatCurrency')
					.on('keypress.formatCurrency', function (ev) {
						if (!keyAllowed(ev, settings.decPointCharCodes)) ev.preventDefault();
					})

			if (settings.formatOnType) {
				var settingsFmtOnType = $.extend({}, settings, { roundToDecimalPlace: -1 });
				$this.off('keyup.formatCurrency')
					.on('keyup.formatCurrency', function (ev) {
						if (keyAllowed(ev, settings.decPointCharCodes)) $(this).formatCurrency(settingsFmtOnType);
					});
			}

			if (settings.formatOnBlur)
				$this.on('blur.formatCurrency', function (ev) {
					$(this).formatCurrency(settings);
				});
		});
	};

	$.formatCurrency.setDefaults = function(settings) {
		$.extend(fcDefaults, settings);
	};

	$.formatCurrency.setAllDefaults = function(settings) {		
		for (var prop in settings) {
			if(fcDefaults.hasOwnProperty(prop)) fcDefaults[prop] = settings[prop];
			if(fclDefaults.hasOwnProperty(prop)) fclDefaults[prop] = settings[prop];
			if(tnDefaults.hasOwnProperty(prop)) tnDefaults[prop] = settings[prop];
			if(anDefaults.hasOwnProperty(prop)) anDefaults[prop] = settings[prop];
		}
	};

	$.fn.formatCurrency = function (destination, settings) {

		if (arguments.length == 1 && typeof destination !== "string") {
			settings = destination;
			destination = false;
		}

		// if this element has settings associated with it by the live Formatter and no settings
		// was specified, use the stored settings. Else, build the settings object as normal
		settings = ($(this).data('formatCurrency') && !settings ?
						$(this).data('formatCurrency') :
						buildSettingsObjGraph(settings, fcDefaults)
					);

		return this.each(function () {
			$this = $(this);

			// get number
			var num = '0';
			num = $this[$this.is('input, select, textarea') ? 'val' : 'html']();

			//identify '(123)' as a negative number
			if (num.search('\\(') >= 0)
				num = '-' + num;

			if (num === '' || (num === '-' && settings.roundToDecimalPlace === -1)) return;

			num = num.replace(settings.regexGroupDigit, ''); // Remove group digit for arithmetic

			if (settings.decimalSymbol != '.')
				num = num.replace(settings.decimalSymbol, '.');  // reset to US decimal for arithmetic				

			// if the number is valid use it, otherwise clean it
			if (isNaN(num)) {
				// clean number
				num = num.replace(settings.regex, '');

				if (num === '' || (num === '-' && settings.roundToDecimalPlace === -1))
					num = '0';

				if (isNaN(num))
					num = '0';
			}

			var isPositive = (num == Math.abs(num));
			if (!isPositive && settings.disableNegative === true) {
				num = 0;
				isPositive = true;
			}

			// evalutate number input
			var numParts = String(num).split('.');
			var hasDecimals = (numParts.length > 1);
			var decimals = (hasDecimals ? numParts[1].toString() : '0');
			var originalDecimals = decimals;

			// format number
			num = Math.abs(numParts[0]);
			num = isNaN(num) ? 0 : num;
			if (settings.roundToDecimalPlace >= 0) {
				decimals = parseFloat('1.' + decimals); // prepend "0."; (IE does NOT round 0.50.toFixed(0) up, but (1+0.50).toFixed(0)-1
				decimals = decimals.toFixed(settings.roundToDecimalPlace); // round
				if (decimals.substring(0, 1) == '2') {
					num = Number(num) + 1;
				}
				decimals = decimals.substring(2); // remove "0."
			}
			num = String(num);

			if (settings.groupDigits) {
				for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
					num = num.substring(0, num.length - (4 * i + 3)) + settings.digitGroupSymbol + num.substring(num.length - (4 * i + 3));
				}
			}

			if ((hasDecimals && settings.roundToDecimalPlace == -1) || settings.roundToDecimalPlace > 0) {
				num += settings.decimalSymbol + decimals;
			}

			// format symbol/negative
			var format = isPositive ? settings.positiveFormat : settings.negativeFormat;
			var money = format;
			if (settings.symbol !== '') money = money.replace(/%s/g, settings.symbol);
			money = money.replace(/%n/g, num);

			// setup destination
			var $destination = $([]);
			if (!destination) {
				$destination = $this;
			} else {
				$destination = $(destination);
			}
			// set destination
			$destination[$destination.is('input, select, textarea') ? 'val' : 'html'](money);

			if (hasDecimals &&
				settings.eventOnDecimalsEntered &&
				originalDecimals.length > settings.roundToDecimalPlace) {
				$destination.trigger('decimalsEntered', originalDecimals);
			}

			// colorize
			if (settings.colorize) {
				$destination.css('color', isPositive ? 'black' : 'red');
			}
		});
	};

	// Remove all non numbers from text	
	$.toNumber.setDefaults = function(settings) {
		$.extend(tnDefaults, settings);
	};

	$.fn.toNumber = function (settings) {
		return this.each(function () {
			var method = $(this).is('input, select, textarea') ? 'val' : 'html';
			$(this)[method]($.toNumber($(this)[method](), settings));
		});
	};

	$.toNumber = function(expr, settings) {
		settings = buildSettingsObjGraph(settings, tnDefaults);

		return expr.replace('(', '(-').replace(settings.regex, '');
	};

	// returns the value from the first element as a number
	$.asNumber.setDefaults = function(settings) {
		$.extend(anDefaults, settings);
	};

	$.fn.asNumber = function (settings) {
		var method = $(this).is('input, select, textarea') ? 'val' : 'html';
		var num = $(this)[method]();

		return $.asNumber(num, settings)
	};

	$.asNumber = function(expr, settings) {
		settings = buildSettingsObjGraph(settings, anDefaults);

		expr = expr ? expr : "";
		expr = expr.replace('(', '(-');
		expr = expr.replace(settings.regex, '');
		if (!settings.parse) return expr;

		if (expr.length == 0) expr = '0';

		if (settings.decimalSymbol != '.') expr = expr.replace(settings.decimalSymbol, '.');  // reset to US decimal for arithmetic

		return window['parse' + settings.parseType](expr);
	};

	function buildSettingsObjGraph(settings, defaults) {
		if (!settings) settings = {};

		// build settings graph starting from the defaults and merging region settings if needed
		settings = $.extend(
			{},
			defaults,
			$.formatCurrency.regions[''],
			settings
		);

		if (settings.region !== '') $.extend(settings, getRegionOrCulture(settings.region));

		if (settings.suppressCurrencySymbol) {
			settings.symbol = '';
			settings.positiveFormat = $.trim(settings.positiveFormat.replace('%s', ''));
			settings.negativeFormat = $.trim(settings.negativeFormat.replace('%s', '').replace(' %n', '%n'));
		}

		// validate parseType if it exists (for the 'asNumber' settings object graph)
		if (settings.hasOwnProperty('parseType'))
			settings.parseType = validateParseType(settings.parseType);

		// Generate regex for formatting
		if (settings.symbol === '')
			settings.regex = new RegExp("[^\\d" + settings.decimalSymbol + "-]", "g");
		else {
			var symbol = settings.symbol.replace('$', '\\$').replace('.', '\\.');
			settings.regex = new RegExp(symbol + "|[^\\d" + settings.decimalSymbol + "-]", "g");
		}

		settings.regexGroupDigit = new RegExp("\\" + settings.digitGroupSymbol, "g");

		return settings;
	}

	function keyAllowed(ev, decPointCodes) {
		if (ev.which >= 48 && ev.which <= 57)
			return true;
		else if (ev.type == 'keypress' && ev.which == decPointCodes[0])
			return (ev.target.value.indexOf(String.fromCharCode(decPointCodes[0])) == -1);
		else if (ev.type == 'keypress') {
			return (ev.which < 32 || (ev.which >= 33 && ev.which <= 40) || ev.which == 46);
		} else if (ev.type == 'keyup') {
			if(ev.which < 32 || (ev.which >= 33 && ev.which <= 40)) return false;

			switch (ev.which) {
				case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
				case decPointCodes[2]: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
				case decPointCodes[1]: break; // .
				default: return true;
			}

			return false;
		} else
			return true;
	}

	function getRegionOrCulture(region) {
		var regionInfo = $.formatCurrency.regions[region];
		if (regionInfo) {
			return regionInfo;
		}
		else {
			if (/(\w+)-(\w+)/g.test(region)) {
				var culture = region.replace(/(\w+)-(\w+)/g, "$1");
				return $.formatCurrency.regions[culture];
			}
		}
		// fallback to extend(null) (i.e. nothing)
		return null;
	}

	function validateParseType(parseType) {
		switch (parseType.toLowerCase()) {
			case 'int':
				return 'Int';
			case 'float':
				return 'Float';
			default:
				throw 'invalid parseType';
		}
	}

})(jQuery);