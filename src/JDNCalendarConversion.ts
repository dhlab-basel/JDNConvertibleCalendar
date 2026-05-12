/*
 * Copyright © 2020 Lukas Rosenthaler, Rita Gautschy, Benjamin Geer, Ivan Subotic,
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
import {TypeDefinitionsModule} from './TypeDefinitions';
import { CalendarDate } from './CalendarDate';

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
    export const gregorianToJDC = (calendarDate: CalendarDate): TypeDefinitionsModule.JDC => {

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

        let b = 0;
        let a = truncateDecimals(year/100.);
        let idate = year*10000 + month*100 + day;
        // check whether given date is before October 15th, 1582 (see README)
        if (idate >= 15821015) {
            b = 2 - a + truncateDecimals(a/4.);
        }
        else {
            b = 0;
        }

        const jdc = truncateDecimals(365.25*(year + 4716)) +
            truncateDecimals(30.6001*(month + 1)) +
            day + b - 1524.5;
        return jdc;
    };


    /**
     * Converts a Gregorian calendar date to a JDN.
     *
     * @param calendarDate Gregorian calendar date to be converted to JDN.
     * @returns the JDN representing the given Gregorian calendar date.
     */
    export const gregorianToJDN = (calendarDate: CalendarDate): TypeDefinitionsModule.JDN => {
        const jdc: TypeDefinitionsModule.JDC = gregorianToJDC(calendarDate);

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
    export const JDCToGregorian = (jdc: TypeDefinitionsModule.JDC): CalendarDate => {
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
        return new CalendarDate(year, month, fullday, undefined, daytime);
    };

    /**
     * Converts a JDN to a Gregorian calendar date.
     *
     * @param jdn the given JDN.
     * @returns the Gregorian calendar date created from the given JDN.
     */
    export const JDNToGregorian = (jdn: TypeDefinitionsModule.JDN): CalendarDate => {
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
    export const julianToJDC = (calendarDate: CalendarDate): TypeDefinitionsModule.JDC => {

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
    export const julianToJDN = (calendarDate: CalendarDate): TypeDefinitionsModule.JDN => {

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
    export const JDCToJulian = (jdc: TypeDefinitionsModule.JDC): CalendarDate => {
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
        return new CalendarDate(year, month, fullday, undefined, daytime);
    };

    /**
     * Converts a JDN to a Julian calendar date.
     *
     * @param jdn JDN to be converted to a Julian calendar date.
     * @returns Julian calendar date created from given JDN.
     */
    export const JDNToJulian = (jdn: TypeDefinitionsModule.JDN): CalendarDate => {
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
    export const dayOfWeekFromJDC = (jdc: TypeDefinitionsModule.JDC) => {
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
    export const islamicToJDC = (calendarDate: CalendarDate): TypeDefinitionsModule.JDC => {

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
    export const islamicToJDN = (calendarDate: CalendarDate): TypeDefinitionsModule.JDN => {
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
    export const JDCToIslamic = (jdc: TypeDefinitionsModule.JDC): CalendarDate => {

        // convert given JDC into a Julian calendar date
        const julianCalendarDate: CalendarDate = JDCToJulian(jdc);

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

        return new CalendarDate(h, m, d, undefined, julianCalendarDate.daytime);
    };

    /**
     * Converts a JDN to an Islamic calendar date.
     *
     * @param jdn JDN to be converted to an Islamic calendar date.
     * @returns @returns Islamic calendar date created from given JDN.
     */
    export const JDNToIslamic = (jdn: TypeDefinitionsModule.JDN): CalendarDate => {
        return JDCToIslamic(jdn);
    }

    // -----------------------------------------------------------------------
    // Hebrew Calendar
    // -----------------------------------------------------------------------
    //
    // Algorithm based on:
    //   Edward M. Reingold & Nachum Dershowitz, "Calendrical Calculations",
    //   4th ed. (Cambridge University Press, 2018), chapters 7-8.
    //
    // The Hebrew calendar is a lunisolar calendar.  Years are counted from
    // the traditional epoch Anno Mundi (1 Tishri 1 AM = 7 October 3761 BCE
    // in the proleptic Julian calendar, JDN 347998).
    //
    // A regular year has 12 months; a leap year (shanah me'uberet) has 13
    // months.  A leap year occurs when (7 * year + 1) mod 19 < 7  (the
    // Metonic cycle with 7 intercalary years in every 19).
    //
    // Month lengths:
    //   1  Nisan       30
    //   2  Iyyar       29
    //   3  Sivan       30
    //   4  Tammuz      29
    //   5  Av          30
    //   6  Elul        29
    //   7  Tishri      30
    //   8  Cheshvan    29 or 30  (depends on year type)
    //   9  Kislev      30 or 29  (depends on year type)
    //  10  Tevet       29
    //  11  Shevat      30
    //  12  Adar I      30        (only in leap years; = Adar in regular years)
    //  13  Adar II     29        (only in leap years)
    //
    // The civil year starts with month 7 (Tishri).  This implementation
    // uses the *ecclesiastical* (Nisan-first) month numbering because it
    // matches the natural 1-12 / 1-13 numbering used by Reingold & Dershowitz
    // and is the most common convention in software libraries.
    //
    // JDN epoch offset: JDN 347998 = 1 Tishri 1 AM.
    // -----------------------------------------------------------------------

    /** JDN of 1 Nisan 1 AM (= 1 Tishri 1 AM minus 6 months back-calculated). */
    const HEBREW_EPOCH = 347998; // JDN of 1 Tishri 1 AM

    /**
     * Returns true if the given Hebrew year is a leap year.
     */
    const isHebrewLeapYear = (year: number): boolean => {
        return ((7 * year + 1) % 19) < 7;
    };

    /**
     * Returns the number of months in the given Hebrew year (12 or 13).
     */
    export const hebrewMonthsInYear = (year: number): number => {
        return isHebrewLeapYear(year) ? 13 : 12;
    };

    /**
     * Returns the number of days elapsed from the Hebrew epoch to the
     * beginning of the given Hebrew year (i.e. 1 Tishri of that year).
     *
     * This implements the molad-based postponement rules (dechiyot).
     */
    const hebrewYearStart = (year: number): number => {
        // Number of months elapsed before this year
        const monthsElapsed =
            235 * Math.floor((year - 1) / 19) +        // complete Metonic cycles
            12 * ((year - 1) % 19) +                   // regular years in current cycle
            Math.floor((7 * ((year - 1) % 19) + 1) / 19); // leap months in current cycle

        // Molad of Tishri (parts = 1/1080 of an hour)
        const parts = 204 + 793 * (monthsElapsed % 1080);
        const hours =
            5 +
            12 * monthsElapsed +
            793 * Math.floor(monthsElapsed / 1080) +
            Math.floor(parts / 1080);
        const conjunctionDay = 1 + 29 * monthsElapsed + Math.floor(hours / 24);
        const conjunctionParts = 1080 * (hours % 24) + (parts % 1080);

        // Apply postponement rules (dechiyot)
        let alternativeDay = conjunctionDay;

        // Rule 1 (molad zaken): if the molad is at or after 18 hours (noon + 6h)
        if (conjunctionParts >= 19440) {
            alternativeDay = conjunctionDay + 1;
        // Rule 2 (GaTaRaD): non-leap year, day of week is Tuesday (2), molad >= 9h 204p
        } else if (conjunctionDay % 7 === 2 && conjunctionParts >= 9924 && !isHebrewLeapYear(year)) {
            alternativeDay = conjunctionDay + 2;
        // Rule 3 (BeTuTaKPoT): year after leap year, day of week is Monday (1), molad >= 15h 589p
        } else if (conjunctionDay % 7 === 1 && conjunctionParts >= 16789 && isHebrewLeapYear(year - 1)) {
            alternativeDay = conjunctionDay + 1;
        }

        // Rule 4 (lo ADU Rosh): Tishri must not fall on Sunday(0), Wednesday(3), or Friday(5)
        const dayOfWeek = alternativeDay % 7;
        if (dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 5) {
            alternativeDay = alternativeDay + 1;
        }

        return alternativeDay;
    };

    /**
     * Returns the total number of days in the given Hebrew year.
     */
    const hebrewDaysInYear = (year: number): number => {
        return hebrewYearStart(year + 1) - hebrewYearStart(year);
    };

    /**
     * Returns the number of days in a given month of a given Hebrew year.
     *
     * Month numbering (Nisan = 1):
     *  1 Nisan, 2 Iyyar, 3 Sivan, 4 Tammuz, 5 Av, 6 Elul,
     *  7 Tishri, 8 Cheshvan, 9 Kislev, 10 Tevet, 11 Shevat,
     *  12 Adar I (leap) / Adar (regular), 13 Adar II (leap only)
     */
    export const hebrewDaysInMonth = (year: number, month: number): number => {
        switch (month) {
            case 1:  return 30; // Nisan
            case 2:  return 29; // Iyyar
            case 3:  return 30; // Sivan
            case 4:  return 29; // Tammuz
            case 5:  return 30; // Av
            case 6:  return 29; // Elul
            case 7:  return 30; // Tishri
            case 8:  // Cheshvan: 30 in a complete (shalem) year
                return (hebrewDaysInYear(year) % 10 === 5) ? 30 : 29;
            case 9:  // Kislev: 29 in a deficient (chaser) year
                return (hebrewDaysInYear(year) % 10 === 3) ? 29 : 30;
            case 10: return 29; // Tevet
            case 11: return 30; // Shevat
            case 12: return isHebrewLeapYear(year) ? 30 : 29; // Adar I / Adar
            case 13: return 29; // Adar II (leap years only)
            default:
                throw new Error(`Invalid Hebrew month: ${month}`);
        }
    };

    /**
     * Converts a Hebrew calendar date to a JDN.
     *
     * Month numbering follows the ecclesiastical (Nisan-first) convention:
     *   1 = Nisan … 7 = Tishri … 12 = Adar (regular) / Adar I (leap) … 13 = Adar II (leap only)
     *
     * Algorithm based on:
     *   Reingold & Dershowitz, "Calendrical Calculations", 4th ed., ch. 8.
     *
     * @param calendarDate Hebrew calendar date to be converted to JDN.
     * @returns JDN representing the given Hebrew calendar date.
     */
    export const hebrewToJDN = (calendarDate: CalendarDate): TypeDefinitionsModule.JDN => {
        const year = calendarDate.year;
        const month = calendarDate.month;
        const day = calendarDate.day;

        // Days elapsed from Hebrew epoch to start of this year (1 Tishri)
        const yearStart = hebrewYearStart(year);

        // Accumulate days for months before the requested month.
        // The year begins at Tishri (month 7), so we iterate in the
        // civil order: Tishri(7) … Adar(12/13), then Nisan(1) … Elul(6).
        let dayOfYear = day;

        // Months from Tishri (7) to the end of the year
        for (let m = 7; m < month && m <= hebrewMonthsInYear(year); m++) {
            dayOfYear += hebrewDaysInMonth(year, m);
        }
        // Months from Nisan (1) up to but not including the requested month
        // (only relevant when month < 7)
        if (month < 7) {
            // Add all months from Tishri to end of year first
            for (let m = 7; m <= hebrewMonthsInYear(year); m++) {
                dayOfYear += hebrewDaysInMonth(year, m);
            }
            // Then add months from Nisan up to (but not including) the target month
            for (let m = 1; m < month; m++) {
                dayOfYear += hebrewDaysInMonth(year, m);
            }
        }

        // yearStart is days since Hebrew epoch; add HEBREW_EPOCH to get JDN
        return HEBREW_EPOCH + yearStart + dayOfYear - 1;
    };

    /**
     * Converts a JDN to a Hebrew calendar date.
     *
     * Month numbering follows the ecclesiastical (Nisan-first) convention:
     *   1 = Nisan … 7 = Tishri … 12 = Adar (regular) / Adar I (leap) … 13 = Adar II (leap only)
     *
     * Algorithm based on:
     *   Reingold & Dershowitz, "Calendrical Calculations", 4th ed., ch. 8.
     *
     * @param jdn JDN to be converted to a Hebrew calendar date.
     * @returns Hebrew calendar date created from given JDN.
     */
    export const JDNToHebrew = (jdn: TypeDefinitionsModule.JDN): CalendarDate => {
        // Approximate the Hebrew year using the mean year length (~365.2468 days)
        const approxYear = Math.floor((jdn - HEBREW_EPOCH) / 365.2468) + 1;

        // Find the actual year: the year whose Tishri 1 is <= jdn
        let year = approxYear;
        while (HEBREW_EPOCH + hebrewYearStart(year + 1) <= jdn) {
            year++;
        }
        while (HEBREW_EPOCH + hebrewYearStart(year) > jdn) {
            year--;
        }

        // Day within the year (1-based, counting from 1 Tishri)
        const yearStartJDN = HEBREW_EPOCH + hebrewYearStart(year);
        const dayInYear = jdn - yearStartJDN + 1; // 1-based

        // Walk through months in civil order (Tishri first) to find the month
        // Civil order: 7,8,9,10,11,12[,13],1,2,3,4,5,6
        const civilOrder: number[] = [7, 8, 9, 10, 11, 12];
        if (isHebrewLeapYear(year)) civilOrder.push(13);
        civilOrder.push(1, 2, 3, 4, 5, 6);

        let remaining = dayInYear;
        let month = 7;
        for (const m of civilOrder) {
            const daysInM = hebrewDaysInMonth(year, m);
            if (remaining <= daysInM) {
                month = m;
                break;
            }
            remaining -= daysInM;
        }

        return new CalendarDate(year, month, remaining);
    };
}
