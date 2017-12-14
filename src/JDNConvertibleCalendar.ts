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

import {JDNConvertibleConversion} from "./JDNCalendarConversion";

export module JDNConvertibleCalendar {

    /**
     * Type alias for a Julian Day Number (JDN).
     */
    type JDN = number;

    /**
     * Checks if a given number is an integer.
     *
     * @param {number} num number to check for.
     * @returns {boolean}
     */
    const isInteger = (num: number) => {

        // https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
        return num % 1 === 0;
    };

    /**
     * Represents an error that occurred when using JDNConvertibleCalendar.
     */
    export class JDNConvertibleCalendarError extends Error {

        constructor(message: string) {
            super(message);

        }
    }

    /**
     * Represents a calendar date (calendar format agnostic).
     *
     * Assumes that every supported calendar format
     * can be represented by a combination of year, month, and day.
     *
     */
    export class CalendarDate {

        constructor(public readonly year: number, public readonly month: number, public readonly day: number, readonly dayOfWeek?: number) {

            // TODO: When other calendar formats than Gregorian or Julian are implemented, this may have to be changed
            if (dayOfWeek !== undefined && (!isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6)) throw new JDNConvertibleCalendarError("Invalid day of week: " + dayOfWeek)

        }

    }

    /**
     * Represents a period as two calendar dates.
     */
    export class CalendarPeriod {

        constructor(public readonly periodStart: CalendarDate, public readonly periodEnd: CalendarDate) {

        }

    }

    /**
     * Represents a period as two JDNs.
     */
    export class JDNPeriod {

        // indicates if the date is exact (day precision)
        public readonly exactDate: Boolean;

        constructor(public readonly periodStart: number, public readonly periodEnd: number) {
            if (periodStart > periodEnd) throw new JDNConvertibleCalendarError(`start of a JDNPeriod must not be greater than its end.`);

            // check that given arguments are integers (JDNs have to fractions)
            if (!(isInteger(periodStart) && isInteger(periodEnd))) {
                throw new JDNConvertibleCalendarError("JDNs are expected to be integers");
            }

            this.exactDate = (periodStart === periodEnd);

        }
    }

    /**
     * Abstract class representing any calendar format
     * that can be converted from and to a Julian Day Number (JDN).
     */
    export abstract class JDNConvertibleCalendar {

        /**
         * Constant for the Gregorian calendar format.
         */
        protected static readonly gregorian = 'Gregorian';

        /**
         * Constant for the Julian calendar format.
         */
        protected static readonly julian = 'Julian';

        /**
         * Supported calendar formats (to be extended when new subclasses are implemented)
         */
        public static readonly supportedCalendars = [JDNConvertibleCalendar.gregorian, JDNConvertibleCalendar.julian];

        /**
         * Specific calendar format of a subclass of JDNConvertibleCalendar.
         */
        public abstract readonly calendarFormat: string;

        /**
         * Indicates how many months a year has in a specific calendar format.
         */
        public abstract readonly monthsInYear: number;

        //
        // Both calendar dates and JDNs are stored in parallel to avoid unnecessary conversions (JDN to calendar date and possibly back to JDN).
        // Manipulations are exclusively performed by `this.convertJDNPeriodToCalendarPeriod` that keeps them in sync.
        //

        /**
         * Start of a given date in a specific calendar format.
         */
        protected calendarStart: CalendarDate;

        /**
         * End of a given date in a specific calendar format.
         */
        protected calendarEnd: CalendarDate;

        /**
         * Indicates if the date is exact (start and end of the given period are equal).
         */
        protected exactDate: Boolean;

        /**
         * Start of given date as JDN.
         */
        protected jdnStart: number;

        /**
         * End of given date as JDN.
         */
        protected jdnEnd: number;

        /**
         * Converts a given JDN to a calendar date.
         * This method has to be implemented for each subclass
         * (specific calendar format).
         *
         * @param {number} jdn Julian Day Number
         * @returns {JDNConvertibleCalendar.CalendarDate}
         */
        protected abstract JDNToCalendar(jdn: number): CalendarDate;

        /**
         * Converts a given calendar date to JDN.
         * This method has to be implemented for each subclass
         * (specific calendar format).
         *
         * @param {JDNConvertibleCalendar.CalendarDate} date calendar date
         * @returns {number}
         */
        protected abstract calendarToJDN(date: CalendarDate): number;

        /**
         * Calculates the day of week of a given JDN.
         *
         * @param {number} jdn Julian Day Number
         * @returns {number} day of week of the given JDN (as a 0 based index).
         */
        protected abstract dayOfWeekFromJDN(jdn: number): number;

        /**
         * Calculates number of days of the month of the given date.
         *
         * @param {JDNConvertibleCalendar.CalendarDate} date given date.
         * @returns {number} number of days in month of given date.
         */
        public daysInMonth(date: CalendarDate): number {

            // get JDN for first day of the month of the given calendar date
            const firstDayOfGivenMonth = this.calendarToJDN(new CalendarDate(date.year, date.month, 1));

            // first day of next month
            let firstDayOfNextMonth;

            // if the given date is in the last month of the year, switch to first day of the first month the next year.
            if ((date.month + 1) > this.monthsInYear) {
                firstDayOfNextMonth = this.calendarToJDN(new CalendarDate(date.year + 1, 1, 1));
            }
            else {
                // switch to the first day of the next month
                firstDayOfNextMonth = this.calendarToJDN(new CalendarDate(date.year, date.month + 1, 1));
            }

            // calculate the difference between the first day of the month of the given day
            // and the first day of the next month -> number of days of the month of the given date
            return firstDayOfNextMonth - firstDayOfGivenMonth;
        }

        /**
         * Converts the given JDN period to a calendar period and stores it.
         *
         * This method makes sure that JDNs and calendar dates are in sync.
         *
         * Do not manipulate members `this.exactDate`, `this.jdnStart`, `this.jdnEnd`, `this.calendarStart`, and `this.calendarEnd` directly,
         * use this method instead.
         *
         * @param {JDNConvertibleCalendar.JDNPeriod} jdnPeriod
         */
        protected convertJDNPeriodToCalendarPeriod(jdnPeriod: JDNPeriod): void {

            this.exactDate = jdnPeriod.exactDate;
            this.jdnStart = jdnPeriod.periodStart;
            this.jdnEnd = jdnPeriod.periodEnd;

            // check if the date is exact (start of period equals end of period)
            if (this.exactDate) {
                // only one conversion needed
                const date: CalendarDate = this.JDNToCalendar(jdnPeriod.periodStart);

                // calculate the day of the week
                const dayOfWeek = this.dayOfWeekFromJDN(jdnPeriod.periodStart);

                const dateWithDayOfWeek = new CalendarDate(date.year, date.month, date.day, dayOfWeek);

                this.calendarStart = dateWithDayOfWeek;
                this.calendarEnd = dateWithDayOfWeek;
            } else {
                // calculate the days of the week
                const dayOfWeekStart = this.dayOfWeekFromJDN(jdnPeriod.periodStart);
                const dayOfWeekEnd = this.dayOfWeekFromJDN(jdnPeriod.periodEnd);

                const dateStart = this.JDNToCalendar(jdnPeriod.periodStart);
                const dateEnd = this.JDNToCalendar(jdnPeriod.periodEnd);

                // calculate calendar dates for both start and end of period
                this.calendarStart = new CalendarDate(dateStart.year, dateStart.month, dateStart.day, dayOfWeekStart);
                this.calendarEnd = new CalendarDate(dateEnd.year, dateEnd.month, dateEnd.day, dayOfWeekEnd);

            }
        }

        /**
         * This constructor is inherited by all subclasses (no implementation in subclass required).
         *
         * @param {JDNConvertibleCalendar.JDNPeriod} jdnPeriod JDN period to create a calendar specific date from.
         */
        constructor(jdnPeriod: JDNPeriod) {
            this.convertJDNPeriodToCalendarPeriod(jdnPeriod);
        }

        /**
         * Returns the given period as two calendar dates.
         *
         * @returns {JDNConvertibleCalendar.CalendarPeriod}
         */
        public toCalendarPeriod(): CalendarPeriod {
            return new CalendarPeriod(this.calendarStart, this.calendarEnd);
        }

        /**
         * Converts an instance of JDNConvertibleCalendar to a JDNPeriod.
         *
         * @returns {JDNConvertibleCalendar.JDNPeriod}
         */
        public toJDNPeriod(): JDNPeriod {
            return new JDNPeriod(this.jdnStart, this.jdnEnd);
        }

        /**
         * Converts from one calendar format into another.
         *
         * To be extended when new subclasses are added.
         *
         * @param {"Gregorian" | "Julian"} toCalendarType calendar to convert to.
         * @returns {JDNConvertibleCalendar}
         */
        public convertCalendar(toCalendarType: 'Gregorian' | 'Julian'): JDNConvertibleCalendar {

            if (JDNConvertibleCalendar.supportedCalendars.indexOf(toCalendarType) == -1) {
                throw new JDNConvertibleCalendarError("Target calendar format not supported: " + toCalendarType);
            }

            if (this.calendarFormat == toCalendarType) return this; // no conversion needed

            const jdnPeriod: JDNPeriod = this.toJDNPeriod();

            switch (toCalendarType) {
                case JDNConvertibleCalendar.gregorian:
                    return new GregorianCalendarDate(jdnPeriod);

                case JDNConvertibleCalendar.julian:
                    return new JulianCalendarDate(jdnPeriod);
            }

        }

        /**
         * Transposes the current period by the given number of days.
         *
         * @param {number} days the number of days that the current period will be shifted.
         */
        public transposePeriod(days: number) {
            const currentPeriod = this.toJDNPeriod();

            const newPeriod = new JDNPeriod(currentPeriod.periodStart + days, currentPeriod.periodEnd + days);

            this.convertJDNPeriodToCalendarPeriod(newPeriod);
        }

    }


    /**
     * Represents a Gregorian calendar date.
     */
    export class GregorianCalendarDate extends JDNConvertibleCalendar {

        public readonly calendarFormat = JDNConvertibleCalendar.gregorian;

        public readonly monthsInYear = 12;

        protected JDNToCalendar(jdn: number): CalendarDate {
            return JDNConvertibleConversion.JDNToGregorian(jdn);
        };

        protected calendarToJDN(date: CalendarDate): number {
            return JDNConvertibleConversion.gregorianToJDN(date);
        }

        protected dayOfWeekFromJDN(jdn: number): number {
            return JDNConvertibleConversion.dayOfWeekFromJDN(jdn);
        };

    }

    /**
     * Represents a Julian calendar date.
     */
    export class JulianCalendarDate extends JDNConvertibleCalendar {

        public readonly calendarFormat = JDNConvertibleCalendar.julian;

        public readonly monthsInYear = 12;

        protected JDNToCalendar(jdn: number): CalendarDate {
            return JDNConvertibleConversion.JDNToJulian(jdn);
        }

        protected calendarToJDN(date: CalendarDate): number {
            return JDNConvertibleConversion.julianToJDN(date);
        }

        protected dayOfWeekFromJDN(jdn: number): number {
            return JDNConvertibleConversion.dayOfWeekFromJDN(jdn);
        };
    }

}