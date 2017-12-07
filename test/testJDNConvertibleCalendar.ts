import {JDNConvertibleCalendar} from "../src/JDNConvertibleCalendar";
import CalendarDate = JDNConvertibleCalendar.CalendarDate;

let assert = require('assert');

/*

    Test conversion functions

 */

let gregorianCalendarDate1 = new CalendarDate(2017, 12, 6);
const jdn1: number = JDNConvertibleCalendar.JDNCalendarConversion.gregorianToJDN(gregorianCalendarDate1);

assert.strictEqual(jdn1, 2458094, `Conversion of Gregorian date to JDN failed`);

const gregorianCalendarDate1_ = JDNConvertibleCalendar.JDNCalendarConversion.JDNToGregorian(jdn1);

assert.strictEqual(gregorianCalendarDate1_.year, gregorianCalendarDate1.year, `Conversion of JDN to Gregorian date failed: year`);
assert.strictEqual(gregorianCalendarDate1_.month, gregorianCalendarDate1.month, `Conversion of JDN to Gregorian date failed: month`);
assert.strictEqual(gregorianCalendarDate1_.day, gregorianCalendarDate1.day, `Conversion of JDN to Gregorian date failed: day`);

