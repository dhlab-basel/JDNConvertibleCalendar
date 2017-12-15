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
import CalendarDate = JDNConvertibleCalendar.CalendarDate;
import {JDNConvertibleConversion} from "../src/JDNCalendarConversion";
import GregorianCalendarDate = JDNConvertibleCalendar.GregorianCalendarDate;
import JDNPeriod = JDNConvertibleCalendar.JDNPeriod;
import JulianCalendarDate = JDNConvertibleCalendar.JulianCalendarDate;

let assert = require('assert');

describe('JDN conversions to Gregorian calendar format and back', () => {
    it('convert the Gregorian Calendar date 06-12-2017 to JDN', () => {
        const gregorianCalendarDate1: CalendarDate = new CalendarDate(2017, 12, 6);
        const jdn: number = JDNConvertibleConversion.gregorianToJDN(gregorianCalendarDate1);

        assert.strictEqual(jdn, 2458094, `Conversion of Gregorian date to JDN failed`);
    });

    it('convert the JDN 2458094 back to the Gregorian Calendar date 06-12-2017', () => {
        const gregorianDate = JDNConvertibleConversion.JDNToGregorian(2458094);

        assert.strictEqual(gregorianDate.year, 2017, `Conversion of JDN to Gregorian date failed: year`);
        assert.strictEqual(gregorianDate.month, 12, `Conversion of JDN to Gregorian date failed: month`);
        assert.strictEqual(gregorianDate.day, 6, `Conversion of JDN to Gregorian date failed: day`);
    });

    it('convert the Gregorian Calendar date 31-12-2016 to JDN', () => {
        const gregorianCalendarDate1: CalendarDate = new CalendarDate(2016, 12, 31);
        const jdn: number = JDNConvertibleConversion.gregorianToJDN(gregorianCalendarDate1);

        assert.strictEqual(jdn, 2457754, `Conversion of Gregorian date to JDN failed`);
    });

    it('convert the JDN 2457754 back to the Gregorian Calendar date 31-12-2016', () => {
        const gregorianDate = JDNConvertibleConversion.JDNToGregorian(2457754);

        assert.strictEqual(gregorianDate.year, 2016, `Conversion of JDN to Gregorian date failed: year`);
        assert.strictEqual(gregorianDate.month, 12, `Conversion of JDN to Gregorian date failed: month`);
        assert.strictEqual(gregorianDate.day, 31, `Conversion of JDN to Gregorian date failed: day`);
    });

});

describe('JDN conversions to Julian calendar format and back', () => {

    it('convert the Julian Calendar date 2017-11-23 to JDN', () => {

        const julianCalendarDate2: CalendarDate = new CalendarDate(2017, 11, 23);
        const jdn = JDNConvertibleConversion.julianToJDN(julianCalendarDate2);

        assert.strictEqual(jdn, 2458094, `Conversion of Julian date to JDN failed`);
    });

    it('convert the JDN 2458094 back to the Julian Calendar date 23-11-2017', () => {
        const julianCalendarDate = JDNConvertibleConversion.JDNToJulian(2458094);

        assert.strictEqual(julianCalendarDate.year, 2017, `Conversion of JDN to Julian date failed: year`);
        assert.strictEqual(julianCalendarDate.month, 11, `Conversion of JDN to Julian date failed: month`);
        assert.strictEqual(julianCalendarDate.day, 23, `Conversion of JDN to Julian date failed: day`);
    });

});

describe('Conversions from JDN to Gregorian and Julian calendar format an in between conversions', () => {

    it('create a Gregorian date from JDN using an example from Meeus', () => {

        // see sample calculation in Jean Meeus: Astronomical Algorithms, 1998, p. 65.

        const gregorianCalendar = new GregorianCalendarDate(new JDNPeriod(2434924, 2434924));

        const gregorianCalendarDate: JDNConvertibleCalendar.CalendarPeriod = gregorianCalendar.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarDate.periodStart.year, 1954, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarDate.periodStart.month, 6, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarDate.periodStart.day, 30, `calendar period wrong: day`);
        assert.strictEqual(gregorianCalendarDate.periodStart.dayOfWeek, 3, `calendar period wrong: day of week`);

        assert.strictEqual(gregorianCalendarDate.periodEnd.year, 1954, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarDate.periodEnd.month, 6, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarDate.periodEnd.day, 30, `calendar period wrong: day`);
        assert.strictEqual(gregorianCalendarDate.periodEnd.dayOfWeek, 3, `calendar period wrong: day of week`);

    });

    it('create a Julian date from JDN using an example from Meeus', () => {

        // see sample calculation in Jean Meeus: Astronomical Algorithms, 1998, p. 65.

        const julianCalendar = new JulianCalendarDate(new JDNPeriod(2434924, 2434924));

        const julianCalendarDate = julianCalendar.toCalendarPeriod();

        assert.strictEqual(julianCalendarDate.periodStart.year, 1954, `calendar period wrong: year`);
        assert.strictEqual(julianCalendarDate.periodStart.month, 6, `calendar period wrong: month`);
        assert.strictEqual(julianCalendarDate.periodStart.day, 17, `calendar period wrong: day`);
        assert.strictEqual(julianCalendarDate.periodStart.dayOfWeek, 3, `calendar period wrong: day of week`);

        assert.strictEqual(julianCalendarDate.periodEnd.year, 1954, `calendar period wrong: year`);
        assert.strictEqual(julianCalendarDate.periodEnd.month, 6, `calendar period wrong: month`);
        assert.strictEqual(julianCalendarDate.periodEnd.day, 17, `calendar period wrong: day`);
        assert.strictEqual(julianCalendarDate.periodEnd.dayOfWeek, 3, `calendar period wrong: day of week`);

    });

    it('convert a Gregorian date into a Julian date', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        const gregorianCalendarPeriod: JDNConvertibleCalendar.CalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 6, `calendar period wrong: day`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.dayOfWeek, 3, `Conversion of JDN to Gregorian date failed: day of week`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 6, `calendar period wrong: day`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.dayOfWeek, 3, `Conversion of JDN to Gregorian date failed: day of week`);

        const julianDate: JDNConvertibleCalendar.JDNConvertibleCalendar = gregorianDate.convertCalendar('Julian');

        const jdnPeriod = julianDate.toJDNPeriod();

        assert.strictEqual(jdnPeriod.periodStart, jdn, `start of JDN period wrong`);
        assert.strictEqual(jdnPeriod.periodEnd, jdn, `end of JDN period wrong`);

        const julianCalendarPeriod = julianDate.toCalendarPeriod();

        assert.strictEqual(julianCalendarPeriod.periodStart.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(julianCalendarPeriod.periodStart.month, 11, `calendar period wrong: month`);
        assert.strictEqual(julianCalendarPeriod.periodStart.day, 23, `calendar period wrong: day`);
        assert.strictEqual(julianCalendarPeriod.periodStart.dayOfWeek, 3, `Conversion of JDN to Gregorian date failed: day of week`);

        assert.strictEqual(julianCalendarPeriod.periodEnd.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(julianCalendarPeriod.periodEnd.month, 11, `calendar period wrong: month`);
        assert.strictEqual(julianCalendarPeriod.periodEnd.day, 23, `calendar period wrong: day`);
        assert.strictEqual(julianCalendarPeriod.periodEnd.dayOfWeek, 3, `Conversion of JDN to Gregorian date failed: day of week`);

    });




});


describe('Get the number of days for a given month', () => {

    it('create a Gregorian date and get the number of days for a given Gregorian date\'s month', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        const days: number = gregorianDate.daysInMonth(new CalendarDate(2017, 2, 15));

        assert.strictEqual(days, 28, `wrong number of days`)

    });

    it('create a Julian date and get the number of days for a given Julian\'s date\'s month', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const julianDate = new JulianCalendarDate(new JDNPeriod(jdn, jdn));

        const days: number = julianDate.daysInMonth(new CalendarDate(2017, 2, 15));

        assert.strictEqual(days, 28, `wrong number of days`)

    });


});

describe('Create a Gregorian date and transpose it by a given number of days', () => {

    it('create a Gregorian date and shift it 365 days into the future', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByDay(365);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2018, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 6, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2018, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 6, `calendar period wrong: day`);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        assert.strictEqual(jdn + 365, jdnPeriod.periodStart, `start of JDN period wrong`);
        assert.strictEqual(jdn + 365, jdnPeriod.periodEnd, `end of JDN period wrong`);

    });

    it('create a Gregorian date and shift it 365 days into the past', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByDay(-365);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2016, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 6, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2016, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 6, `calendar period wrong: day`);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        assert.strictEqual(jdn - 365, jdnPeriod.periodStart, `start of JDN period wrong`);
        assert.strictEqual(jdn - 365, jdnPeriod.periodEnd, `end of JDN period wrong`);

    });
});

describe('Create a Gregorian date and transpose it by a given number of years', () => {

    it('create a Gregorian date and shift it one year into the future', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByYear(1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2018, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 6, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2018, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 6, `calendar period wrong: day`);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        assert.strictEqual(jdn + 365, jdnPeriod.periodStart, `start of JDN period wrong`);
        assert.strictEqual(jdn + 365, jdnPeriod.periodEnd, `end of JDN period wrong`);

    });

    it('create a Gregorian date and shift it one year into the past', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByYear(-1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2016, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 6, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2016, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 6, `calendar period wrong: day`);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        assert.strictEqual(jdn - 365, jdnPeriod.periodStart, `start of JDN period wrong`);
        assert.strictEqual(jdn - 365, jdnPeriod.periodEnd, `end of JDN period wrong`);

    });
});

describe('Create a Gregorian date and transpose it by a given number of months', () => {

    it('create a Gregorian date and shift it one month into the future', () => {

        // Gregorian Calendar date 31-12-2017
        const jdn = 2458119;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByMonth(1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2018, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 1, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 31, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2018, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 1, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 31, `calendar period wrong: day`);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        assert.strictEqual(jdn + 31, jdnPeriod.periodStart, `start of JDN period wrong`);
        assert.strictEqual(jdn + 31, jdnPeriod.periodEnd, `end of JDN period wrong`);

    });

    it('create a Gregorian date and shift it one month into the past', () => {

        // Gregorian Calendar date 31-12-2017
        const jdn = 2458119;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByMonth(-1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 11, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 30, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 11, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 30, `calendar period wrong: day`);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        assert.strictEqual(jdn - 31, jdnPeriod.periodStart, `start of JDN period wrong`);
        assert.strictEqual(jdn - 31, jdnPeriod.periodEnd, `end of JDN period wrong`);

    });
});

describe('Create a JDNPeriod', () => {


    it('attempt to create a JDN with invalid args: non integers', () => {

        assert.throws(
            () => {new JDNPeriod(1.1, 2)
            },
            function(err) {
                if ((err instanceof Error) && err.message === 'JDNs are expected to be integers') {
                    return true;
                }
            }
        );

    });

    it('attempt to create a JDN with invalid args: end greater than start', () => {

        assert.throws(
            () => {new JDNPeriod(2, 1)
            },
            function(err) {

                if ((err instanceof Error) && err.message === 'start of a JDNPeriod must not be greater than its end') {
                    return true;
                }
            }
        );

    });


});

