//  This file is part of the jQuery formatCurrency Plugin.
//
//    The jQuery formatCurrency Plugin is free software: you can redistribute it
//    and/or modify it under the terms of the GNU General Public License as published 
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.

//    The jQuery formatCurrency Plugin is distributed in the hope that it will
//    be useful, but WITHOUT ANY WARRANTY; without even the implied warranty 
//    of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License along with 
//    the jQuery formatCurrency Plugin.  If not, see <http://www.gnu.org/licenses/>.

(function($) {

    $.formatCurrency = {};

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

    $.fn.formatCurrency = function(destination, settings) {
				
				if (arguments.length == 1) {
					settings = destination;
					destination = false;
				}

        // initialize defaults
        var defaults = {
            name: "formatCurrency",
            //useHtml: false,
            //useHtmlOnDestination: false,
            colorize: false,
            region: '',
            global: true
        };
        // initialize default region
        defaults = $.extend(defaults, $.formatCurrency.regions['']);
        // override defaults with settings passed in
        settings = $.extend(defaults, settings);
        
        // check for region setting
        if (settings.region.length > 0)
        {
        	settings = $.extend(settings, getRegionOrCulture(settings.region));
        }

        return this.each(function() {
            $this = $(this);

						// get number
            var num = '0';
            num = $this[$this.is('input, select, textarea') ? 'val' : 'html']();
						
						// clean number
            var trimRegex = new RegExp("[^\\d" + settings.decimalSymbol + "-]", "g");
            num = num.replace(trimRegex, '');
						if (settings.decimalSymbol != '.')
							num = num.replace(settings.decimalSymbol, '.');  // reset to US decimal for arthmetic
            if (isNaN(num)) num = '0';

						// format number
            var isPositive = (num == (num = Math.abs(num)));
            // removed to always round down 
            // num = Math.floor(num * 100 + 0.50000000001)
            num = Math.floor(num * 100);
            var cents = num % 100;
            num = Math.floor(num / 100).toString();

            if (cents < 10) cents = '0' + cents;

            if (settings.groupDigits) {
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                    num = num.substring(0, num.length - (4 * i + 3)) + settings.digitGroupSymbol + num.substring(num.length - (4 * i + 3));
                }
            }
            num = num + settings.decimalSymbol + cents;

						// format symbol/negative
            var format = isPositive ? settings.positiveFormat : settings.negativeFormat;
            var money = format.replace(/%s/g, settings.symbol)
            money = money.replace(/%n/g, num);

						// setup destination
						if (!destination)
						{
							//settings.useHtmlOnDestination = settings.useHtml;
							destination = $this;
						}
						else
						{
							destination = $(destination);
						}
						// set destination
            //destination[settings.useHtmlOnDestination ? 'html' : 'val'](money);
            destination[destination.is('input, select, textarea') ? 'val' : 'html'](money);
            
            // colorize
            if (settings.colorize)
            	destination.css('color', isPositive ? 'black' : 'red');
        });
    };

    // Remove all non numbers from text
    $.fn.toNumber = function(settings) {
        var defaults = $.extend({
            name: "toNumber",
            region: '',
            global: true
        }, $.formatCurrency.regions['']);
        
        settings = jQuery.extend(defaults, settings);
        if (settings.region.length > 0)
        {
        	settings = $.extend(settings, getRegionOrCulture(settings.region));
        }

        return this.each(function() {
            var method = $(this).is('input, select, textarea') ? 'val' : 'html';
            var trimRegex = new RegExp("[^\\d" + settings.decimalSymbol + "-]", "g");
            $(this)[method]($(this)[method]().replace(trimRegex, ''));
        });
    };

    // returns the value from the first element as a number
    $.fn.asNumber = function(settings) {
        var defaults = $.extend({
            name: "asNumber",
            region: '',
            parse: true,
            parseType: 'Float',
            global: true
        }, $.formatCurrency.regions['']);
        settings = jQuery.extend(defaults, settings);
				if (settings.region.length > 0)
        {
        	settings = $.extend(settings, getRegionOrCulture(settings.region));
        }

				settings.parseType = validateParseType(settings.parseType);

        var method = $(this).is('input, select, textarea') ? 'val' : 'html';
        var trimRegex = new RegExp("[^\\d" + settings.decimalSymbol + "-]", "g");
        var num = $(this)[method]().replace(trimRegex, '');
        if (!settings.parse)
            return num;

				if (num.length == 0)
					num = '0';
					
				if (settings.decimalSymbol != '.')
						num = num.replace(settings.decimalSymbol, '.');  // reset to US decimal for arthmetic
						
        return window['parse' + settings.parseType](num);
    };

		function getRegionOrCulture(region) {
			var regionInfo = $.formatCurrency.regions[region];
			if (regionInfo) {
				return regionInfo;
			}
			else {
				if (/(\w+)-(\w+)/g.test(region))
				{
					var culture = region.replace(/(\w+)-(\w+)/g, "$1");
					return $.formatCurrency.regions[culture];
				}
			}
			// fallback to extend(null) (i.e. nothing)
			return null;
		}

		function validateParseType(parseType) {
			switch(parseType.toLowerCase())
			{
				case 'int':
					return 'Int';
				case 'float':
					return 'Float';
				default:	
					throw 'invalid parseType';
			}
		}

})(jQuery);