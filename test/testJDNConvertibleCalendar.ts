import {JDNConvertibleCalendar} from "../src/JDNConvertibleCalendar";
import CalendarDate = JDNConvertibleCalendar.CalendarDate;
import GregorianCalendar = JDNConvertibleCalendar.GregorianCalendar;
import JDNPeriod = JDNConvertibleCalendar.JDNPeriod;

let assert = require('assert');

/*
    Test conversion functions
 */


// convert a Gregorian calendar date to JDN and back
const gregorianCalendarDate1: CalendarDate = new CalendarDate(2017, 12, 6);
const jdn1: number = JDNConvertibleCalendar.JDNCalendarConversion.gregorianToJDN(gregorianCalendarDate1);

assert.strictEqual(jdn1, 2458094, `Conversion of Gregorian date to JDN failed: ${jdn1} given instead of 2458094`);

const gregorianCalendarDate1_: CalendarDate = JDNConvertibleCalendar.JDNCalendarConversion.JDNToGregorian(jdn1);

assert.strictEqual(gregorianCalendarDate1_.year, gregorianCalendarDate1.year, `Conversion of JDN to Gregorian date failed: year`);
assert.strictEqual(gregorianCalendarDate1_.month, gregorianCalendarDate1.month, `Conversion of JDN to Gregorian date failed: month`);
assert.strictEqual(gregorianCalendarDate1_.day, gregorianCalendarDate1.day, `Conversion of JDN to Gregorian date failed: day`);

// convert a Julian calendar date to JDN and back
const julianCalendarDate2 = new CalendarDate(2017, 11, 23);
const jdn2 = JDNConvertibleCalendar.JDNCalendarConversion.julianToJDN(julianCalendarDate2);

assert.strictEqual(jdn2, 2458094, `Conversion of Julian date to JDN failed: ${jdn2} given instead of 2458094`);

const julianCalendarDate2_ = JDNConvertibleCalendar.JDNCalendarConversion.JDNToJulian(jdn2);

assert.strictEqual(julianCalendarDate2_.year, julianCalendarDate2.year, `Conversion of JDN to Julian date failed: year`);
assert.strictEqual(julianCalendarDate2_.month, julianCalendarDate2.month, `Conversion of JDN to Julian date failed: month`);
assert.strictEqual(julianCalendarDate2_.day, julianCalendarDate2.day, `Conversion of JDN to Julian date failed: day`);

// instantiate a GregorianCalendar and convert it to a JulianCalendar
const gregorianCalendar3 = new GregorianCalendar(new JDNPeriod(2458094, 2458094));

const julianCalendar3: JDNConvertibleCalendar.JDNConvertibleCalendar = gregorianCalendar3.convertCalendar('Julian');

const jdnPeriod3: JDNPeriod = julianCalendar3.toJDN();

assert.strictEqual(jdnPeriod3.jdnStart, 2458094, `Conversion to JDNPeriod failed: start`);
assert.strictEqual(jdnPeriod3.jdnEnd, 2458094, `Conversion to JDNPeriod failed: end`);
