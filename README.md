# JDNConvertibleCalendar

## General Remarks

**Please note that this software is still in a very early state of development. Its existing functionality hasn't been properly tested yet.**

## Introduction

`JDNConvertibleCalendar` offers a conventient way to convert a given date to different calendar formats making use of Julian Day Number (JDN). 

Currently, Gregorian and Julian calendar are supported.

## Focus

The focus of this project is to provide a design or archictecture distributed as an `npm` module that makes it easy to convert between calendar formats. It is, however, not primarily a library for astronomical algorithms. For now, we put the these methods in the module `JDNConvertibleConversion` which is basically a (partial) reimplementation in TypeScript of what you find at <https://www.fourmilab.ch/documents/calendar>. We would like to make this an separate module which could be used with `JDNConvertibleCalendar` (see <https://github.com/dhlab-basel/JDNConvertibleCalendar/issues/1>). 

## Known Problems

- I am pretty sure that here are still some problems with the rounding of JDC (which includes a fraction for daytime) to JDN. See <https://github.com/dhlab-basel/JDNConvertibleCalendar/issues/2>.

- The static configuration of how many months a year has per calendar may not be good enough for other calendars than Gregorian and Julian. Maybe this has to be made a function that returns the number of months for a given year. This would make transposing by month more complicated.

## Design

`JDNConvertibleCalendar` is an abstract class that can be implemented for various calendar formats, provided that those can be converted from and to JDN. 

The abstract base class offers a generic way to convert from and to any of its subclasses. Also calculations based on JDN are already implemented in the base class (shifting of a given period to the future or the past).

All dates are treated as periods. This allows for the handling of different precisions.

## Adding more Calendar Formats

When adding a new subclass, calendar specific methods have to be implemented, e.g., the conversion from and to JDN. Calendar specific methods are declared abstract in the base class and have to be implemented when making a subclass.

## Documentation

See <https://dhlab-basel.github.io/JDNConvertibleCalendar/docs/index.html>.

The HTML-documentation can also be built locally running `npm run-script builddocs` in the project root.

## Examples

For working examples, please see the tests in the test directory. Run the test with `npm test` from the project root. 