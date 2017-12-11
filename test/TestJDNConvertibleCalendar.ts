/*
 * Copyright © 2017 Lukas Rosenthaler, Benjamin Geer, Ivan Subotic,
 * Tobias Schweizer, André Kilchenmann, and Sepideh Alassi.
 *
 * This file is part of JDNConvertibleCalendar.
 *
 * JDNConvertibleCalendar is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JDNConvertibleCalendar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with JDNConvertibleCalendar.  If not, see <http://www.gnu.org/licenses/>.
 */

import {JDNConvertibleCalendar} from "../src/JDNConvertibleCalendar";
import {JDNConvertibleConversion} from "../src/JDNCalendarConversion";
import CalendarDate = JDNConvertibleCalendar.CalendarDate;
import GregorianCalendar = JDNConvertibleCalendar.GregorianCalendarDate;
import JDNPeriod = JDNConvertibleCalendar.JDNPeriod;
import JulianCalendar = JDNConvertibleCalendar.JulianCalendarDate;

let assert = require('assert');

/*
    Test conversion functions
 */


// convert a Gregorian calendar date to JDN and back
const gregorianCalendarDate1: CalendarDate = new CalendarDate(2017, 12, 6);
const jdn1: number = JDNConvertibleConversion.JDNCalendarConversion.gregorianToJDN(gregorianCalendarDate1);

assert.strictEqual(jdn1, 2458094, `Conversion of Gregorian date to JDN failed: ${jdn1} given instead of 2458094`);

const gregorianCalendarDate1_: CalendarDate = JDNConvertibleConversion.JDNCalendarConversion.JDNToGregorian(jdn1);

assert.strictEqual(gregorianCalendarDate1_.year, gregorianCalendarDate1.year, `Conversion of JDN to Gregorian date failed: year`);
assert.strictEqual(gregorianCalendarDate1_.month, gregorianCalendarDate1.month, `Conversion of JDN to Gregorian date failed: month`);
assert.strictEqual(gregorianCalendarDate1_.day, gregorianCalendarDate1.day, `Conversion of JDN to Gregorian date failed: day`);

// convert a Julian calendar date to JDN and back
const julianCalendarDate2 = new CalendarDate(2017, 11, 23);
const jdn2 = JDNConvertibleConversion.JDNCalendarConversion.julianToJDN(julianCalendarDate2);

assert.strictEqual(jdn2, 2458094, `Conversion of Julian date to JDN failed: ${jdn2} given instead of 2458094`);

const julianCalendarDate2_: CalendarDate = JDNConvertibleConversion.JDNCalendarConversion.JDNToJulian(jdn2);

assert.strictEqual(julianCalendarDate2_.year, julianCalendarDate2.year, `Conversion of JDN to Julian date failed: year`);
assert.strictEqual(julianCalendarDate2_.month, julianCalendarDate2.month, `Conversion of JDN to Julian date failed: month`);
assert.strictEqual(julianCalendarDate2_.day, julianCalendarDate2.day, `Conversion of JDN to Julian date failed: day`);

// instantiate a GregorianCalendarDate and convert it to a JulianCalendarDate
const gregorianCalendar3 = new GregorianCalendar(new JDNPeriod(2458094, 2458094));

const gregorianCalendarPeriod3 = gregorianCalendar3.toCalendarPeriod();

assert.strictEqual(gregorianCalendarPeriod3.periodStart.year, 2017, `calendar period wrong: year`);
assert.strictEqual(gregorianCalendarPeriod3.periodStart.month, 12, `calendar period wrong: month`);
assert.strictEqual(gregorianCalendarPeriod3.periodStart.day, 6, `calendar period wrong: day`);

assert.strictEqual(gregorianCalendarPeriod3.periodEnd.year, 2017, `calendar period wrong: year`);
assert.strictEqual(gregorianCalendarPeriod3.periodEnd.month, 12, `calendar period wrong: month`);
assert.strictEqual(gregorianCalendarPeriod3.periodEnd.day, 6, `calendar period wrong: day`);


const julianCalendar3: JDNConvertibleCalendar.JDNConvertibleCalendar = gregorianCalendar3.convertCalendar('Julian');

const julianCalendarPeriod3 = julianCalendar3.toCalendarPeriod();

assert.strictEqual(julianCalendarPeriod3.periodStart.year, 2017, `calendar period wrong: year`);
assert.strictEqual(julianCalendarPeriod3.periodStart.month, 11, `calendar period wrong: month`);
assert.strictEqual(julianCalendarPeriod3.periodStart.day, 23, `calendar period wrong: day`);

assert.strictEqual(julianCalendarPeriod3.periodEnd.year, 2017, `calendar period wrong: year`);
assert.strictEqual(julianCalendarPeriod3.periodEnd.month, 11, `calendar period wrong: month`);
assert.strictEqual(julianCalendarPeriod3.periodEnd.day, 23, `calendar period wrong: day`);

const jdnPeriod3: JDNPeriod = julianCalendar3.toJDNPeriod();

assert.strictEqual(jdnPeriod3.periodStart, 2458094, `Conversion to JDNPeriod failed: start`);
assert.strictEqual(jdnPeriod3.periodEnd, 2458094, `Conversion to JDNPeriod failed: end`);

// instantiate a JulianCalendarDate and convert it to a GregorianCalendarDate
const julianCalendar4 = new JulianCalendar(new JDNPeriod(2458094, 2458094));

const gregorianCalendar4: JDNConvertibleCalendar.JDNConvertibleCalendar = julianCalendar4.convertCalendar('Gregorian');

const jdnPeriod4: JDNPeriod = gregorianCalendar4.toJDNPeriod();

assert.strictEqual(jdnPeriod4.periodStart, 2458094, `Conversion to JDNPeriod failed: start`);
assert.strictEqual(jdnPeriod4.periodEnd, 2458094, `Conversion to JDNPeriod failed: end`);

// create a Gregorian date and transpose it

const gregorianCalendarDate5: CalendarDate = new CalendarDate(2017, 12, 6);
const jdn5: number = JDNConvertibleConversion.JDNCalendarConversion.gregorianToJDN(gregorianCalendarDate5);

const gregorianCalendar5 = new GregorianCalendar(new JDNPeriod(jdn5, jdn5));

// shift date 365 into the future
gregorianCalendar5.transposePeriod(365);

const gregorianCalendarPeriod5 = gregorianCalendar5.toCalendarPeriod();

assert.strictEqual(gregorianCalendarPeriod5.periodStart.year, 2018, `calendar period wrong: year`);
assert.strictEqual(gregorianCalendarPeriod5.periodStart.month, 12, `calendar period wrong: month`);
assert.strictEqual(gregorianCalendarPeriod5.periodStart.day, 6, `calendar period wrong: day`);

assert.strictEqual(gregorianCalendarPeriod5.periodEnd.year, 2018, `calendar period wrong: year`);
assert.strictEqual(gregorianCalendarPeriod5.periodEnd.month, 12, `calendar period wrong: month`);
assert.strictEqual(gregorianCalendarPeriod5.periodEnd.day, 6, `calendar period wrong: day`);

// instantiate a JDNPeriod with invalid arguments
assert.throws(
    () => {new JDNPeriod(1.1, 2)
    },
    function(err) {
        if ((err instanceof Error) && err.message === 'JDNs are expected to be integers') {
            return true;
        }
    }
);

