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

        Converts JDC to JDN by adding 0.5 and getting rid of fractions.

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

        Converts JDC to JDN by adding 0.5 and getting rid of fractions.

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
        return truncateDecimals(jdc + 1.5) %  7;
    };

    /**
     * Converts an Islamic calendar date to a JDC.
     *
     * Algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 73pp.
     *
     * The first day of the Islamic calendar according to this algorithm is July 16th, 622 CE (Julian; JDC = 1948439.5).
     * This is in agreement with the widely used tables of Wuestenfeld et al., Wuestenfeld-Mahler'sche
     * Vergleichungs-Tabellen zur muslimischen und iranischen Zeitrechnung, 1961. However, it is well known that
     * these calendar dates may be off by 1 to 2 days in comparison to the calendar that was actually used, especially
     * if historical dates are concerned. There are two more points of concern: Sura 9, 36-37 of the Koran
     * suggests that a lunar calendar without intercalation was applied from year 10 of the Hijra onwards only; earlier
     * on, probably a luni-solar calendar was used. This algorithm assumes that a lunar calendar without any
     * intercalation started in year 1 of the Hijra. Secondly, in many countries the first actual sighting of the lunar
     * crescent was decisive for the beginning of a new month up to quite recent times, but not a regular scheme. This
     * introduces a dependency on the location: a new Islamic calendar month may have started on different days in
     * different locations.
     * Unambiguous conversion of historical Islamic dates into Julian or Gregorian calendar dates or vice cersa can
     * only be achieved if the day of the week is known in addition.
     *
     * @param calendarDate Islamic calendar date to be converted to JDC.
     * @returns JDC representing the given Islamic calendar date.
     */
    export const islamicToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDC => {

        const h = calendarDate.year;
        const m = calendarDate.month;
        let d = calendarDate.day;

        if (calendarDate.daytime !== undefined) {
            d = d + calendarDate.daytime;
        }

        const n = d + Math.floor(29.5001 * (m - 1) + 0.99);
        const q = Math.floor(h/30);
        let r = h % 30;
        if (r < 0) {
            r = r + 30;
        }
        const a = Math.floor((11*r +3)/30);
        const w = 404 * q + 354 * r + 208 + a;
        const q1 = Math.floor(w/1461);
        let q2 = w % 1461;
        if (q2 < 0) {
            q2 = q2 + 1461;
        }
        const g = 621 + 4  * Math.floor(7*q + q1);
        const k = Math.floor(q2/365.2422);
        const e = Math.floor(365.2422*k);
        let j = q2 - e + n - 1;
        let x = g + k;

        if (j > 366 && (x % 4 == 0)) {
            j = j - 366;
            x = x + 1;
        } else if (j > 365 && (x % 4 > 0)) {
            j = j - 365;
            x = x + 1;
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
     * Jean Meeus, Astronomical Algorithms, 1998, 75pp.
     *
     * The first day of the Islamic calendar according to this algorithm is July 16th, 622 CE (Julian; JDC = 1948439.5).
     * This is in agreement with the widely used tables of Wuestenfeld et al., Wuestenfeld-Mahler'sche
     * Vergleichungs-Tabellen zur muslimischen und iranischen Zeitrechnung, 1961. However, it is well known that
     * these calendar dates may be off by 1 to 2 days in comparison to the calendar that was actually used, especially
     * if historical dates are concerned. There are two more points of concern: Sura 9, 36-37 of the Koran
     * suggests that a lunar calendar without intercalation was applied from year 10 of the Hijra onwards only; earlier
     * on, probably a luni-solar calendar was used. This algorithm assumes that a lunar calendar without any
     * intercalation started in year 1 of the Hijra. Secondly, in many countries the first actual sighting of the lunar
     * crescent was decisive for the beginning of a new month up to quite recent times, but not a regular scheme. This
     * introduces a dependency on the location: a new Islamic calendar month may have started on different days in
     * different locations.
     * Unambiguous conversion of historical Islamic dates into Julian or Gregorian calendar dates or vice cersa can
     * only be achieved if the day of the week is known in addition.
     *
     * @param jdc JDC to be converted to an Islamic calendar date.
     * @returns Islamic calendar date created from given JDC.
     */
    export const JDCToIslamic = (jdc: JDC): JDNConvertibleCalendarModule.CalendarDate => {

        // convert given JDC into a Julian calendar date
        const julianCalendarDate: JDNConvertibleCalendarModule.CalendarDate = JDCToJulian(jdc);

        const x = julianCalendarDate.year;
        let m = julianCalendarDate.month;
        let d = julianCalendarDate.day;

        let w;
        if ((x % 4) == 0) {
            w = 1;
        } else {
            w = 2;
        }

        const n = truncateDecimals((275 * m)/9) - w * truncateDecimals((m + 9)/12) + d - 30;
        const a = x - 623;
        const b = Math.floor(a/4);
        let c = a / 4 - b;
        c = Math.floor(c * 4);
        const c1 = 365.2501 * c;
        let c2 = Math.floor(c1);

        if ((c1 - c2) > 0.5) {
            c2 = c2 + 1;
        }

        const d_ = 1461 * b + 170 + c2;
        const q = Math.floor(d_/10631);
        let r = d_ % 10631;
        if (r < 0) {
            r = r + 10631;
        }
        const j = Math.floor(r/354);
        let k = r % 354;
        if (k < 0) {
            k = k + 354;
        }
        const o = Math.floor((11*j +14)/30);
        let h = 30 * q  + j + 1;
        let jj = k - o + n -1;

        if (jj > 354) {
            let cl = h % 30;
            if (cl < 0) {
                cl = cl + 30;
            }
            let dl = (11 * cl + 3) % 30;
            if (dl < 0) {
                dl = dl + 30;
            }
            
            if (dl < 19) {
                jj = jj - 354;
                h = h + 1;
            }
            if (dl > 18) {
               jj = jj - 355;
               h = h + 1;
            }

            if (jj == 0) {
                jj = 355;
                h = h - 1;
            }
        }

        const s = Math.floor((jj -1)/29.5);

        m = 1 + s;

        d = Math.floor(jj - 29.5 * s);

        if (jj == 355) {
            m = 12;
            d= 30;
        }

        return new JDNConvertibleCalendarModule.CalendarDate(h, m, d, undefined, julianCalendarDate.daytime);
    };

    /**
     * Converts a JDN to an Islamic calendar date.
     *
     * @param jdn JDN to be converted to an Islamic calendar date.
     * @returns @returns Islamic calendar date created from given JDN.
     */
    export const JDNToIslamic = (jdn: JDN): JDNConvertibleCalendarModule.CalendarDate => {
        return JDCToIslamic(jdn);
    };


    /**
     * Function that calculates the Julian day number of a given date.
     *
     * Algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 60-63.
     *
     * The Gregorian calendar starts on October 15th, 1582 at 0 UT (JDE = 2299160.5). Prior to this date,
     * the Julian calendar is used.
     *
     * @returns jde: Julian day number.
     */

    export const julianDayFromGregorianJulianDate = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDN => {

        let a, m1, jde, y;
        let b = 0;
        let c = 0;
        const ka = calendarDate.year;
        if (calendarDate.month > 2) {
            y = ka;
            m1 = calendarDate.month;
        } else {
            y = ka - 1;
            m1 = calendarDate.month + 12;
        }

        if (y<0) {
            c = -0.75;
        } else {
            const idate = ka * 10000 + m1 * 100 + calendarDate.day;
            if (idate>=15821015) {
                a = truncateDecimals(y/100);
                b = 2 - a + truncateDecimals(a/4);
            }
        }
        jde = truncateDecimals(365.25*y+c) + truncateDecimals(30.6001*(m1+1)) + calendarDate.day + b + 1720994.5;

        return jde;
    };

    /**
     * Determines the character of the Jewish year: number of days, weekday of the first day of the year
     * and the number of months
     */
    export class CharacterOfJewishYear {

        /**
         *
         * @param hj: Jewish year, usually Julian/Gregorian year + 3760
         * @param jdays: number of days of the Jewish year (may be 353, 354, 355, 383, 384 or 385 days)
         * @param wbeg: weekday of the first day of the Jewish year (may be 1, 2, 4 or 6; 1 = Monday, etc.)
         * @param nmo: number of months of the Jewish year (either 12 or 13)
         */
        constructor(readonly hj: number, readonly jdays: number, readonly wbeg: number, readonly nmo: number){

        }
    }

    /**
     * Function that determines the character of a specific Jewish calendar based on the
     * so called Slonimski formula.
     *
     * Algorithms developed based on:
     * Slonimnski formula: see Dershowitz & Reingold, Calendrical Calculations, 2008, 96 ff. and
     * https://de.wikipedia.org/wiki/Slonimski-Formel
     *
     * @returns Number of months and days and the weekday of the first day of the year of a given Jewish year.
     */
    export const JewishCharact = (jdc: JDC): CharacterOfJewishYear => {

        // convert given JDC into a Julian calendar date
        const julianCalendarDate: JDNConvertibleCalendarModule.CalendarDate = JDCToJulian(jdc);

        const h = julianCalendarDate.year;
        let hj = h + 3760;

        let r1 = 7 * hj - 6;
        r1 = r1 % 19;
        if (r1 < 0) {
            r1 = r1 + 19;
        }
        let nmo = 0;
        if (r1 < 12) {
            nmo = 12;
        }
        if (r1 >= 12) {
            nmo = 13;
        }

        let k1 = 0.178117458 * hj + 0.7779654 * r1 + 0.2533747;
        k1 = k1 - Math.floor(k1);

        let wbeg = 0;
        let jdays = 0;

        /* Determine the number of days of the Jewish year and the weekday of the first day of the year
        * */
        if (r1 < 5) {
            if ((k1 >= 0)&&(k1 < 0.090410)) {
                jdays = 353;
                wbeg = 1;
            } else
            if ((k1 >= 0.090410)&&(k1 < 0.271103)) {
                jdays = 355;
                wbeg = 1;
            } else
            if ((k1 >= 0.271103)&&(k1 < 0.376121)) {
                jdays = 354;
                wbeg = 2;
            } else
            if ((k1 >= 0.376121)&&(k1 < 0.661835)) {
                jdays = 354;
                wbeg = 4;
            } else
            if ((k1 >= 0.661835)&&(k1 < 0.714282)) {
                jdays = 355;
                wbeg = 4;
            } else
            if ((k1 >= 0.714282)&&(k1 < 0.752248)) {
                jdays = 353;
                wbeg = 6;
            } else
            if ((k1 >= 0.752248)&&(k1 < 1)) {
                jdays = 355;
                wbeg = 6;
            }
        } else
        if ((r1 >= 5)&&(r1 < 7)) {
            if ((k1 >= 0)&&(k1 < 0.090410)) {
                jdays = 353;
                wbeg = 1;
            } else
            if ((k1 >= 0.090410)&&(k1 < 0.271103)) {
                jdays = 355;
                wbeg = 1;
            } else
            if ((k1 >= 0.271103)&&(k1 < 0.376121)) {
                jdays = 354;
                wbeg = 2;
            } else
            if ((k1 >= 0.376121)&&(k1 < 0.661835)) {
                jdays = 354;
                wbeg = 4;
            } else
            if ((k1 >= 0.661835)&&(k1 < 0.714282)) {
                jdays = 355;
                wbeg = 4;
            } else
            if ((k1 >= 0.714282)&&(k1 < 0.804693)) {
                jdays = 353;
                wbeg = 6;
            } else
            if ((k1 >= 0.804693)&&(k1 < 1)) {
                jdays = 355;
                wbeg = 6;
            }
        } else
        if ((r1 >= 7)&&(r1 < 12)) {
            if ((k1 >= 0)&&(k1 < 0.090410)) {
                jdays = 353;
                wbeg = 1;
            } else
            if ((k1 >= 0.090410)&&(k1 < 0.285711)) {
                jdays = 355;
                wbeg = 1;
            } else
            if ((k1 >= 0.285711)&&(k1 < 0.376121)) {
                jdays = 354;
                wbeg = 2;
            } else
            if ((k1 >= 0.376121)&&(k1 < 0.661835)) {
                jdays = 354;
                wbeg = 4;
            } else
            if ((k1 >= 0.661835)&&(k1 < 0.714282)) {
                jdays = 355;
                wbeg = 4;
            } else
            if ((k1 >= 0.714282)&&(k1 < 0.804693)) {
                jdays = 353;
                wbeg = 6;
            } else
            if ((k1 >= 0.804693)&&(k1 < 1)) {
                jdays = 355;
                wbeg = 6;
            }
        } else
        if (r1 >= 12) {
            if ((k1 >= 0)&&(k1 < 0.157466)) {
                jdays = 383;
                wbeg = 1;
            } else
            if ((k1 >= 0.157466)&&(k1 < 0.285711)) {
                jdays = 385;
                wbeg = 1;
            } else
            if ((k1 >= 0.285711)&&(k1 < 0.428570)) {
                jdays = 384;
                wbeg = 2;
            } else
            if ((k1 >= 0.428570)&&(k1 < 0.533590)) {
                jdays = 384;
                wbeg = 4;
            } else
            if ((k1 >= 0.533590)&&(k1 < 0.714282)) {
                jdays = 385;
                wbeg = 4;
            } else
            if ((k1 >= 0.714282)&&(k1 < 0.871750)) {
                jdays = 383;
                wbeg = 6;
            } else
            if ((k1 >= 0.871750)&&(k1 < 1)) {
                jdays = 385;
                wbeg = 6;
            }
        }

        return new CharacterOfJewishYear(hj,jdays,wbeg,nmo);
    };

    /**
     * Converts a Jewish calendar date to a JDC.
     *
     * Algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 71-73.
     *
     * @param calendarDate Jewish calendar date to be converted to JDC.
     * @returns JDC representing the given Jewish calendar date.
     */
    export const jewishToJDC = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDC => {

        let hj = calendarDate.year;
        const mj = calendarDate.month;
        let dj = calendarDate.day;

        if (calendarDate.daytime !== undefined) {
            dj = dj + calendarDate.daytime;
        }

        /* Calculate the distance of the Jewish date to Pesach feast date on Nisan 15
         * (mj = 8, dj = 15)*/
        let daydiff = JewishDaydiff(calendarDate);

        /* Calculate the corresponding Julian date of the Pesach feast*/
        let pesach = Pesachfeast(calendarDate);
        let jde = pesach + daydiff;

        /* Calculate the corresponding Julian date of New Year*/
        let jdenewyear = pesach + 163;

        /* If the Julian day number of the chosen date is larger than the Julian day number of Jewish New Year redo
        *  everything for the next Jewish year*/
        if (jde>jdenewyear) {
            hj = hj + 1;
            let daydiff = JewishDaydiff(new JDNConvertibleCalendarModule.CalendarDate(hj,mj,dj));
            let pesach = Pesachfeast(new JDNConvertibleCalendarModule.CalendarDate(hj,mj,dj));
            let jde = pesach + daydiff;
        }

        return jde;

    };

    /**
     * Converts a Jewish calendar date to a JDN.
     *
     * @param calendarDate Jewish calendar date to be converted to JDN.
     * @returns JDN representing the given Jewish calendar date.
     */
    export const jewishToJDN = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDN => {
        const jdc = jewishToJDC(calendarDate);

        return truncateDecimals(jdc + 0.5); // adaption because full number without fraction of JDC represents noon.
    };

    /**
     * Converts a JDC date to a Jewish calendar date.
     *
     * Algorithm from:
     * Jean Meeus, Astronomical Algorithms, 1998, 71-73 and
     * Slonimnski formula: see Dershowitz & Reingold, Calendrical Calculations, 2008, 96 ff. and
     * https://de.wikipedia.org/wiki/Slonimski-Formel
     *
     * @param JDC to be converted to Jewish calendar date.
     * @returns Jewish calendar date.
     */
    export const JDCToJewish = (jdc: JDC): JDNConvertibleCalendarModule.CalendarDate => {

        // convert given JDC into a Julian calendar date
        const julianCalendarDate: JDNConvertibleCalendarModule.CalendarDate = JDCToJulian(jdc);

        let x = julianCalendarDate.year;
        let m = julianCalendarDate.month;
        let d = julianCalendarDate.day;

        /* Determine the Julian day number of the Pesach feast (m = 8, d = 15) of the corresponding Jewish year*/
        let hj = x + 3760;
        let pesach = Pesachfeast(new JDNConvertibleCalendarModule.CalendarDate(hj, 8, 15));

        /* Determine the Julian day number of the following Jewish New Year*/
        let jdenewyear = pesach + 163;

        /* Determine the Jewish calendar date by establishing its distance from the Pesach feast date*/
        let data = JewishDayDate(jdc, pesach, jdenewyear);
        hj = data.year;
        const mj = data.month;
        const dj = data.day;

        return new JDNConvertibleCalendarModule.CalendarDate(hj, mj, dj, undefined, julianCalendarDate.daytime);

    };

    /**
     * Converts a JDN to an Jewish calendar date.
     *
     * @param jdn JDN to be converted to a Jewish calendar date.
     * @returns @returns Jeiwsh calendar date created from given JDN.
     */
    export const JDNToJewish = (jdn: JDN): JDNConvertibleCalendarModule.CalendarDate => {
        return JDCToJewish(jdn);
    };

    /**
     * Function that determines the difference in days of a given Jewish date from the date of the Pesach feast.
     * The Pesach feast date is fixed: mj = 8, dj = 15
     *
     * @returns daydiff: day difference of a given Jewish date from the Pesach feast date.
     */
    export const JewishDaydiff = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDC => {
    /*export const JewishDaydiff = (hj: number, mj: number, dj: number): number => {*/
        const hj = calendarDate.year;
        const mj = calendarDate.month;
        const dj = calendarDate.day;

        const data = JewishCharact(hj);
        const jdays = data.jdays;

        let daydiff = 0;

        /* If the date in question is in between Pesach feast and New Year (m = 1, d = 1)*/
        if (mj==8) {
            daydiff = dj - 15;
        }
        if (mj==9) {
            daydiff = dj + 15;
        }
        if (mj==10) {
            daydiff = dj + 44;
        }
        if (mj==11) {
            daydiff = dj + 74;
        }
        if (mj==12) {
            daydiff = dj + 103;
        }
        if (mj==13) {
            daydiff = dj + 133;
        }

        /* If the date in question is in between New Year and Pesach feast it is necessary to
         * distinguish, since the months are of variable length depending on the character of
         * the Jewish year determined by the Slonimski formula.*/

        /* In a deficient normal year:*/
        if (jdays==353) {
            if (mj==1) {
                daydiff = dj - 191;
            }
            if (mj==2) {
                daydiff = dj - 161;
            }
            if (mj==3) {
                daydiff = dj - 132;
            }
            if (mj==4) {
                daydiff = dj - 103;
            }
            if (mj==5) {
                daydiff = dj - 74;
            }
            if (mj==6) {
                daydiff = dj - 44;
            }
        }

        /* In a regular normal year:*/
        if (jdays==354) {
            if (mj==1) {
                daydiff = dj - 192;
            }
            if (mj==2) {
                daydiff = dj - 162;
            }
            if (mj==3) {
                daydiff = dj - 133;
            }
            if (mj==4) {
                daydiff = dj - 103;
            }
            if (mj==5) {
                daydiff = dj - 74;
            }
            if (mj==6) {
                daydiff = dj - 44;
            }
        }

        /* In an excessive normal year:*/
        if (jdays==355) {
            if (mj==1) {
                daydiff = dj - 193;
            }
            if (mj==2) {
                daydiff = dj - 163;
            }
            if (mj==3) {
                daydiff = dj - 133;
            }
            if (mj==4) {
                daydiff = dj - 103;
            }
            if (mj==5) {
                daydiff = dj - 74;
            }
            if (mj==6) {
                daydiff = dj - 44;
            }
        }

        /* In a deficient leap year:*/
        if (jdays==383) {
            if (mj==1) {
                daydiff = dj - 221;
            }
            if (mj==2) {
                daydiff = dj - 191;
            }
            if (mj==3) {
                daydiff = dj - 162;
            }
            if (mj==4) {
                daydiff = dj - 133;
            }
            if (mj==5) {
                daydiff = dj - 104;
            }
            if (mj==6) {
                daydiff = dj - 74;
            }
            if (mj==7) {
                daydiff = dj - 44;
            }
        }

        /* In a regular leap year:*/
        if (jdays==384) {
            if (mj==1) {
                daydiff = dj - 222;
            }
            if (mj==2) {
                daydiff = dj - 192;
            }
            if (mj==3) {
                daydiff = dj - 163;
            }
            if (mj==4) {
                daydiff = dj - 133;
            }
            if (mj==5) {
                daydiff = dj - 104;
            }
            if (mj==6) {
                daydiff = dj - 74;
            }
            if (mj==7) {
                daydiff = dj - 44;
            }
        }

        /* In an excessive leap year:*/
        if (jdays==385) {
            if (mj==1) {
                daydiff = dj - 223;
            }
            if (mj==2) {
                daydiff = dj - 193;
            }
            if (mj==3) {
                daydiff = dj - 163;
            }
            if (mj==4) {
                daydiff = dj - 133;
            }
            if (mj==5) {
                daydiff = dj - 104;
            }
            if (mj==6) {
                daydiff = dj - 74;
            }
            if (mj==7) {
                daydiff = dj - 44;
            }
        }

        return daydiff;
    };

    /**
     * Function that calculates the corresponding Julian day number of the Pesach feast of a Jewish year.
     *
     * @returns jdepesach: Julian day number of the day of the Pesach feast.
     */
     export const Pesachfeast = (calendarDate: JDNConvertibleCalendarModule.CalendarDate): JDN => {

        const hj = calendarDate.year;

        let jj =  hj - 3760;
        let jj1 = truncateDecimals(jj);
        let c1 = Math.floor(jj/100);
        let s = Math.floor((3 * c1 - 5) / 4);
        if (jj<1583) {
            s = 0;
        }
        let a1 = 12 * jj + 12;
        a1 = a1 % 19;
        if (a1<0) {
            a1 = a1 + 19;
        }
        let b1 = jj % 4;
        if (b1<0) {
            b1 = b1 + 4;
        }

        const q = -1.904412361576 + 1.554241796621 * a1 + 0.25 * b1 - 0.003177794022 * jj + s;
        let j = Math.floor(q) + 3 * jj + 5 * b1 + 2 - s;
        j = j % 7;
        if (j<0) {
            j = j + 7;
        }
        let r = q - Math.floor(q);

        let dpesach = Math.floor(q) + 22;
        if((j==2)||(j==4)||(j==6)) {
            dpesach = Math.floor(q) + 23;
        }
        if((j==1)&&(a1>6)&&(r>=0.632870370)) {
            dpesach = Math.floor(q) + 24;
        }
        if((j==0)&&(a1>11)&&(r>=0.897723765)) {
            dpesach = Math.floor(q) + 23;
        }

        let mpesach = 3;
        if (dpesach==0) {
            dpesach = 31;
        }
        if (dpesach>31) {
            mpesach = mpesach + 1;
            dpesach = dpesach - 31;
        }
        const jdepesach = julianDayFromGregorianJulianDate(new JDNConvertibleCalendarModule.CalendarDate(jj1, mpesach, dpesach));

        return jdepesach;
     }

    /**
     * Function that determines the Jewish month and day.
     *
     * @returns hj, mj, dj: Jewish year, month and day.
     */

    export const JewishDayDate = (jdc: JDC, pesach: number, jdenewyear: number) : JDNConvertibleCalendarModule.CalendarDate => {

        // convert given JDC into a Julian calendar date
        const julianCalendarDate: JDNConvertibleCalendarModule.CalendarDate = JDCToJulian(jdc);
        let hj = julianCalendarDate.year;

        let jdediff = 0;
        let mj = 0;
        let dj = 0;

        /* If date is in between the Pesach feast and Jewish New Year */
        if ((jdc>=pesach)&&(jdc<=jdenewyear)) {
            jdediff = jdc - pesach;
            if (jdediff==163) {
                mj = 1;
                dj = 1;
                hj  = hj + 1;
            }
            if (jdediff<=15) {
                mj = 8;
                dj = jdediff + 15;
            }
            if ((jdediff>15)&&(jdediff<=44)) {
                mj = 9;
                dj = jdediff - 15;
            }
            if ((jdediff>44)&&(jdediff<=74)) {
                mj = 10;
                dj = jdediff - 44;
            }
            if ((jdediff>74)&&(jdediff<=103)) {
                mj = 11;
                dj = jdediff - 74;
            }
            if ((jdediff>103)&&(jdediff<=133)) {
                mj = 12;
                dj = jdediff - 103;
            }
            if ((jdediff>133)&&(jdediff<=162)) {
                mj = 13;
                dj = jdediff - 133;
            }
        }

        let jdays = 0;
        /* If date is in between Jewish New Year and the Pesach feast */
        if (jdc<pesach) {
            hj = hj - 1;
            const data = JewishCharact(hj);
            let jdays = data.jdays;
            jdenewyear = jdenewyear - jdays;
            jdediff = jdc - jdenewyear;
        }
        if ((jdc>jdenewyear)&&(jdc>pesach)) {
            const data = JewishCharact(hj);
            let jdays = data.jdays;
            jdediff = jdc - jdenewyear;
        }

        /* If the Jewish year is a deficient normal year*/
        if (jdays==353) {
            if (jdediff<30) {
                mj = 1;
                dj = jdediff + 1;
            }
            if ((jdediff>=30)&&(jdediff<59)) {
                mj = 2;
                dj = jdediff - 29;
            }
            if ((jdediff>=59)&&(jdediff<88)) {
                mj = 3;
                dj = jdediff - 58;
            }
            if ((jdediff>=88)&&(jdediff<117)) {
                mj = 4;
                dj = jdediff - 87;
            }
            if ((jdediff>=117)&&(jdediff<147)) {
                mj = 5;
                dj = jdediff - 116;
            }
            if ((jdediff>=147)&&(jdediff<176)) {
                mj = 6;
                dj = jdediff - 146;
            }
            if ((jdediff>=176)&&(jdediff<191)) {
                mj = 8;
                dj = jdediff - 175;
            }
        }

        /* If the Jewish year is a regular normal year*/
        if (jdays==354) {
            if (jdediff<30) {
                mj = 1;
                dj = jdediff + 1;
            }
            if ((jdediff>=30)&&(jdediff<59)) {
                mj = 2;
                dj = jdediff - 29;
            }
            if ((jdediff>=59)&&(jdediff<89)) {
                mj = 3;
                dj = jdediff - 58;
            }
            if ((jdediff>=89)&&(jdediff<118)) {
                mj = 4;
                dj = jdediff - 88;
            }
            if ((jdediff>=118)&&(jdediff<148)) {
                mj = 5;
                dj = jdediff - 117;
            }
            if ((jdediff>=148)&&(jdediff<177)) {
                mj = 6;
                dj = jdediff - 147;
            }
            if ((jdediff>=177)&&(jdediff<192)) {
                mj = 8;
                dj = jdediff - 176;
            }
        }

        /* If the Jewish year is an excessive normal year*/
        if (jdays==355) {
            if (jdediff<30) {
                mj = 1;
                dj = jdediff + 1;
            }
            if ((jdediff>=30)&&(jdediff<60)) {
                mj = 2;
                dj = jdediff - 29;
            }
            if ((jdediff>=60)&&(jdediff<90)) {
                mj = 3;
                dj = jdediff - 59;
            }
            if ((jdediff>=90)&&(jdediff<119)) {
                mj = 4;
                dj = jdediff - 89;
            }
            if ((jdediff>=119)&&(jdediff<149)) {
                mj = 5;
                dj = jdediff - 118;
            }
            if ((jdediff>=149)&&(jdediff<178)) {
                mj = 6;
                dj = jdediff - 148;
            }
            if ((jdediff>=178)&&(jdediff<193)) {
                mj = 8;
                dj = jdediff - 177;
            }
        }

        /* If the Jewish year is a deficient leap year*/
        if (jdays==383) {
            if (jdediff<30) {
                mj = 1;
                dj = jdediff + 1;
            }
            if ((jdediff>=30)&&(jdediff<59)) {
                mj = 2;
                dj = jdediff - 29;
            }
            if ((jdediff>=59)&&(jdediff<88)) {
                mj = 3;
                dj = jdediff - 58;
            }
            if ((jdediff>=88)&&(jdediff<117)) {
                mj = 4;
                dj = jdediff - 87;
            }
            if ((jdediff>=117)&&(jdediff<147)) {
                mj = 5;
                dj = jdediff - 116;
            }
            if ((jdediff>=147)&&(jdediff<177)) {
                mj = 6;
                dj = jdediff - 146;
            }
            if ((jdediff>=177)&&(jdediff<206)) {
                mj = 7;
                dj = jdediff - 176;
            }
            if ((jdediff>=206)&&(jdediff<221)) {
                mj = 8;
                dj = jdediff - 205;
            }
        }

        /* If the Jewish year is a regular leap year*/
        if (jdays==384) {
            if (jdediff<30) {
                mj = 1;
                dj = jdediff + 1;
            }
            if ((jdediff>=30)&&(jdediff<59)) {
                mj = 2;
                dj = jdediff - 29;
            }
            if ((jdediff>=59)&&(jdediff<89)) {
                mj = 3;
                dj = jdediff - 58;
            }
            if ((jdediff>=89)&&(jdediff<118)) {
                mj = 4;
                dj = jdediff - 88;
            }
            if ((jdediff>=118)&&(jdediff<148)) {
                mj = 5;
                dj = jdediff - 117;
            }
            if ((jdediff>=148)&&(jdediff<178)) {
                mj = 6;
                dj = jdediff - 147;
            }
            if ((jdediff>=178)&&(jdediff<207)) {
                mj = 7;
                dj = jdediff - 177;
            }
            if ((jdediff>=207)&&(jdediff<222)) {
                mj = 8;
                dj = jdediff - 206;
            }
        }

        /* If the Jewish year is an excessive leap year*/
        if (jdays==385) {
            if (jdediff<30) {
                mj = 1;
                dj = jdediff + 1;
            }
            if ((jdediff>=30)&&(jdediff<60)) {
                mj = 2;
                dj = jdediff - 29;
            }
            if ((jdediff>=60)&&(jdediff<90)) {
                mj = 3;
                dj = jdediff - 59;
            }
            if ((jdediff>=90)&&(jdediff<119)) {
                mj = 4;
                dj = jdediff - 89;
            }
            if ((jdediff>=119)&&(jdediff<149)) {
                mj = 5;
                dj = jdediff - 118;
            }
            if ((jdediff>=149)&&(jdediff<179)) {
                mj = 6;
                dj = jdediff - 148;
            }
            if ((jdediff>=179)&&(jdediff<208)) {
                mj = 7;
                dj = jdediff - 178;
            }
            if ((jdediff>=208)&&(jdediff<223)) {
                mj = 8;
                dj = jdediff - 207;
            }
        }

        return new JDNConvertibleCalendarModule.CalendarDate(hj,mj,dj);

    }

}
