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
import JulianCalendarDate = JDNConvertibleCalendar.JulianCalendarDate;

let assert = require('assert');

/**
 * Checks if the received calendar date corresponds to the expected calendar date.
 *
 * @param {JDNConvertibleCalendar.CalendarDate} expected expected calendar date.
 * @param {JDNConvertibleCalendar.CalendarDate} received received calendar date.
 */
const checkCalendarDate = (expected: CalendarDate, received: CalendarDate) => {

    assert.strictEqual(received.year, expected.year, `calendar date is wrong: year is ${received.year} instead of ${expected.year}`);
    assert.strictEqual(received.month, expected.month, `calendar date is wrong: month is ${received.month} instead of ${expected.month}`);
    assert.strictEqual(received.day, expected.day, `calendar date is wrong: day is ${received.day} instead of ${expected.day}`);
    assert.strictEqual(received.dayOfWeek, expected.dayOfWeek, `calendar date is wrong: day of week is ${received.dayOfWeek} instead of ${expected.dayOfWeek}`);

};

/**
 * Checks if the received JDN correspons to the expected JDN.
 *
 * @param {number} expected expected JDN.
 * @param {number} received received JDN.
 */
const checkJDN = (expected: number, received: number) => {

    // make sure that the received JDN has no fraction
    assert.strictEqual(Math.floor(received), received, `JDN contains a fraction: ${received}`);

    assert.strictEqual(received, expected, `JDN is wrong: received JDN is ${received} instead of ${expected}`);
};

describe('JDN conversions to Gregorian calendar format and back', () => {
    it('convert the Gregorian Calendar date 06-12-2017 to JDN', () => {
        const gregorianCalendarDate1: CalendarDate = new CalendarDate(2017, 12, 6);
        const jdn: number = JDNConvertibleConversion.gregorianToJDN(gregorianCalendarDate1);

        checkJDN(2458094, jdn);
    });

    it('convert the JDN 2458094 back to the Gregorian Calendar date 06-12-2017', () => {
        const gregorianDate = JDNConvertibleConversion.JDNToGregorian(2458094);

        const expectedDate = new CalendarDate(2017, 12, 6);

        checkCalendarDate(expectedDate, gregorianDate);
    });

    it('convert the Gregorian Calendar date 31-12-2016 to JDN', () => {
        const gregorianCalendarDate1: CalendarDate = new CalendarDate(2016, 12, 31);
        const jdn: number = JDNConvertibleConversion.gregorianToJDN(gregorianCalendarDate1);

        checkJDN(2457754, jdn);
    });

    it('convert the JDN 2457754 back to the Gregorian Calendar date 31-12-2016', () => {
        const gregorianDate = JDNConvertibleConversion.JDNToGregorian(2457754);

        const expectedDate = new CalendarDate(2016, 12, 31);

        checkCalendarDate(expectedDate, gregorianDate);
    });

});

describe('JDN conversions to Julian calendar format and back', () => {

    it('convert the Julian Calendar date 2017-11-23 to JDN', () => {

        const julianCalendarDate2: CalendarDate = new CalendarDate(2017, 11, 23);
        const jdn = JDNConvertibleConversion.julianToJDN(julianCalendarDate2);

        checkJDN(2458094, jdn);
    });

    it('convert the JDN 2458094 back to the Julian Calendar date 23-11-2017', () => {
        const julianCalendarDate = JDNConvertibleConversion.JDNToJulian(2458094);

        const expectedDate = new CalendarDate(2017, 11, 23);

        checkCalendarDate(expectedDate, julianCalendarDate);
    });

});

describe('Conversions from JDN to Gregorian and Julian calendar format an in between conversions', () => {

    it('create a Gregorian date from JDN using an example from Meeus', () => {

        // see sample calculation in Jean Meeus: Astronomical Algorithms, 1998, p. 65.

        const gregorianCalendar = new GregorianCalendarDate(new JDNPeriod(2434924, 2434924));

        const gregorianCalendarPeriod: JDNConvertibleCalendar.CalendarPeriod = gregorianCalendar.toCalendarPeriod();

        const expectedDate = new CalendarDate(1954, 6, 30, 3);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

    });

    it('create a Julian date from JDN using an example from Meeus', () => {

        // see sample calculation in Jean Meeus: Astronomical Algorithms, 1998, p. 65.

        const julianCalendar = new JulianCalendarDate(new JDNPeriod(2434924, 2434924));

        const julianCalendarPeriod = julianCalendar.toCalendarPeriod();

        const expectedDate = new CalendarDate(1954, 6, 17, 3);

        checkCalendarDate(expectedDate, julianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, julianCalendarPeriod.periodEnd);

    });

    it('convert a Gregorian date into a Julian date', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        const gregorianCalendarPeriod: JDNConvertibleCalendar.CalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedGregorianDate = new CalendarDate(2017, 12, 6, 3);

        checkCalendarDate(expectedGregorianDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedGregorianDate, gregorianCalendarPeriod.periodEnd);

        const julianDate: JDNConvertibleCalendar.JDNConvertibleCalendar = gregorianDate.convertCalendar('Julian');

        const jdnPeriod = julianDate.toJDNPeriod();

        checkJDN(jdn, jdnPeriod.periodStart);
        checkJDN(jdn, jdnPeriod.periodEnd);

        const julianCalendarPeriod = julianDate.toCalendarPeriod();

        const expectedJulianDate = new CalendarDate(2017, 11,23, 3);

        checkCalendarDate(expectedJulianDate, julianCalendarPeriod.periodStart);
        checkCalendarDate(expectedJulianDate, julianCalendarPeriod.periodEnd);

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

    it('create the Gregorian date 06-12-2017 and shift it 365 days into the future', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByDay(365);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2018, 12, 6, 4);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn + 365, jdnPeriod.periodStart);
        checkJDN(jdn + 365, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 06-12-2017 and shift it 365 days into the past', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByDay(-365);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2016, 12, 6, 2);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn -365, jdnPeriod.periodStart);
        checkJDN(jdn -365, jdnPeriod.periodEnd);

    });
});

describe('Create a Gregorian date and transpose it by a given number of years', () => {

    it('create the Gregorian date 06-12-2017 and shift it one year into the future', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date one year into the future
        gregorianDate.transposePeriodByYear(1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2018, 12, 6, 4);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn + 365, jdnPeriod.periodStart);
        checkJDN(jdn + 365, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 06-12-2017 and shift it one year into the past', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 365 into the future
        gregorianDate.transposePeriodByYear(-1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2016, 12, 6, 2);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn -365, jdnPeriod.periodStart);
        checkJDN(jdn -365, jdnPeriod.periodEnd);

    });
});

describe('Create a Gregorian date and transpose it by a given number of months', () => {

    it('create the Gregorian date 31-12-2017 and shift it one month into the future', () => {

        // Gregorian Calendar date 31-12-2017
        const jdn = 2458119;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date one month into the future
        gregorianDate.transposePeriodByMonth(1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2018, 1, 31, 3);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn + 31, jdnPeriod.periodStart);
        checkJDN(jdn + 31, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 31-03-2017 and shift it 6 months into the future', () => {

        // Gregorian Calendar date 31-03-2017
        const jdn = 2457844;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date six months into the future
        gregorianDate.transposePeriodByMonth(6);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2017, 9, 30, 6);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn + 30 + 31 + 30 + 31 + 31 + 30, jdnPeriod.periodStart);
        checkJDN(jdn + 30 + 31 + 30 + 31 + 31 + 30, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 15-03-2017 and shift it 2 months into the future', () => {

        // Gregorian Calendar date 15-03-2017
        const jdn = 2457828;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date two months into the future
        gregorianDate.transposePeriodByMonth(2);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2017, 5, 15, 1);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn + 16 + 15 + 15 + 15, jdnPeriod.periodStart);
        checkJDN(jdn + 16 + 15 + 15 + 15, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 31-12-2017 and shift it one month into the past', () => {

        // Gregorian Calendar date 31-12-2017
        const jdn = 2458119;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date one month into the past
        gregorianDate.transposePeriodByMonth(-1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2017, 11, 30, 4);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn - 31, jdnPeriod.periodStart);
        checkJDN(jdn - 31, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 31-03-2017 and shift it one month into the past', () => {

        // Gregorian Calendar date 31-03-2017
        const jdn = 2457844;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date one month into the past
        gregorianDate.transposePeriodByMonth(-1);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2017, 2, 28, 2);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn -31, jdnPeriod.periodStart);
        checkJDN(jdn -31, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 31-03-2017 and shift it three months into the past', () => {

        // Gregorian Calendar date 31-03-2017
        const jdn = 2457844;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date three months into the past
        gregorianDate.transposePeriodByMonth(-3);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2016, 12, 31, 6);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        checkJDN(jdn - 31 - 28 - 31, jdnPeriod.periodStart);
        checkJDN(jdn - 31 - 28 - 31, jdnPeriod.periodEnd);

    });

    it('create the Gregorian date 31-03-2017 and shift it 15 months into the past', () => {

        // Gregorian Calendar date 31-03-2017
        const jdn = 2457844;

        const gregorianDate: GregorianCalendarDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        // shift date 15 months into the past
        gregorianDate.transposePeriodByMonth(-15);

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        const expectedDate = new CalendarDate(2015, 12, 31, 4);

        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodStart);
        checkCalendarDate(expectedDate, gregorianCalendarPeriod.periodEnd);

        const jdnPeriod = gregorianDate.toJDNPeriod();

        // 2016 is a leap year: 366 days
        checkJDN(jdn - 31 - 28 - 31 - 366, jdnPeriod.periodStart);
        checkJDN(jdn - 31 - 28 - 31 - 366, jdnPeriod.periodEnd);

    });


});

describe('Create a JDNPeriod', () => {


    it('attempt to create a JDN with invalid args: non integers', () => {

        assert.throws(
            () => {
                new JDNPeriod(1.1, 2)
            },
            function (err) {
                if ((err instanceof Error) && err.message === 'JDNs are expected to be integers') {
                    return true;
                }
            }
        );

    });

    it('attempt to create a JDN with invalid args: end greater than start', () => {

        assert.throws(
            () => {
                new JDNPeriod(2, 1)
            },
            function (err) {

                if ((err instanceof Error) && err.message === 'start of a JDNPeriod must not be greater than its end') {
                    return true;
                }
            }
        );

    });


});

describe('For Julian and Gregorian calendar: Create a BCE date', () => {

    it('create the JDN for the Julian calendar date 15-03-44 BCE when Caesar was murdered and convert it to Gregorian', () => {

        // murder of Caesar
        const jdn = JDNConvertibleConversion.julianToJDN(new CalendarDate(-44,3,15));

        checkJDN(1705426, jdn);

        const murderOfCaesarJulianCalendarDate = new JulianCalendarDate(new JDNPeriod(jdn, jdn));

        const murderOfJuliusCaesarJulianCalPeriod = murderOfCaesarJulianCalendarDate.toCalendarPeriod();

        // in the Julian calendar, there is no year 0 in the conversion algorithm we use: <http://fourmilab.ch/documents/calendar/>, 44 BCE -> -44
        // TODO: see https://github.com/dhlab-basel/JDNConvertibleCalendar/issues/3
        const expectedJulianCalendarDate = new CalendarDate(-44, 3, 15, 3);

        checkCalendarDate(expectedJulianCalendarDate, murderOfJuliusCaesarJulianCalPeriod.periodStart);
        checkCalendarDate(expectedJulianCalendarDate, murderOfJuliusCaesarJulianCalPeriod.periodEnd);

        const murderOfCaesarGregorianCalendarDate = murderOfCaesarJulianCalendarDate.convertCalendar('Gregorian');

        const murderOfJuliusCaesarGregorianCalPeriod = murderOfCaesarGregorianCalendarDate.toCalendarPeriod();

        // in the Gregorian calendar, there is a year 0 in the conversion algorithm we use: http://fourmilab.ch/documents/calendar/ 44 BCE -> -43
        // TODO: https://github.com/dhlab-basel/JDNConvertibleCalendar/issues/3
        const expectedGregorianCalendarDate = new CalendarDate(-43, 3, 13, 3);

        checkCalendarDate(expectedGregorianCalendarDate, murderOfJuliusCaesarGregorianCalPeriod.periodStart);
        checkCalendarDate(expectedGregorianCalendarDate, murderOfJuliusCaesarGregorianCalPeriod.periodEnd);

        const jdnPeriodFromGregorian = murderOfCaesarGregorianCalendarDate.toJDNPeriod();

        checkJDN(jdn, jdnPeriodFromGregorian.periodStart);
        checkJDN(jdn, jdnPeriodFromGregorian.periodEnd);

    });

});