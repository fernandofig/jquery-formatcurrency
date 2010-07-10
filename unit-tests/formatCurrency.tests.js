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


function testFormat(selector, settings, test) {
	var el = $(selector);
	
	el.formatCurrency(settings);

	test.call(el);
}

$(function() { 
	// comments out becuase its noise.
	module('formatCurrency'); 
	
	test("formatCurrency settings", function() { 					
		// refreshes with textbox caused test to fail.
		// I'm resetting it before it runs
		$('.val').val('123');
		testFormat('.val', {}, function() {		
			equals(this.val(), '$123.00', 'default textbox'); 
		});
		
		testFormat('.useHtml', {}, function() {		
			equals(this.html(), '$123.00', "default dom element"); 
		});
		
		testFormat('.symbol', { symbol:'^'}, function() {		
			equals(this.html(), '^123.00', "symbol: '^'"); 
		});

		testFormat('.roundUp', { roundToDecimalPlace: 2 }, function() {
			equals(this.html(), '$124.55', "Round up");
		});

		testFormat('.roundDown', { roundToDecimalPlace: 2 }, function() {
			equals(this.html(), '$124.55', "Round down");
		});

		testFormat('.threeDecimals', { roundToDecimalPlace: 3 }, function() {
			equals(this.html(), '$123.000', "Three decimals");
		});

		testFormat('.noDecimals', { roundToDecimalPlace: 0}, function() {
			equals(this.html(), '$124', "No decimals left after rounding");
		});

		testFormat('.oneDecimal', { roundToDecimalPlace: 1}, function() {
			equals(this.html(), '$123.9', "One decimal");
		});

		testFormat('.roundToDollar', { roundToDecimalPlace: 0 }, function() {
			equals(this.html(), '$124', "Round to dollar");
		});

		testFormat('.roundUpToDollar', { roundToDecimalPlace: 0 }, function() {
			equals(this.html(), '$124', "Round up to dollar");
		});

		testFormat('.roundDownToDollar', { roundToDecimalPlace: 0 }, function() {
			equals(this.html(), '$123', "Round down to dollar");
		});

		testFormat('.roundUpToNegativeDollar', { roundToDecimalPlace: 0, negativeFormat: '-%s%n'}, function() {
			equals(this.html(), '-$124', "Round up to negative dollar");
		});

		testFormat('.roundDownToNegativeDollar', { roundToDecimalPlace: 0, negativeFormat: '-%s%n'}, function() {
			equals(this.html(), '-$123', "Round down to negative dollar");
		});

		testFormat('.doNotAddZeroCentsOnDollar', { roundToDecimalPlace: -1 }, function() {
			equals(this.html(), '$123', "Do not add zero cent on dollar");
		});

		testFormat('.noRounding', { roundToDecimalPlace: -1 }, function() {
			equals(this.html(), '$123.456', "No rounding");
		});

		testFormat('.keepTrailingZeros', { roundToDecimalPlace: -1 }, function() {
			equals(this.html(), '$124.0000', "Keep trailing zeros");
		});

		testFormat('.noTrailingDecimal', { roundToDecimalPlace: 0 }, function() {
			equals(this.html(), '$123', "noTrailingDecimal");
		});

		$('.warnOnDecimalsEntered').bind('decimalsEntered', function(e, cents) {
			$('.warnOnDecimalsEnteredNotification').html('Please do not enter any cents!');
		});
		testFormat('.warnOnDecimalsEntered', { roundToDecimalPlace: 0, eventOnDecimalsEntered: true }, function() {
			equals(this.html(), '$123', "warnOnDecimalsEntered");
			equals($('.warnOnDecimalsEnteredNotification').html(), 'Please do not enter any cents!', "Warn on decimals entered notification");
		});

		$('.warnOnDecimalsEnteredBeforeRounded').bind('decimalsEntered', function(e, cents, roundedTo) {
			$('.warnOnDecimalsEnteredBeforeRoundedNotification').html('Please do not enter any cents!' + ' (0.' + cents + ')');
		});
		testFormat('.warnOnDecimalsEnteredBeforeRounded', { roundToDecimalPlace: 2, eventOnDecimalsEntered: true }, function() {
			equals(this.html(), '$123.46', "Warn on decimals entered before they are rounded");
			equals($('.warnOnDecimalsEnteredBeforeRoundedNotification').html(), 'Please do not enter any cents! (0.456)', "Warn on decimals entered before they are rounded notification");
		});

		$('.onlyWarnOnDecimalsEnteredAsAppropriate').bind('decimalsEntered', function(e, cents, roundedTo) {
			$('.onlyWarnOnDecimalsEnteredAsAppropriateNotification').html('Please do not enter any cents!' + ' (0.' + cents + ')');
		});
		testFormat('.onlyWarnOnDecimalsEnteredAsAppropriate', { roundToDecimalPlace: 2, eventOnDecimalsEntered: true }, function() {
			equals(this.html(), '$123.45', "Only warn on decimals entered as appropriate, not here");
			equals($('.onlyWarnOnDecimalsEnteredAsAppropriateNotification').html(), '', "Only warn on decimals entered as appropriate notification, not here");
		});

		testFormat('.roundOneUp', {}, function() {
			equals(this.html(), '$124.00', "roundOneUp");
		});

		testFormat('.roundOneDown', { negativeFormat:'-%s%n' }, function() {
			equals(this.html(), '-$124.00', "roundOneDown");
		});

		testFormat('.negativeBrackets', {}, function() {
			equals(this.html(), '($123.00)', "negativeBrackets");
		});

		testFormat('.positiveFormat', { positiveFormat:'%s - %n'}, function() {		
			equals(this.html(), '$ - 123.00', "positiveFormat: '%s - %n'"); 
		});
		
		testFormat('.negativeFormat', { negativeFormat:'neg %s - %n'}, function() {		
			equals(this.html(), 'neg $ - 123.00', "negativeFormat: 'neg %s - %n'"); 
		});
		
		testFormat('.negativeFormatDecimal', { negativeFormat:'neg %s - %n'}, function() {		
			equals(this.html(), 'neg $ - 0.25', "negativeFormat Decimal: 'neg %s - %n'"); 
		});
		
		testFormat('.defaultValue', { }, function() {
			equals(this.html(), '', "Default value");
		});

		testFormat('.noDefaultValue', { roundToDecimalPlace: -1 }, function() {
			equals(this.html(), '', "No default value");
		});

		testFormat('.lonelyNegative', { roundToDecimalPlace: -1, negativeFormat: '-%s%n' }, function() {
			equals(this.html(), '-', "Keep negative sign without a number during format as you type");
		});

		testFormat('.doNoRemoveZero', { roundToDecimalPlace: -1 }, function() {
			equals(this.html(), '$0', "Do no remove 0");
		});
		testFormat('.issue2_doNotRound', {}, function() {
			equals(this.html(), '$9.45', "issue2_doNotRound (9.45)"); 
		});

		testFormat('.issue6_doNotRound', {}, function() {
			equals(this.html(), '$154.20', "issue6_doNotRound (154.20)");
		});

		testFormat('.decimalSymbol', { decimalSymbol:'^'}, function() {		
			equals(this.html(), '$123^00', "decimalSymbol: '^'"); 
		});
		
		testFormat('.digitGroupSymbol', { digitGroupSymbol:'^'}, function() {		
			equals(this.html(), '$123^123.00', "digitGroupSymbol: '^'"); 
		});
		
		testFormat('.groupDigits', { groupDigits:false}, function() {		
			equals(this.html(), '$123123.00', "groupDigits: false"); 
		});
		
		$('.src').formatCurrency('.dest', { });
		equals($('.dest').html(), '$1,000.00', 'Set using src,dest'); 
		
		$('.src2').formatCurrency('.dest2', { });
		equals($('.dest2').html(), '$1,000.00', 'Set using src,dest with different types'); 
		
		testFormat('.colorize', { colorize:true}, function() {		
			equals(this.css('color'), 'black', "colorize: true"); 
		});
		
		testFormat('.colorize-neg', { colorize:true}, function() {		
			equals(this.css('color'), 'red', "colorize: true (with negative should be red)"); 
		});
		
		testFormat('.region', { region:'de'}, function() {		
			equals(this.html(), '1.000,00 €', "region: 'de'"); 
		});
		
		testFormat('.regionFallback', { region:'de-DE'}, function() {		
			equals(this.html(), '1.000,00 €', "region: 'de-DE' should fallback to 'de'"); 
		});
		
		testFormat('.regionFullFallback', { region:'badRegion'}, function() {		
			equals(this.html(), '$1,000.00', "region: 'badRegion' should fallback to '' (default)"); 
		});
		
		testFormat('.multiDest', { }, function() {		
			equals($('.multiDest2').html(), $('.multiDest1').html(), "can format multiple destinations"); 
		});
		
		testFormat('.blankShouldBeBlank', { }, function() {		
			equals($('.blankShouldBeBlank').html(), '', "blank should return blank"); 
		});
		
		testFormat('.floatToCommaDecimal', { decimalSymbol: ',', digitGroupSymbol: '.', dropDecimals: false, groupDigits: true, symbol: '' }, function() {		
			equals($('.floatToCommaDecimal').html(), '33.195,50', "formatting a float value should succeed"); 
		});
		
		testFormat('.formatCurrencyWithBlankSymbol', { symbol: '' }, function() {		
			equals($('.formatCurrencyWithBlankSymbol').html(), '1,234.56', "can formatcurrency with a blank symbol"); 
		});
		
		testFormat('.formatCurrencyWithNegOneHundredth', { symbol: '$', negativeFormat: '-%s%n' }, function() {		
			equals($('.formatCurrencyWithNegOneHundredth').html(), '-$0.01', "can formatcurrency with a -0.01 (issue #19)"); 
		});
		
		testFormat('.formatCurrencyWithAlpha', { symbol: '$', negativeFormat: '-%s%n' }, function() {		
			equals($('.formatCurrencyWithAlpha').html(), '$0.00', "can formatcurrency with alphabetical characters only (issue #20)"); 
		});
	});
	
	test("can format US currency", function() {
		// refreshes with textbox caused test to fail
		// I'm resetting it before it runs
		$('.UStext').val('1000');
		testFormat('.UStext', {}, function() {		
			equals(this.val(), '$1,000.00', 'US to a textbox'); 
		});
		
		testFormat('.US', {}, function() {		
			equals(this.html(), '$1,000.00', 'US to dom element'); 
		});
		
		testFormat('.UScents', {}, function() {		
			equals(this.html(), '$1,000.50', 'US with cents'); 
		});
		
		testFormat('.UScents-pennies', {}, function() {		
			equals(this.html(), '$1,000.05', 'US with pennies only cents'); 
		});	
		
		testFormat('.USformatted', {}, function() {		
			equals(this.html(), '$1,000.05', 'US that is already formatted'); 
		});	
		
		testFormat('.USneg', {}, function() {		
			equals(this.html(), '($1,000.00)', 'US negative'); 
		});	
		
		testFormat('.USextra-decimals-roundDown', {}, function() {
			equals(this.html(), '$1,000.05', 'US with extra decimals rounded down');
		});

		testFormat('.USextra-decimals-roundUp', {}, function() {
			equals(this.html(), '$1,000.06', 'US with extra decimals rounds up'); 
		});
		
		testFormat('.USwith-chars', {}, function() {		
			equals(this.html(), '$1,000.05', 'US with characters'); 
		});
		
		testFormat('.USwith-chars-end', {}, function() {		
			equals(this.html(), '$1,000.05', 'US with characters at end'); 
		});	
		
		testFormat('.USwith-chars-mid', {}, function() {		
			equals(this.html(), '$1,000.05', 'US with characters in middle'); 
		});	
		
		testFormat('.USmillions', {}, function() {		
			equals(this.html(), '$1,000,000.00', 'US millions'); 
		});	
		
	}); 
	
	test("can format DE currency", function() { 
		testFormat('.DE', { region: 'de' }, function() {		
			equals(this.html(), '1.000,00 €', 'DE'); 
		});	
		
		testFormat('.DEwithSymbol', { region: 'de' }, function() {		
			equals(this.html(), '1.000,00 €', 'DE already formatted'); 
		});	
		
		testFormat('.DEdecimal', { region: 'de' }, function() {		
			equals(this.html(), '1.000,33 €', 'DE with decimal'); 
		});	
		
		testFormat('.DEneg', { region: 'de' }, function() {		
			equals(this.html(), '-1.000,00 €', 'DE with negative'); 
		});	
	}); 
	
	test("can format en-IN currency", function() { 
		testFormat('.EnIN', { region: 'en-IN' }, function() {		
			equals(this.html(), 'Rs. 1,000.00', 'en-IN'); 
		});	
		
		testFormat('.EnINwithSymbol', { region: 'en-IN' }, function() {		
			equals(this.html(), 'Rs. 1,000.00', 'en-IN already formatted'); 
		});	
		
		testFormat('.EnINdecimal', { region: 'en-IN' }, function() {		
			equals(this.html(), 'Rs. 1,000.33', 'en-IN with decimal'); 
		});	
		
		testFormat('.EnINneg', { region: 'en-IN' }, function() {		
			equals(this.html(), 'Rs. -1,000.00', 'en-IN with negative'); 
		});	
	});
	
	test("can format FR currency", function() { 
		testFormat('.FR', { region: 'fr' }, function() {		
			equals(this.html(), '1 000,00 €', 'FR'); 
		});	
		
		testFormat('.FRwithSymbol', { region: 'fr' }, function() {		
			equals(this.html(), '1 000,00 €', 'FR already formatted'); 
		});	
		
		testFormat('.FRdecimal', { region: 'fr' }, function() {		
			equals(this.html(), '1 000,33 €', 'FR with decimal'); 
		});	
		
		testFormat('.FRneg', { region: 'fr' }, function() {		
			equals(this.html(), '-1 000,00 €', 'FR with negative'); 
		});	
	}); 
	
	test("can format IT currency", function() { 
		testFormat('.IT', { region: 'it' }, function() {		
			equals(this.html(), '€ 1.000,00', 'IT'); 
		});	
		
		testFormat('.ITwithSymbol', { region: 'it' }, function() {		
			equals(this.html(), '€ 1.000,00', 'IT already formatted'); 
		});	
		
		testFormat('.ITdecimal', { region: 'it' }, function() {		
			equals(this.html(), '€ 1.000,33', 'IT with decimal'); 
		});	
		
		testFormat('.ITneg', { region: 'it' }, function() {		
			equals(this.html(), '-€ 1.000,00', 'IT with negative'); 
		});	
	}); 
	
	test("can format ES currency", function() { 
		testFormat('.ES', { region: 'es' }, function() {		
			equals(this.html(), '1.000,00 €', 'ES'); 
		});	
		
		testFormat('.ESwithSymbol', { region: 'es' }, function() {		
			equals(this.html(), '1.000,00 €', 'ES already formatted'); 
		});	
		
		testFormat('.ESdecimal', { region: 'es' }, function() {		
			equals(this.html(), '1.000,33 €', 'ES with decimal'); 
		});	
		
		testFormat('.ESneg', { region: 'es' }, function() {		
			equals(this.html(), '-1.000,00 €', 'ES with negative'); 
		});	
	}); 
	
	test("can format JA currency", function() { 
		testFormat('.JA', { region: 'ja' }, function() {		
			equals(this.html(), '¥1,000.00', 'JA'); 
		});	
		
		testFormat('.JAwithSymbol', { region: 'ja' }, function() {		
			equals(this.html(), '¥1,000.00', 'JA already formatted'); 
		});	
		
		testFormat('.JAdecimal', { region: 'ja' }, function() {		
			equals(this.html(), '¥1,000.33', 'JA with decimal'); 
		});	
		
		testFormat('.JAneg', { region: 'ja' }, function() {		
			equals(this.html(), '-¥1,000.00', 'JA with negative'); 
		});	
	}); 
	
	test("can format ZH currency", function() { 
		testFormat('.ZH', { region: 'zh' }, function() {		
			equals(this.html(), '¥1,000.00', 'JA'); 
		});	
		
		testFormat('.ZHwithSymbol', { region: 'zh' }, function() {		
			equals(this.html(), '¥1,000.00', 'ZH already formatted'); 
		});	
		
		testFormat('.ZHdecimal', { region: 'zh' }, function() {		
			equals(this.html(), '¥1,000.33', 'ZH with decimal'); 
		});	
		
		testFormat('.ZHneg', { region: 'zh' }, function() {		
			equals(this.html(), '¥-1,000.00', 'ZH with negative'); 
		});	
	}); 
	
	module('toNumber'); 
	test("can change US toNumber", function() { 
		
		$('.toVal').toNumber();
		equals($('.toVal').val(), '123', 'default'); 
		
		$('.toUS').toNumber();
		equals($('.toUS').html(), '1234.56', 'US html'); 
		
		$('.toUSwhole').toNumber();
		equals($('.toUSwhole').html(), '1000', 'US whole number'); 
		
		$('.toUSdecimal').toNumber();
		equals($('.toUSdecimal').html(), '1000.00', 'US decimal'); 
		
		$('.toUSchars').toNumber();
		equals($('.toUSchars').html(), '', 'US with chars'); 
		
		$('.toUSchars-end').toNumber();
		equals($('.toUSchars-end').html(), '100', 'US with chars at end'); 
		
		$('.toNumberFromNegative').toNumber();
		equals($('.toNumberFromNegative').html(), '-100', 'ToNumber from Negative'); 
		
		
		try
		{
			$([]).toNumber();
		}
		catch(e) {
			$('.toUSbad-element').html('fail-' + e);
		}
		equals($('.toUSbad-element').html(), 'pass', 'bad selector element still works'); 
		
	}); 
	
	test("can change DE toNumber", function() { 
		
		$('.toDE').toNumber({ region: 'de' });
		equals($('.toDE').html(), '1234,56', 'DE'); 
		
		$('.toDEformatted').toNumber({ region: 'de' });
		equals($('.toDEformatted').html(), '1234,56', 'DE formatted'); 
		
		$('.toDEwhole').toNumber({ region: 'de' });
		equals($('.toDEwhole').html(), '1000', 'DE whole number'); 
		
		$('.toDEdecimal').toNumber({ region: 'de' });
		equals($('.toDEdecimal').html(), '1000,11', 'DE decimal'); 
		
	}); 
	
	test("can change en-IN toNumber", function() { 
		
		$('.toEnIN').toNumber({ region: 'en-IN' });
		equals($('.toEnIN').html(), '1234.56', 'en-IN'); 
		
		$('.toEnINformatted').toNumber({ region: 'en-IN' });
		equals($('.toEnINformatted').html(), '1234.56', 'en-IN formatted'); 
		
		$('.toEnINwhole').toNumber({ region: 'en-IN' });
		equals($('.toEnINwhole').html(), '1000', 'en-IN whole number'); 
		
		$('.toEnINdecimal').toNumber({ region: 'en-IN' });
		equals($('.toEnINdecimal').html(), '1000.11', 'en-IN decimal'); 
		
	}); 
	
	module('asNumber'); 
	test("can get US asNumber", function() { 
		
		var val = 0;
		
		val = $('.asVal').asNumber();
		equals(val, 123, 'default'); 
		
		val = $('.asNoParse').asNumber({ parse:false });
		equals(val, '1234.56', 'parse:false'); 
		
		val = $('.asUS').asNumber();
		equals(val, 1234.56, 'US'); 
		
		val = $('.asUSwhole').asNumber({ parseType:'Int' });
		equals(val, 1000, 'US as int'); 
		
		val = $('.asUSwhole-lower').asNumber({ parseType:'int' });
		equals(val, 1000, 'US as int w/ lowercase parseType'); 
		
		val = $('.asUSdecimal').asNumber();
		equals(val, 1000.55, 'US with decimals'); 
		
		val = $('.asUSchars').asNumber();
		equals(val, 0, 'US with chars'); 
		
		val = $('.asUSchars-end').asNumber();
		equals(val, 100, 'US with chars at end'); 
		
		val = $('.asNumberFromNegative').asNumber();
		equals(val, -100, 'AsNumber from Negative'); 
		
		val = $('.asNumberFromNegative2').asNumber();
		equals(val, -100, 'AsNumber from Negative2'); 
		
		val = $('.asNumberFromFormatted').formatCurrency().asNumber();
		equals(val, -100, 'AsNumber from Negative formatted'); 
		
		try
		{
			val = $('.asUSbad-parse').asNumber({ parseType:'abc' });
		} catch(e){
			equals(e, 'invalid parseType', 'US with bad parse type'); 
		}
		
		try
		{
			$([]).asNumber();
		}
		catch(e) {
			$('.asUSbad-element').html('fail-' + e);
		}
		equals($('.asUSbad-element').html(), 'pass', 'bad selector element still works'); 
	}); 
	
	test("can get DE asNumber", function() { 
		
		var val = 0;
			
		val = $('.asDE').asNumber({ region: 'de' });
		equals(val, 1234.56, 'DE parse'); 
		
		val = $('.asDEformatted').asNumber({ region: 'de' });
		equals(val, 1234.56, 'DE formatted'); 
		
		val = $('.asDEwhole').asNumber({ region: 'de' });
		equals(val, 1000, 'DE whole'); 
		
		val = $('.asDEdecimal').asNumber({ region: 'de' });
		equals(val, 1000.11, 'DE decimal'); 
	
	}); 
	
	test("can get en-IN asNumber", function() { 
		
		var val = 0;
			
		val = $('.asEnIN').asNumber({ region: 'en-IN' });
		equals(val, 1234.56, 'en-IN parse'); 
		
		val = $('.asEnINformatted').asNumber({ region: 'en-IN' });
		equals(val, 1234.56, 'en-IN formatted'); 
		
		val = $('.asEnINwhole').asNumber({ region: 'en-IN' });
		equals(val, 1000, 'en-IN whole'); 
		
		val = $('.asEnINdecimal').asNumber({ region: 'en-IN' });
		equals(val, 1000.11, 'en-IN decimal'); 
	
	}); 
	
});
