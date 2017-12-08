# JDNConvertibleCalendar

**Please note that this software is still in a very early state of development. Its existing functionality hasn't been properly tested yet.**

## Introduction

Different calendar formats may be freely converted using Julian Day Number.

`JDNConvertibleCalendar` is an abstract class that can be implemented for concrete calendar formats.
Currently Gregorian and Julian calendar are implemented.

The abstract parent class offers a generic way to convert from and to any of its subclasses making use of Julian Day Number.

All dates are treated as periods. This allows for the handling of different precisions.

## Ongoing Work

For now, instances of implementations of `JDNConvertibleCalendar` cannot be manipulated (changing a date). This is the next feature that is going to be added.

## Examples

For working examples, please see the tests in the test directory.