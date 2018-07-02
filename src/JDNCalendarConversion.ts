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

import {JDNConvertibleCalendarModule} from "./JDNConvertibleCalendar";

export module JDNConvertibleConversionModule {


    const truncateDecimals =  (num: number): number => {
        return Math[num < 0 ? 'ceil' : 'floor'](num);
    };


    /**
     * From https://www.fourmilab.ch/documents/calendar/calendar.js
     */
    const GREGORIAN_EPOCH = 1721425.5;
    const JULIAN_EPOCH = 1721423.5;
    const HEBREW_EPOCH = 347995.5;
    const FRENCH_REVOLUTIONARY_EPOCH = 2375839.5;

    /**
     * Indicates if given year is a leap year in Gregorian calendar.
     *
     * Algorithm from: https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * @param {number} year year to check for.
     * @returns {boolean}
     */
    const leapGregorian = (year: number): boolean => {
        let yearInt = Math.floor(year);
        return ((yearInt % 4) == 0) && (!(((yearInt % 100) == 0) && ((yearInt % 400) != 0)));
    };

    // TODO: document this method
    /*
     * Algorithm from https://www.fourmilab.ch/documents/calendar/astro.js
     */
    const mod = (a: number, b: number): number => {
        return a - (b * Math.floor(a / b));
    };

    /**
     * Converts a Gregorian calendar date to a JDC.
     *
     * Conversion algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 60pp.
     *
     * There is a year 0.
     *
     * @param {JDNConvertibleCalendarModule.CalendarDate} calendarDate Gregorian calendar date to be converted to JDC.
     * @returns {number}
     */
    export const gregorianToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): number => {

        // TODO: check validity of given calendar date

        let year = 0;
        let month = 0;
        let day = calendarDate.day;

        if (calendarDate.daytime !== undefined) {
            day = day + calendarDate.daytime;
        }

        if (calendarDate.month > 2) {
            year = calendarDate.year;
            month = calendarDate.month;
        }
        else {
            year = calendarDate.year - 1;
            month = calendarDate.month + 12;
        }


        let a = 0;
        let b = 0;
        let c = 0;

        if (year < 0) {
            c = -0.75;
        }
        //else {
        //    const idate = calendarDate.year*10000 + month*100 + day;
        //    if (idate >= 15821015) { // this is if the date is after 15-10-1582 (Gregorian/Julian switch)
                a = truncateDecimals(year/100.);
                b = 2 - a + truncateDecimals(a/4.);
        //    }
        //}

        const jdc = truncateDecimals(365.25*year + c) +
            truncateDecimals(30.6001*(month + 1)) +
            day + b + 1720994.5;

        return jdc;
    };


    /**
     * Converts a Gregorian calendar date to a JDN.
     *
     * @param {JDNConvertibleCalendarModule.CalendarDate} calendarDate Gregorian calendar date to be converted to JDN.
     * @returns {number}
     */
    export const gregorianToJDN = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): number => {
        const jdc = gregorianToJDC(calendarDate);
        return truncateDecimals(jdc + 0.5); // adaption because full number without fraction of JDC represents noon.
    };


    /**
     * Converts a JDN to a Gregorian Calendar date.
     *
     * Conversion algorithm from:
     *
     * There is a year 0.
     *
     *
     * @param {number} jdc JDN to be converted to a Gregorian calendar date.
     * @returns {JDNConvertibleCalendarModule.CalendarDate}
     */
    export const JDCToGregorian = (jdc: number): JDNConvertibleCalendarModule.CalendarDate => {

        // if a Julian Day has a fraction of 0.5 or higher, it refers to midnight (0h) or later
        // if it is has a fraction below 0.5, it refers to a time before midnight which is the day before
        // 2457498.5 -> 2016-04-20 0h
        // 2457498.4 -> 2016-04-19
        /*
        const wjd = jdn; //Math.floor(jdn - 0.5) + 0.5; // TODO: check this for correctness!
        const depoch = wjd - GREGORIAN_EPOCH;
        const quadricent = Math.floor(depoch / 146097);
        const dqc = mod(depoch, 146097);
        const cent = Math.floor(dqc / 36524);
        const dcent = mod(dqc, 36524);
        const quad = Math.floor(dcent / 1461);
        const dquad = mod(dcent, 1461);
        const yindex = Math.floor(dquad / 365);

        let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;

        if (!((cent == 4) || (yindex == 4))) {
            year++;
        }

        const yearday = wjd - gregorianToJDN(new JDNConvertibleCalendarModule.CalendarDate(year, 1, 1));
        const leapadj = ((wjd < gregorianToJDN(new JDNConvertibleCalendarModule.CalendarDate(year, 3, 1))) ? 0 : (leapGregorian(year) ? 1 : 2));
        const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);

        const day = (wjd - gregorianToJDN(new JDNConvertibleCalendarModule.CalendarDate(year, month, 1))) + 1;

        // if (year <= 0) year--; // correction for PHPvar JULIAN_EPOCH = 1721423.5;

        return new JDNConvertibleCalendarModule.CalendarDate(Math.round(year), Math.round(month), Math.round(day));
        */
        jdc = jdc + 0.5;
        const z = truncateDecimals(jdc);
        const f = jdc - z;
        let a;
        //if (z < 2299161) { // earlier than 15.10.582 ??
        //    a = z; // it's a julian calendar
        //}
        //else {
            const alpha = truncateDecimals((z - 1867216.25)/36524.25);
            a = z + 1 + alpha - truncateDecimals(alpha/4.);
        //}
        const b = a + 1524;
        const c = truncateDecimals((b - 122.1)/365.25);
        const d = truncateDecimals(365.25*c);
        const e = truncateDecimals((b - d)/30.6001);

        const day = b - d - truncateDecimals(30.6001*e) + f;
        let month;
        if (e < 14) {
            month = e - 1;
        }
        else {
            month = e - 13;
        }
        let year;
        if (month > 2) {
            year = c - 4716;
        }
        else {
            year = c - 4715;
        }

        let fullday = truncateDecimals(day);
        let daytime = day - fullday;
        return new JDNConvertibleCalendarModule.CalendarDate(year, month, fullday, undefined, daytime);
    };

    export const JDNToGregorian = (jdn: number): JDNConvertibleCalendarModule.CalendarDate => {
       return JDCToGregorian(jdn);
    };


    export const julianToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): number => {

        // TODO: check validity of given calendar date

        let year = 0;
        let month = 0;
        let day = calendarDate.day;

        if (calendarDate.daytime !== undefined) {
            day = day + calendarDate.daytime;
        }

        if (calendarDate.month > 2) {
            year = calendarDate.year;
            month = calendarDate.month;
        }
        else {
            year = calendarDate.year - 1;
            month = calendarDate.month + 12;
        }


        let a = 0;
        let b = 0;
        let c = 0;

        if (year < 0) {
            c = -0.75;
        }

        const jdc = truncateDecimals(365.25*year + c) +
            truncateDecimals(30.6001*(month + 1)) + day + 1720994.5;

        return jdc;
    };

    /**
     * Converts a Julian calendar date to a JDN.
     *
     * Conversion algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * There is **no** year 0.
     *
     * From <https://www.fourmilab.ch/documents/calendar>:
     * > "While one can't properly speak of 'Gregorian dates' prior to the adoption of the calendar in 1582,
     * > the calendar can be extrapolated to prior dates. In doing so, this implementation uses the convention that the year prior to year 1 is year 0.
     * > This differs from the Julian calendar in which there is no year 0—the year before year 1 in the Julian calendar is year −1.
     * > The date December 30th, 0 in the Gregorian calendar corresponds to January 1st, 1 in the Julian calendar."
     *
     * @param {JDNConvertibleCalendarModule.CalendarDate} calendarDate Julian calendar date to be converted to JDN.
     * @returns {number}
     */
    export const julianToJDN = (calendarDate: JDNConvertibleCalendarModule.CalendarDate) => {

        // TODO: check validity of given calendar date
/*
        let yearInt = Math.floor(calendarDate.year);
        let monthInt = Math.floor(calendarDate.month);
        const dayInt = Math.floor(calendarDate.day);

        // Adjust negative common era years to the zero-based notation we use.

        if (yearInt < 1) {
            yearInt++;
        }

        // Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61

        if (monthInt <= 2) {
            yearInt--;
            monthInt += 12;
        }

        const jdn: number = ((Math.floor((365.25 * (yearInt + 4716))) +
            Math.floor((30.6001 * (monthInt + 1))) +
            dayInt) - 1524.5);

        return Math.round(jdn);
        */
        const jdc = julianToJDC(calendarDate);
        return truncateDecimals(jdc + 0.5); // adaption because full number without fraction of JDC represents noon.

    };

    /**
     * Converts a JDN to a Julian Calendar date.
     *
     * Conversion algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * There is **no** year 0.
     *
     * From <https://www.fourmilab.ch/documents/calendar>:
     * > "While one can't properly speak of 'Gregorian dates' prior to the adoption of the calendar in 1582,
     * > the calendar can be extrapolated to prior dates. In doing so, this implementation uses the convention that the year prior to year 1 is year 0.
     * > This differs from the Julian calendar in which there is no year 0—the year before year 1 in the Julian calendar is year −1.
     * > The date December 30th, 0 in the Gregorian calendar corresponds to January 1st, 1 in the Julian calendar."
     *
     * @param {number} jdn JDN to be converted to a Julian calendar date.
     * @returns {JDNConvertibleCalendarModule.CalendarDate}
     */
    export const JDCToJulian = (jdc: number): JDNConvertibleCalendarModule.CalendarDate => {
        /*
        let jdc = Math.floor(jdn) + 0.5;

        const z = Math.floor(jdc);

        const a = z;
        const b = a + 1524;
        const c = Math.floor((b - 122.1) / 365.25);
        const d = Math.floor(365.25 * c);
        const e = Math.floor((b - d) / 30.6001);

        const month = Math.floor((e < 14) ? (e - 1) : (e - 13));
        let year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
        const day = b - d - Math.floor(30.6001 * e);

        //  If year is less than 1, subtract one to convert from
        //            a zero based date system to the common era system in
        //            which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).

        if (year < 1) {
            year--;
        }

        return new JDNConvertibleCalendarModule.CalendarDate(Math.round(year), Math.round(month), Math.round(day));
        */
        jdc = jdc + 0.5;
        const z = truncateDecimals(jdc);
        const f = jdc - z;
        const a = z; // it's a julian calendar
        const b = a + 1524;
        const c = truncateDecimals((b - 122.1)/365.25);
        const d = truncateDecimals(365.25*c);
        const e = truncateDecimals((b - d)/30.6001);

        const day = b - d - truncateDecimals(30.6001*e) + f;
        let month;
        if (e < 14) {
            month = e - 1;
        }
        else {
            month = e - 13;
        }
        let year;
        if (month > 2) {
            year = c - 4716;
        }
        else {
            year = c - 4715;
        }

        let fullday = truncateDecimals(day);
        let daytime = day - fullday;
        return new JDNConvertibleCalendarModule.CalendarDate(year, month, fullday, undefined, daytime);
    };

    export const JDNToJulian = (jdn: number): JDNConvertibleCalendarModule.CalendarDate => {
        return JDCToJulian(jdn);
    };

    // TODO: I am not sure if this is useful for other calendar formats than Gregorian and Julian
    /**
     * Determine the day of week from the given JDN.
     *
     * Algorithm from: https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * Jean Meeus: Astronomical Algorithms, 1998, p. 65.
     *
     * @param {number} jdn given Julian Day Number.
     * @returns {number} the number of the day of the week (0 Sunday, 1 Monday, 2 Tuesday, 3 Wednesday, 4 Thursday, 5 Friday, 6 Saturday).
     */
    export const dayOfWeekFromJDN: (jdn: number) => number = (jdn: number) => {

        const jdnInt = Math.floor(jdn);

        return mod(Math.floor((jdnInt + 1.5)), 7);

    }
}