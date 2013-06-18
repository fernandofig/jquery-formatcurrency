# Format Currency jQuery Plugin

This is a continuation / enhancement to [Ben Dewey's plugin with the same name](https://code.google.com/p/jquery-formatcurrency/). Most of the work is his', I've just added a few features and options, and fixed some small issues, so at least most credits goes to him.

## Usage

Refer to Ben's [wiki page](https://code.google.com/p/jquery-formatcurrency/wiki/Usage) on his google code page for basic usage. Once you've got the basics, read on for the additional options and features available on my version.

### Old / on-demand Usage

That's how you'd use it with the original plugin, as is documented on the wiki page mentioned above: calling the plugin on a jQuery element, passing options as needed, and the plugin then does a one-shot formatting just when you call it that way.

You can use the same options as on the original plugin, plus:

#### suppressCurrencySymbol (boolean, default: false)

Self-explanatory: doesn't include the Currency Symbol on the formatted output. It's basically a clearer alternative to specifying the option `symbol: ''`, with some modifications also to the formatting strings on the options **positiveFormat** and **negativeFormat** for consistency.

#### removeTrailingZerosOnDecimal (boolean, default: false)

On numbers with decimals, remove the trailing zeroes at the rightmost part of the decimal part, if any. e.g.:

```<span id="example">1223.40</span>
$("#element").formatCurrency({ roundToDecimalPlace: 2 });  // Outputs $1,223.40
$("#element").formatCurrency({ roundToDecimalPlace: 2, removeTrailingZerosOnDecimal: true });  // Outputs $1,223.4
```

#### parseAsFloat (boolean, default: false)

Assume the input value to be formatted is already in computer arithmetic format (i.e., no symbols, no group digits, only numbers and always "." as decimal separator). It's usually not necessary to set this as the plugin is pretty good at inferring which format the input value currently is, but it may be necessary with some currency formats.

### Live formatting

That's the main new feature on my version of this plugin. This could be achieved with the original plugin with some manual hooking of keypresses and blur events, but it was ugly and not very efficient, specially if you had many fields to format with different currency (or number) formats. Due to the nature of it, this method is tailored to usage on form input fields. You use it like this:

`$("element").formatCurrencyLive({ options... });`

On "options" you can use the same options as the standard formatCurrency method, plus a few more specific ones:

#### formatOnBlur (boolean, default: true)

Wether to format the element when it loses focus.

#### formatOnType (boolean, default: true)

Wether to trigger formating on the element at every keypress on the element when it's focused.

#### filterKeys (boolean, default: true)

Filters out any non-number and non-decimal-point-symbol when inputting data on the field. Essentially, it makes the field block (i.e. ignore) any key pressed on the field that isn't a number or decimal point.

#### roundToDecimalPlace set to -2

That option is also present on the original plugin, but it's extended on the context of Live formatting so that setting it to -2 blocks entering decimals entry entirely on the field - essentially by also filtering out the decimal point key, so it makes more sense only when filterKeys = true, but it will also work with filterKeys = false, it only means that typing decimals will trim off the decimal part once you leave the field.

#### decPointCharCodes (array)

This is an array with exactly 3 elements containing keycodes for **decimal points** in different contexts, with each element on the array representing each context, respectively:

* The key code for the keypress event
* The key code for the keyup event for the decimal point on the main keyboard
* The key code for the keyup event for the decimal point on the keypad

The key codes are numbers, you should seek a Javascript reference to understand their contexts and a table of reference for the codes for each key themselves - this is outside the scope of this documentation. This option is usually setup automatically by the plugin anyway, **_it's not meant to be used directly_**, it's just exposed if you have a very specific need.

**Note:** For the `formatCurrencyLive` method to be actually useful, you have to set at least one of the options formatOnBlur, formatOnType or filterKeys to true.

### "Static" methods

In addition to the jquery element-applied methods, there's now also "static methods" that you can call without the requirement of chaining from a jquery element, that takes input from any source, e.g. variables, and instead of outputting the formatted value on the element, it will return the formatted value directly as a string, so you can directly store it on a variable and/or do whatever you want. Those are:

#### $.getFormattedCurrency(expr, settings, returnMetadata)

The equivalent to $(...).formatCurrency().

* **expr** (string/number/etc): the expression to format;
* **settings** (object): the format settings, using the same options as formatCurrency;
* **returnMetadata** (boolean, default:false): instead of returning the value directly, returns an array containing, respectively:
 * The formatted value;
 * A boolean value specifying wether the input value contains decimals;
 * A string value containing the decimal part, if applicable;
 * A boolean value specifying wether the value is positive (true) or not;
 * The full settings object (i.e., the settings object provided on the parameter merged with the defaults) used to format the expression;

#### $.toNumber(expr, settings)

The equivalent to $(...).toNumber().

* **expr** (string/number/etc): the expression to format;
* **settings** (object): the format settings, using the same options as the original toNumber;

#### $.asNumber(expr, settings)

The equivalent to $(...).asNumber().

* **expr** (string/number/etc): the expression to convert;
* **settings** (object): the format settings, using the same options as the original asNumber;

### Defaults setters

There are methods to setup the default settings for each method on the plugin. Once these are called, all subsquent calls to the respective methods will use the new defaults, if no settings are provided. These are:

#### $.formatCurrency.setAllDefaults(settings)

This is a conveniency method that will set the defaults at once for all methods on the plugin: formatCurrency, formatCurrencyLive, toNumber and asNumber. Of course, not all settings options for a given method exists for other methods (e.g., "symbol" on formatCurrency is not applicable to the toNumber and asNumber methods), so you can pass all settings for all methods in the same object, and the setAllDefaults method will sort out which options belong on which method default, and which are applicable on all of them.

#### $.formatCurrency.setDefaults(settings)

Sets the default options for the formatCurrency method only

#### $.formatCurrencyLive.setDefaults(settings)

Sets the default options for the formatCurrencyLive method only

#### $.toNumber.setDefaults(settings)

Sets the default options for the toNumber method only

#### $.asNumber.setDefaults(settings)

Sets the default options for the asNumber method only

## Breaking changes

<sup>(Well, that should actually be "breaking change" for now, but who knows what's in the future for this? :-))</sup>

On the original plugin, setting eventOnDecimalsEntered to true would raise a custom "decimalsEntered" event only, and only IF, the number of decimal digits entered are greater than the decimal places configured with the option roundToDecimalPlace. With my version, if eventOnDecimalsEntered  = true, the event is raised if any number of decimal digits is entered. I made this change because the previous behavior was confusing and inconsistent at first glance. If you need to check decimal part digits, you can still do it by using the second parameter on the callback function for the event, which will contain the decimals entered.