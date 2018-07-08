/*
 * Copyright © 2018 Lukas Rosenthaler, Benjamin Geer, Ivan Subotic,
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
    }
}