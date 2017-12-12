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

import {JDNConvertibleCalendar} from "./JDNConvertibleCalendar";

export module JDNConvertibleConversion {

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
    const mod = (a, b): number => {
        return a - (b * Math.floor(a / b));
    };

    /**
     * Converts a Gregorian calendar date to a JDN.
     *
     * Conversion algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * @param {JDNConvertibleCalendar.CalendarDate} calendarDate Gregorian calendar date to be converted to JDN.
     * @returns {number}
     */
    export const gregorianToJDN = (calendarDate: JDNConvertibleCalendar.CalendarDate): number => {

        // TODO: check validity of given calendar date

        const yearInt = Math.floor(calendarDate.year);
        const monthInt = Math.floor(calendarDate.month);
        const dayInt = Math.floor(calendarDate.day);

        const jdn = (GREGORIAN_EPOCH - 1) +
            (365 * (yearInt - 1)) +
            Math.floor((yearInt - 1) / 4) +
            (-Math.floor((yearInt - 1) / 100)) +
            Math.floor((yearInt - 1) / 400) +
            Math.floor((((367 * monthInt) - 362) / 12) +
                ((monthInt <= 2) ? 0 : (leapGregorian(yearInt) ? -1 : -2)) + dayInt);

        // convert JDC to JDN (ignore fraction)
        return Math.round(jdn);
    };

    /**
     * Converts a JDN to a Gregorian Calendar date.
     *
     * Conversion algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * @param {number} jdn JDN to be converted to a Gregorian calendar date.
     * @returns {JDNConvertibleCalendar.CalendarDate}
     */
    export const JDNToGregorian = (jdn: number): JDNConvertibleCalendar.CalendarDate => {

        // if a Julian Day has a fraction of 0.5 or higher, it refers to midnight (0h) or later
        // if it is has a fraction below 0.5, it refers to a time before midnight which is the day before
        // 2457498.5 -> 2016-04-20 0h
        // 2457498.4 -> 2016-04-19
        const wjd = Math.floor(jdn - 0.5) + 0.5;
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

        const yearday = wjd - gregorianToJDN(new JDNConvertibleCalendar.CalendarDate(year, 1, 1));
        const leapadj = ((wjd < gregorianToJDN(new JDNConvertibleCalendar.CalendarDate(year, 3, 1))) ? 0 : (leapGregorian(year) ? 1 : 2));
        const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);

        const day = (wjd - gregorianToJDN(new JDNConvertibleCalendar.CalendarDate(year, month, 1))) + 1;

        // if (year <= 0) year--; // correction for PHPvar JULIAN_EPOCH = 1721423.5;

        return new JDNConvertibleCalendar.CalendarDate(Math.round(year), Math.round(month), Math.round(day));
    };

    /**
     * Converts a Julian calendar date to a JDN.
     *
     * Conversion algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * @param {JDNConvertibleCalendar.CalendarDate} calendarDate Julian calendar date to be converted to JDN.
     * @returns {number}
     */
    export const julianToJDN = (calendarDate: JDNConvertibleCalendar.CalendarDate) => {

        // TODO: check validity of given calendar date

        let yearInt = Math.floor(calendarDate.year);
        let monthInt = Math.floor(calendarDate.month);
        const dayInt = Math.floor(calendarDate.day);

        /* Adjust negative common era years to the zero-based notation we use.  */

        if (yearInt < 1) {
            yearInt++;
        }

        /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */

        if (monthInt <= 2) {
            yearInt--;
            monthInt += 12;
        }

        const jdn: number = ((Math.floor((365.25 * (yearInt + 4716))) +
            Math.floor((30.6001 * (monthInt + 1))) +
            dayInt) - 1524.5);

        return Math.round(jdn);
    };

    /**
     * Converts a JDN to a Julian Calendar date.
     *
     * Conversion algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * @param {number} jdn JDN to be converted to a Julian calendar date.
     * @returns {JDNConvertibleCalendar.CalendarDate}
     */
    export const JDNToJulian = (jdn: number): JDNConvertibleCalendar.CalendarDate => {
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

        /*  If year is less than 1, subtract one to convert from
                    a zero based date system to the common era system in
                    which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

        if (year < 1) {
            year--;
        }

        return new JDNConvertibleCalendar.CalendarDate(Math.round(year), Math.round(month), Math.round(day));
    }
}