# JDNConvertibleCalendar

## General Remarks

**Please note that this software is still in a early state of development. Currently only Gregorian and Julian calendars are supported.**

## Introduction

`JDNConvertibleCalendar` offers a convenient way to convert a given date to different calendar formats making use of Julian Day Count (JDC) and Julian Day Number (JDN). The Julian Day is
continuous count of days since the beginning of the Julian Period in 4713 BCE.
JDC contains a fraction that contains the daytime. It is to note that the JDC starts a noon with a fraction of .0 and midnight is at .5. For example the day with the date
27th of January 1987 starts with the JDC of 2446822.5 and ends with a JDC of 2446823.4999…. Hence noon is at 2446823.0 .
The corresponding JDN is at noon, that is for this example (27th of January 1987) at 2446823 .

Please note that this software uses the (astronomical) convention that BCE dates are represented as negative years and that the year zero (0) is used! This the year 1 BCE must be given as year 0,
and the year 2 BCE corresponds to -1 etc. .

Currently, Gregorian and Julian calendar are supported.

## Focus

The focus of this project is to provide a design or architecture that makes it easy to convert between calendar formats. It is, however, not primarily a library for astronomical algorithms. 
For now, we put the these methods in the module `JDNConvertibleConversionModule`.
We would like to make this an separate module which could be used with `JDNConvertibleCalendar` (see <https://github.com/dhlab-basel/JDNConvertibleCalendar/issues/1>).

## Design

`JDNConvertibleCalendar` is an abstract class that can be implemented for various calendar formats, provided that those can be converted from and to JDN. 

The abstract base class offers a generic way to convert from and to any of its subclasses. Also calculations based on JDN are already implemented in the base class (shifting of a given period to the future or the past).

All dates are treated as periods. This allows for the handling of different precisions.

## Adding more Calendar Formats

When adding a new subclass for `JDNConvertibleCalendar`, calendar specific methods have to be implemented, e.g., the conversion from and to JDN. Calendar specific methods are declared abstract in the base class and have to be implemented when making a subclass. The new subclass has to be added to `supportedCalendars` (configuration array) and `convertCalendar` (conversion method) in `JDNConvertibleCalendar`.

## Documentation

See <https://dhlab-basel.github.io/JDNConvertibleCalendar/docs/index.html>.

The HTML-documentation can also be built locally running `npm run builddocs` in the project root.

## Examples

For working examples, please see the tests in the test directory. Run the test with `npm test` from the project root.

## Known Problems

- The static configuration of how many months a year has per calendar may not be good enough for other calendars than Gregorian and Julian (lunar calendars). 
Maybe this has to be made a function that returns the number of months for a given year. This would make transposing by month more complicated.

## NPM Package

This project is available as an npm module: <https://www.npmjs.com/package/jdnconvertiblecalendar>.

## Integration in Angular Material

`JDNConvertibleCalendar` can used with Angular Material (<https://material.angular.io>). Please see <https://github.com/dhlab-basel/JDNConvertibleCalendarDateAdapter> for more details.

