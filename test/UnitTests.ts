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

describe('Conversions between Gregorian and Julian calendar format', () => {

    it('convert a Gregorian date into a Julian date', () => {

        // Gregorian Calendar date 06-12-2017
        const jdn = 2458094;

        const gregorianDate = new GregorianCalendarDate(new JDNPeriod(jdn, jdn));

        const gregorianCalendarPeriod = gregorianDate.toCalendarPeriod();

        assert.strictEqual(gregorianCalendarPeriod.periodStart.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodStart.day, 6, `calendar period wrong: day`);

        assert.strictEqual(gregorianCalendarPeriod.periodEnd.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.month, 12, `calendar period wrong: month`);
        assert.strictEqual(gregorianCalendarPeriod.periodEnd.day, 6, `calendar period wrong: day`);


        const julianDate: JDNConvertibleCalendar.JDNConvertibleCalendar = gregorianDate.convertCalendar('Julian');

        const jdnPeriod = julianDate.toJDNPeriod();

        assert.strictEqual(jdnPeriod.periodStart, jdn, `start of JDN period wrong`);
        assert.strictEqual(jdnPeriod.periodEnd, jdn, `end of JDN period wrong`);

        const julianCalendarPeriod = julianDate.toCalendarPeriod();

        assert.strictEqual(julianCalendarPeriod.periodStart.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(julianCalendarPeriod.periodStart.month, 11, `calendar period wrong: month`);
        assert.strictEqual(julianCalendarPeriod.periodStart.day, 23, `calendar period wrong: day`);

        assert.strictEqual(julianCalendarPeriod.periodEnd.year, 2017, `calendar period wrong: year`);
        assert.strictEqual(julianCalendarPeriod.periodEnd.month, 11, `calendar period wrong: month`);
        assert.strictEqual(julianCalendarPeriod.periodEnd.day, 23, `calendar period wrong: day`);

    });


});