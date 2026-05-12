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

import { CalendarDate } from '../src/CalendarDate';
import { JDNConvertibleConversionModule } from '../src/JDNCalendarConversion';
import { GregorianCalendarDate, HebrewCalendarDate, JDNConvertibleCalendar } from '../src/JDNConvertibleCalendar';
import { JDNPeriod } from '../src/JDNPeriod';
import { CalendarPeriod } from '../src/CalendarPeriod';

let assert = require('assert');

// ---------------------------------------------------------------------------
// Helpers (mirrors the pattern in conversions.ts)
// ---------------------------------------------------------------------------

const checkCalendarDate = (expected: CalendarDate, received: CalendarDate, checkDayOfWeek: Boolean = true) => {
    assert.strictEqual(received.year,  expected.year,  `year:  got ${received.year}  expected ${expected.year}`);
    assert.strictEqual(received.month, expected.month, `month: got ${received.month} expected ${expected.month}`);
    assert.strictEqual(received.day,   expected.day,   `day:   got ${received.day}   expected ${expected.day}`);
    if (checkDayOfWeek) {
        assert.strictEqual(received.dayOfWeek, expected.dayOfWeek,
            `dayOfWeek: got ${received.dayOfWeek} expected ${expected.dayOfWeek}`);
    }
};

const checkJDN = (expected: number, received: number) => {
    assert.strictEqual(Math.floor(received), received, `JDN has fraction: ${received}`);
    assert.strictEqual(received, expected, `JDN: got ${received} expected ${expected}`);
};

// ---------------------------------------------------------------------------
// Reference data
//
// All Hebrew↔Gregorian cross-checks verified against:
//   • Reingold & Dershowitz, "Calendrical Calculations" 4th ed., appendix C
//   • https://www.hebcal.com/converter
//
// JDNs verified with:
//   • https://aa.usno.navy.mil/data/JulianDate
//   • Jean Meeus, "Astronomical Algorithms" 2nd ed., pp. 59–66
//
// Spot-checks used:
//   Gregorian 2024-10-03  =  1 Tishri 5785  (Rosh Hashana)   JDN 2460587
//   Gregorian 2024-04-23  =  15 Nisan 5784  (Pesach)          JDN 2460424
//   Gregorian 1987-01-27  =  27 Shevat 5747                   JDN 2446823
//   Gregorian 2000-01-01  =  24 Tevet 5760                    JDN 2451545
//   Gregorian 2023-12-07  =  24 Kislev 5784 (Hanukkah day 1)  JDN 2460286
//   Gregorian 2024-03-13  =  3 Adar II 5784 (leap year)       JDN 2460383
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1.  Low-level conversion functions
// ---------------------------------------------------------------------------

describe('hebrewToJDN – converting a Hebrew calendar date to a JDN', () => {

    it('1 Tishri 5785 (Rosh Hashana 2024) → JDN 2460587', () => {
        const hebrewDate = new CalendarDate(5785, 7, 1);
        checkJDN(2460587, JDNConvertibleConversionModule.hebrewToJDN(hebrewDate));
    });

    it('15 Nisan 5784 (Pesach 2024) → JDN 2460424', () => {
        const hebrewDate = new CalendarDate(5784, 1, 15);
        checkJDN(2460424, JDNConvertibleConversionModule.hebrewToJDN(hebrewDate));
    });

    it('27 Shevat 5747 (1987-01-27) → JDN 2446823', () => {
        const hebrewDate = new CalendarDate(5747, 11, 27);
        checkJDN(2446823, JDNConvertibleConversionModule.hebrewToJDN(hebrewDate));
    });

    it('24 Tevet 5760 (2000-01-01) → JDN 2451545', () => {
        const hebrewDate = new CalendarDate(5760, 10, 24);
        checkJDN(2451545, JDNConvertibleConversionModule.hebrewToJDN(hebrewDate));
    });

    it('24 Kislev 5784 (Hanukkah day 1, 2023-12-07) → JDN 2460286', () => {
        const hebrewDate = new CalendarDate(5784, 9, 24);
        checkJDN(2460286, JDNConvertibleConversionModule.hebrewToJDN(hebrewDate));
    });

    it('3 Adar II 5784 (leap year month 13, 2024-03-13) → JDN 2460383', () => {
        const hebrewDate = new CalendarDate(5784, 13, 3);
        checkJDN(2460383, JDNConvertibleConversionModule.hebrewToJDN(hebrewDate));
    });

});

describe('JDNToHebrew – converting a JDN to a Hebrew calendar date', () => {

    it('JDN 2460587 → 1 Tishri 5785 (Rosh Hashana 2024)', () => {
        const result = JDNConvertibleConversionModule.JDNToHebrew(2460587);
        checkCalendarDate(new CalendarDate(5785, 7, 1), result, false);
    });

    it('JDN 2460424 → 15 Nisan 5784 (Pesach 2024)', () => {
        const result = JDNConvertibleConversionModule.JDNToHebrew(2460424);
        checkCalendarDate(new CalendarDate(5784, 1, 15), result, false);
    });

    it('JDN 2446823 → 27 Shevat 5747 (1987-01-27)', () => {
        const result = JDNConvertibleConversionModule.JDNToHebrew(2446823);
        checkCalendarDate(new CalendarDate(5747, 11, 27), result, false);
    });

    it('JDN 2451545 → 24 Tevet 5760 (2000-01-01)', () => {
        const result = JDNConvertibleConversionModule.JDNToHebrew(2451545);
        checkCalendarDate(new CalendarDate(5760, 10, 24), result, false);
    });

    it('JDN 2460286 → 24 Kislev 5784 (Hanukkah day 1, 2023-12-07)', () => {
        const result = JDNConvertibleConversionModule.JDNToHebrew(2460286);
        checkCalendarDate(new CalendarDate(5784, 9, 24), result, false);
    });

    it('JDN 2460383 → 3 Adar II 5784 (leap year, 2024-03-13)', () => {
        const result = JDNConvertibleConversionModule.JDNToHebrew(2460383);
        checkCalendarDate(new CalendarDate(5784, 13, 3), result, false);
    });

});

describe('hebrewToJDN / JDNToHebrew round-trip', () => {

    const roundTrip = (year: number, month: number, day: number) => {
        const original = new CalendarDate(year, month, day);
        const jdn = JDNConvertibleConversionModule.hebrewToJDN(original);
        const recovered = JDNConvertibleConversionModule.JDNToHebrew(jdn);
        checkCalendarDate(new CalendarDate(year, month, day), recovered, false);
    };

    it('round-trip: 1 Tishri 5785', ()  => roundTrip(5785, 7, 1));
    it('round-trip: 15 Nisan 5784', ()  => roundTrip(5784, 1, 15));
    it('round-trip: 29 Elul 5783', ()   => roundTrip(5783, 6, 29));
    it('round-trip: 1 Nisan 5780', ()   => roundTrip(5780, 1, 1));
    it('round-trip: 1 Adar II 5784 (leap)', () => roundTrip(5784, 13, 1));
    it('round-trip: 30 Cheshvan 5784 (complete year)', () => roundTrip(5784, 8, 30));

});

// ---------------------------------------------------------------------------
// 2.  Helper functions
// ---------------------------------------------------------------------------

describe('hebrewMonthsInYear', () => {

    it('5784 is a leap year (13 months)', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewMonthsInYear(5784), 13);
    });

    it('5785 is a regular year (12 months)', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewMonthsInYear(5785), 12);
    });

    it('5782 is a leap year (13 months)', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewMonthsInYear(5782), 13);
    });

    it('5783 is a regular year (12 months)', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewMonthsInYear(5783), 12);
    });

});

describe('hebrewDaysInMonth', () => {

    it('Nisan (month 1) always has 30 days', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewDaysInMonth(5785, 1), 30);
    });

    it('Iyyar (month 2) always has 29 days', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewDaysInMonth(5785, 2), 29);
    });

    it('Tishri (month 7) always has 30 days', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewDaysInMonth(5785, 7), 30);
    });

    it('Adar (month 12) has 29 days in a regular year', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewDaysInMonth(5785, 12), 29);
    });

    it('Adar I (month 12) has 30 days in a leap year', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewDaysInMonth(5784, 12), 30);
    });

    it('Adar II (month 13) has 29 days in a leap year', () => {
        assert.strictEqual(JDNConvertibleConversionModule.hebrewDaysInMonth(5784, 13), 29);
    });

});

// ---------------------------------------------------------------------------
// 3.  HebrewCalendarDate class
// ---------------------------------------------------------------------------

describe('HebrewCalendarDate constructed from CalendarPeriod', () => {

    it('1 Tishri 5785 from CalendarPeriod', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        const period = date.toCalendarPeriod();
        checkCalendarDate(new CalendarDate(5785, 7, 1), period.periodStart, false);
    });

    it('3 Adar II 5784 from CalendarPeriod (leap month)', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5784, 13, 3),
            new CalendarDate(5784, 13, 3)
        ));
        const period = date.toCalendarPeriod();
        checkCalendarDate(new CalendarDate(5784, 13, 3), period.periodStart, false);
    });

});

describe('HebrewCalendarDate constructed from JDNPeriod', () => {

    it('JDN 2460587 → 1 Tishri 5785', () => {
        const date = new HebrewCalendarDate(new JDNPeriod(2460587, 2460587));
        const period = date.toCalendarPeriod();
        checkCalendarDate(new CalendarDate(5785, 7, 1), period.periodStart, false);
    });

    it('JDN 2460383 → 3 Adar II 5784 (leap year)', () => {
        const date = new HebrewCalendarDate(new JDNPeriod(2460383, 2460383));
        const period = date.toCalendarPeriod();
        checkCalendarDate(new CalendarDate(5784, 13, 3), period.periodStart, false);
    });

});

describe('HebrewCalendarDate.monthsInYear', () => {

    it('returns 13 for a leap year', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5784, 7, 1),
            new CalendarDate(5784, 7, 1)
        ));
        assert.strictEqual(date.monthsInYear(5784), 13);
    });

    it('returns 12 for a regular year', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        assert.strictEqual(date.monthsInYear(5785), 12);
    });

});

describe('HebrewCalendarDate.daysInMonth', () => {

    it('Tishri (month 7) = 30 days', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        assert.strictEqual(date.daysInMonth(new CalendarDate(5785, 7, 1)), 30);
    });

    it('Adar II (month 13) = 29 days in leap year 5784', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5784, 13, 1),
            new CalendarDate(5784, 13, 1)
        ));
        assert.strictEqual(date.daysInMonth(new CalendarDate(5784, 13, 1)), 29);
    });

});

// ---------------------------------------------------------------------------
// 4.  convertCalendar – conversions to/from Hebrew
// ---------------------------------------------------------------------------

describe('convertCalendar: Gregorian → Hebrew', () => {

    it('2024-10-03 (Gregorian) → 1 Tishri 5785 (Hebrew)', () => {
        const greg = new GregorianCalendarDate(new CalendarPeriod(
            new CalendarDate(2024, 10, 3),
            new CalendarDate(2024, 10, 3)
        ));
        const hebrew = greg.convertCalendar('Hebrew') as HebrewCalendarDate;
        checkCalendarDate(new CalendarDate(5785, 7, 1), hebrew.toCalendarPeriod().periodStart, false);
    });

    it('2024-04-23 (Gregorian) → 15 Nisan 5784 (Pesach)', () => {
        const greg = new GregorianCalendarDate(new CalendarPeriod(
            new CalendarDate(2024, 4, 23),
            new CalendarDate(2024, 4, 23)
        ));
        const hebrew = greg.convertCalendar('Hebrew') as HebrewCalendarDate;
        checkCalendarDate(new CalendarDate(5784, 1, 15), hebrew.toCalendarPeriod().periodStart, false);
    });

    it('2024-03-13 (Gregorian) → 3 Adar II 5784 (leap month)', () => {
        const greg = new GregorianCalendarDate(new CalendarPeriod(
            new CalendarDate(2024, 3, 13),
            new CalendarDate(2024, 3, 13)
        ));
        const hebrew = greg.convertCalendar('Hebrew') as HebrewCalendarDate;
        checkCalendarDate(new CalendarDate(5784, 13, 3), hebrew.toCalendarPeriod().periodStart, false);
    });

});

describe('convertCalendar: Hebrew → Gregorian', () => {

    it('1 Tishri 5785 → 2024-10-03 (Gregorian)', () => {
        const hebrew = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        const greg = hebrew.convertCalendar('Gregorian') as GregorianCalendarDate;
        checkCalendarDate(new CalendarDate(2024, 10, 3), greg.toCalendarPeriod().periodStart, false);
    });

    it('15 Nisan 5784 → 2024-04-23 (Gregorian)', () => {
        const hebrew = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5784, 1, 15),
            new CalendarDate(5784, 1, 15)
        ));
        const greg = hebrew.convertCalendar('Gregorian') as GregorianCalendarDate;
        checkCalendarDate(new CalendarDate(2024, 4, 23), greg.toCalendarPeriod().periodStart, false);
    });

    it('3 Adar II 5784 → 2024-03-13 (Gregorian)', () => {
        const hebrew = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5784, 13, 3),
            new CalendarDate(5784, 13, 3)
        ));
        const greg = hebrew.convertCalendar('Gregorian') as GregorianCalendarDate;
        checkCalendarDate(new CalendarDate(2024, 3, 13), greg.toCalendarPeriod().periodStart, false);
    });

});

describe('convertCalendar: Hebrew → Hebrew (no-op)', () => {

    it('converting Hebrew to Hebrew returns the same instance', () => {
        const hebrew = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        const same = hebrew.convertCalendar('Hebrew');
        assert.strictEqual(same, hebrew);
    });

});

// ---------------------------------------------------------------------------
// 5.  transposePeriodByDay
// ---------------------------------------------------------------------------

describe('HebrewCalendarDate.transposePeriodByDay', () => {

    it('shifting 1 Tishri 5785 by +1 day gives 2 Tishri 5785', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        date.transposePeriodByDay(1);
        checkCalendarDate(new CalendarDate(5785, 7, 2), date.toCalendarPeriod().periodStart, false);
    });

    it('shifting 30 Tishri 5785 by +1 day crosses into Cheshvan', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 30),
            new CalendarDate(5785, 7, 30)
        ));
        date.transposePeriodByDay(1);
        checkCalendarDate(new CalendarDate(5785, 8, 1), date.toCalendarPeriod().periodStart, false);
    });

    it('shifting 1 Tishri 5785 by -1 day crosses back into 29 Elul 5784', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        date.transposePeriodByDay(-1);
        checkCalendarDate(new CalendarDate(5784, 6, 29), date.toCalendarPeriod().periodStart, false);
    });

});

// ---------------------------------------------------------------------------
// 6.  transposePeriodByMonth
// ---------------------------------------------------------------------------

describe('HebrewCalendarDate.transposePeriodByMonth', () => {

    it('shifting 1 Tishri 5785 by +1 month gives 1 Cheshvan 5785', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        date.transposePeriodByMonth(1);
        checkCalendarDate(new CalendarDate(5785, 8, 1), date.toCalendarPeriod().periodStart, false);
    });

    it('shifting 1 Elul 5785 (month 6) by +1 month crosses into next year: 1 Tishri 5786', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 6, 1),
            new CalendarDate(5785, 6, 1)
        ));
        date.transposePeriodByMonth(1);
        checkCalendarDate(new CalendarDate(5786, 7, 1), date.toCalendarPeriod().periodStart, false);
    });

    it('shifting 1 Tishri 5785 by -1 month crosses back into Elul 5784', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        date.transposePeriodByMonth(-1);
        checkCalendarDate(new CalendarDate(5784, 6, 1), date.toCalendarPeriod().periodStart, false);
    });

    it('day clamping: 30 Nisan shifted to Iyyar (29 days) → 29 Iyyar', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 1, 30),
            new CalendarDate(5785, 1, 30)
        ));
        date.transposePeriodByMonth(1);
        checkCalendarDate(new CalendarDate(5785, 2, 29), date.toCalendarPeriod().periodStart, false);
    });

});

// ---------------------------------------------------------------------------
// 7.  transposePeriodByYear
// ---------------------------------------------------------------------------

describe('HebrewCalendarDate.transposePeriodByYear', () => {

    it('shifting 1 Tishri 5785 by +1 year gives 1 Tishri 5786', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        date.transposePeriodByYear(1);
        checkCalendarDate(new CalendarDate(5786, 7, 1), date.toCalendarPeriod().periodStart, false);
    });

    it('shifting 1 Tishri 5785 by -1 year gives 1 Tishri 5784', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 7, 1)
        ));
        date.transposePeriodByYear(-1);
        checkCalendarDate(new CalendarDate(5784, 7, 1), date.toCalendarPeriod().periodStart, false);
    });

    it('day clamping: 30 Adar I 5784 (leap) shifted +1 year to non-leap → 29 Adar 5785', () => {
        // 5784 is a leap year with Adar I having 30 days.
        // 5785 is a regular year where Adar (month 12) has 29 days.
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5784, 12, 30),
            new CalendarDate(5784, 12, 30)
        ));
        date.transposePeriodByYear(1);
        const result = date.toCalendarPeriod().periodStart;
        assert.strictEqual(result.year, 5785);
        assert.strictEqual(result.month, 12);
        assert.strictEqual(result.day <= 29, true, `day should be clamped to ≤ 29, got ${result.day}`);
    });

});

// ---------------------------------------------------------------------------
// 8.  Period (inexact date) support
// ---------------------------------------------------------------------------

describe('HebrewCalendarDate with inexact period (start ≠ end)', () => {

    it('period from 1 Tishri to 29 Elul of same year', () => {
        const date = new HebrewCalendarDate(new CalendarPeriod(
            new CalendarDate(5785, 7, 1),
            new CalendarDate(5785, 6, 29)  // Elul is month 6 but year-end
        ));
        const period = date.toCalendarPeriod();
        checkCalendarDate(new CalendarDate(5785, 7, 1), period.periodStart, false);
        // The end should round-trip correctly via JDN
        const endJDN = JDNConvertibleConversionModule.hebrewToJDN(new CalendarDate(5785, 6, 29));
        const endRecovered = JDNConvertibleConversionModule.JDNToHebrew(endJDN);
        checkCalendarDate(new CalendarDate(5785, 6, 29), endRecovered, false);
    });

    it('transposing a period by day shifts both endpoints', () => {
        const date = new HebrewCalendarDate(new JDNPeriod(2460587, 2460600));
        date.transposePeriodByDay(7);
        const jdnPeriod = date.toJDNPeriod();
        assert.strictEqual(jdnPeriod.periodStart, 2460594);
        assert.strictEqual(jdnPeriod.periodEnd, 2460607);
    });

});

// ---------------------------------------------------------------------------
// 9.  'Hebrew' is in JDNConvertibleCalendar.supportedCalendars
// ---------------------------------------------------------------------------

describe('JDNConvertibleCalendar.supportedCalendars includes Hebrew', () => {

    it('supportedCalendars contains "Hebrew"', () => {
        assert.ok(
            JDNConvertibleCalendar.supportedCalendars.indexOf('Hebrew') !== -1,
            '"Hebrew" not found in supportedCalendars'
        );
    });

});
