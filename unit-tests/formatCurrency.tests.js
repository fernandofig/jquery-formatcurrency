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
	// module('formatCurrency plugin'); 
	
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
		
    testFormat('.roundToDecimalPlace3', { roundToDecimalPlace:3}, function() {
        equals(this.html(), '$123.000', "roundToDecimalPlace: 3");
    });

    testFormat('.roundToDecimalPlace0', { roundToDecimalPlace:0}, function() {
        equals(this.html(), '$124', "roundToDecimalPlace: 0");
    });

    testFormat('.roundToDecimalPlace9', { roundToDecimalPlace:1}, function() {
        equals(this.html(), '$123.9', "roundToDecimalPlace: 1");
    });

    testFormat('.roundToDecimalPlace_-1', { roundToDecimalPlace:-1}, function() {
        equals(this.html(), '$123.456', "roundToDecimalPlace: -1");
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

		testFormat('.dropDecimals', { dropDecimals: true }, function() {		
			equals(this.html(), '$123', "dropDecimal: true"); 
		});
		
		testFormat('.dropDecimalsRounding', { dropDecimals: true }, function() {		
			equals(this.html(), '$123', "dropDecimal: true (roundDown)"); 
		});
		
		testFormat('.positiveFormat', { positiveFormat:'%s - %n'}, function() {		
			equals(this.html(), '$ - 123.00', "positiveFormat: '%s - %n'"); 
		});
		
		testFormat('.negativeFormat', { negativeFormat:'neg %s - %n'}, function() {		
			equals(this.html(), 'neg $ - 123.00', "negativeFormat: 'neg %s - %n'"); 
		});
		
    testFormat('.doNotRound', {}, function() {
        equals(this.html(), '$9.45', "doNotRound"); 
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
	});
	
	test("can format US currency", function() { 					
		// refreshes with textbox caused test to fail.  
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
	
});