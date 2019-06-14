/*
 * Copyright © 2018 Lukas Rosenthaler, Rita Gautschy, Benjamin Geer, Ivan Subotic,
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
import {TypeDefinitionsModule} from './TypeDefinitions';
import JDC = TypeDefinitionsModule.JDC;
import JDN = TypeDefinitionsModule.JDN;

export module JDNConvertibleConversionModule {

    /**
     * Removes the fraction from a given number (<https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript/9232092#9232092>).
     * This also works for negative numbers.
     *
     * 1.2 -> 1
     * -3.2 -> -3
     *
     * @param num the number whose fraction is to be removed.
     * @returns given number without fractions.
     */
    const truncateDecimals =  (num: number): number => {
        return Math[num < 0 ? 'ceil' : 'floor'](num);
    };

    /**
     * Converts a Gregorian calendar date to a JDC.
     *
     * Conversion algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 60pp.
     *
     * There is a year 0.
     *
     * @param calendarDate Gregorian calendar date to be converted to JDC.
     * @returns the JDC representing the given Gregorian calendar date.
     */
    export const gregorianToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDC => {

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

        let c = 0;
        if (year < 0) {
            c = -0.75;
        }
        //
        // we enforce Gregorian calendar for *all* dates (also prior to 1582)
        //
        let a = truncateDecimals(year/100.);
        let b = 2 - a + truncateDecimals(a/4.);

        const jdc = truncateDecimals(365.25*year + c) +
            truncateDecimals(30.6001*(month + 1)) +
            day + b + 1720994.5;

        return jdc;
    };


    /**
     * Converts a Gregorian calendar date to a JDN.
     *
     * @param calendarDate Gregorian calendar date to be converted to JDN.
     * @returns the JDN representing the given Gregorian calendar date.
     */
    export const gregorianToJDN = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDN => {
        const jdc: JDC = gregorianToJDC(calendarDate);

        /*

        Convert JDC to JDN by adding 0.5 and getting rid of fractions.

        2446822.5 up to 2446823.49… (JDCs for January 27th 1987) -> 2446823 (JDN for January 27th 1987)

         */

        return truncateDecimals(jdc + 0.5);
    };


    /**
     * Converts a JDC to a Gregorian Calendar date.
     *
     * Conversion algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 63pp.
     *
     * There is a year 0.
     *
     * @param jdc JDC to be converted to a Gregorian calendar date.
     * @returns the Gregorian calendar date created from the given JDC.
     */
    export const JDCToGregorian = (jdc: JDC): JDNConvertibleCalendarModule.CalendarDate => {
        jdc = jdc + 0.5;
        const z = truncateDecimals(jdc);
        const f = jdc - z;

        const alpha = truncateDecimals((z - 1867216.25)/36524.25);
        let a = z + 1 + alpha - truncateDecimals(alpha/4.);

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

    /**
     * Converts a JDN to a Gregorian calendar date.
     *
     * @param jdn the given JDN.
     * @returns the Gregorian calendar date created from the given JDN.
     */
    export const JDNToGregorian = (jdn: JDN): JDNConvertibleCalendarModule.CalendarDate => {
       return JDCToGregorian(jdn);
    };

    /**
     * Converts a Julian calendar date to a JDC.
     *
     * Conversion algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 60pp.
     *
     * There is a year 0.
     *
     * @param calendarDate Julian calendar date to be converted to JDC.
     * @returns JDC representing the given Julian calendar date.
     */
    export const julianToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDC => {

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
     * @param calendarDate Julian calendar date to be converted to JDN.
     * @returns JDN representing the given Julian calendar date.
     */
    export const julianToJDN = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDN => {

        // TODO: check validity of given calendar date
        const jdc = julianToJDC(calendarDate);

        /*

        Convert JDC to JDN by adding 0.5 and getting rid of fractions.

        2446822.5 up to 2446823.49… (JDCs for January 14th 1987) -> 2446823 (JDN for January 14th 1987)

         */

        return truncateDecimals(jdc + 0.5); // adaption because full number without fraction of JDC represents noon.
    };

    /**
     * Converts a JDC to a Julian Calendar date.
     *
     * Conversion algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 63pp.
     *
     * There is a year 0.
     *
     * @param jdc JDC to be converted to a Julian calendar date.
     * @returns Julian calendar date created from given JDC.
     */
    export const JDCToJulian = (jdc: JDC): JDNConvertibleCalendarModule.CalendarDate => {
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

    /**
     * Converts a JDN to a Julian calendar date.
     *
     * @param jdn JDN to be converted to a Julian calendar date.
     * @returns Julian calendar date created from given JDN.
     */
    export const JDNToJulian = (jdn: JDN): JDNConvertibleCalendarModule.CalendarDate => {
        return JDCToJulian(jdn);
    };

    /**
     * Determine the day of week from the given JDN. Works only for calendars which use
     * the 7 day week with Sunday to Saturday.
     *
     * Algorithm from:
     * Jean Meeus: Astronomical Algorithms, 1998, p. 65.
     *
     * @param jdc given JDC.
     * @returns the number of the day of the week for the given JDC (0 Sunday, 1 Monday, 2 Tuesday, 3 Wednesday, 4 Thursday, 5 Friday, 6 Saturday).
     */
    export const dayOfWeekFromJDC = (jdc: JDC) => {
        return Math.floor(jdc + 1.5) %  7;
    };

    const ISLAMIC_EPOCH = 1948439.5;

    /**
     * Converts an Islamic calendar date to a JDC.
     *
     * Algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 73pp.
     *
     * @param calendarDate Islamic calendar date to be converted to JDC.
     * @returns JDC representing the given Islamic calendar date.
     */
    export const islamicToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDC => {
        /*return (calendarDate.day +
            Math.ceil(29.5 * (calendarDate.month - 1)) +
            (calendarDate.year - 1) * 354 +
            Math.floor((3 + (11 * calendarDate.year)) / 30) +
            ISLAMIC_EPOCH) - 1; // jd=intPart((11*y+3)/30)+354*y+30*m-intPart((m-1)/2)+d+1948440-385 http://www.muslimphilosophy.com/ip/hijri.htm*/

        const h = calendarDate.year;
        const m = calendarDate.month;
        let d = calendarDate.day;

        if (calendarDate.daytime !== undefined) {
            d = d + calendarDate.daytime;
        }

        const n = d + truncateDecimals(29.5001 * (m - 1) + 0.99);
        const q = truncateDecimals(h/30);
        const r = h % 30;
        // IF (r.lt.0) r = r + 30
        const a = truncateDecimals((11*r +3)/30);
        const w = 404 * q + 354 * r + 208 + a;
        const q1 = truncateDecimals(w/1461);
        const q2 = w % 1461;
        // IF (q2.lt.0) q2 = q2 + 1461
        const g = 621 + 4  * truncateDecimals(7*q + q1);
        const k = truncateDecimals(q2/365.2422);
        const e = truncateDecimals(365.2422*k);
        let j = q2 - e + n - 1;
        let x = g + k;

        if (j > 366 && (x % 4 == 0)) {
            j =- 366;
            x =+ 1;
        } else if (j > 365 && (x % 4 > 0)) {
            j =- 365;
            x =+ 1;
        }

        const jdc = truncateDecimals(365.25 * (x-1)) + 1721423 + j - 0.5;

        return jdc;
    };

    /**
     * Converts an Islamic calendar date to a JDN.
     *
     * @param calendarDate Islamic calendar date to be converted to JDN.
     * @returns JDN representing the given Islamic calendar date.
     */
    export const islamicToJDN = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDN => {
        const jdc = islamicToJDC(calendarDate);

        return truncateDecimals(jdc + 0.5); // adaption because full number without fraction of JDC represents noon.
    };

    /**
     * Converts a JDC to an Islamic calendar date.
     *
     * Algorithm from:
     * https://www.fourmilab.ch/documents/calendar/calendar.js
     *
     * @param jdc JDC to be converted to an Islamic calendar date.
     * @returns Islamic calendar date created from given JDC.
     */
    export const JDCToIslamic = (jdc: JDC): JDNConvertibleCalendarModule.CalendarDate => {
        let year, month, day;

        jdc = Math.floor(jdc) + 0.5; // TODO: handle JDN correctly
        year = Math.floor(((30 * (jdc - ISLAMIC_EPOCH)) + 10646) / 10631);
        month = Math.min(12,
            Math.ceil((jdc - (29 + islamicToJDC(new JDNConvertibleCalendarModule.CalendarDate(year, 1, 1)))) / 29.5) + 1);
        day = (jdc - islamicToJDC(new JDNConvertibleCalendarModule.CalendarDate(year, month, 1))) + 1;
        return new JDNConvertibleCalendarModule.CalendarDate(year, month, day); // TODO: determine daytime
    };

    /**
     * Converts a JDN to an Islamic calendar date.
     *
     * @param jdn JDN to be converted to an Islamic calendar date.
     * @returns @returns Islamic calendar date created from given JDN.
     */
    export const JDNToIslamic = (jdn: JDN): JDNConvertibleCalendarModule.CalendarDate => {
        return JDCToIslamic(jdn);
    }
}
