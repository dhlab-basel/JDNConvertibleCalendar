/*
 * Copyright © 2019 Lukas Rosenthaler, Rita Gautschy, Benjamin Geer, Ivan Subotic,
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

import names from './names.json';

interface Weekdays {

    long: string[];

    short?: string[];

    narrow?: string[];
}

interface LocaleToWeekdays {

    [locale: string]: Weekdays;

}

interface Months {

    long: string[];

    short?: string[];

}

interface LocaleToMonths {

    [locale: string]: Months;
}

interface Names {

    weekdays: LocaleToWeekdays;

    months: LocaleToMonths;


}

interface Calendars {

    [calendar: string]: Names;

}

export module JDNConvertibleCalendarNames {

    const defaultLocale = 'en';
    const defaultFormat = 'long';

    export const getWeekdayNames = (calendar: 'Gregorian' | 'Julian' | 'Islamic', locale: string, format: 'long' | 'short' | 'narrow'): string[] => {

        const labels: Calendars = names;

        let weekdays: Weekdays;

        // get the weekdays for the given calendar in the preferred locale, if available.
        if (labels[calendar].weekdays.hasOwnProperty(locale)) {
            weekdays = labels[calendar].weekdays[locale];
        } else {
            weekdays = labels[calendar].weekdays[defaultLocale];
        }

        let weekydayNames: string[];

        // get the requested format, if available.
        if (weekdays.hasOwnProperty(format)) {
            weekydayNames = weekdays[format] as string[];
        } else {
            weekydayNames = weekdays[defaultFormat];
        }

        return weekydayNames;

    };

    export const getMonthNames = (calendar: 'Gregorian' | 'Julian' | 'Islamic', locale: string, format: 'long' | 'short'): string[] => {

        const labels: Calendars = names;

        let months: Months;

        // get the month names for the given calendar in the preferred locale, if available.
        if (labels[calendar].months.hasOwnProperty(locale)) {
            months = labels[calendar].months[locale];
        } else {
            months = labels[calendar].months[defaultLocale];
        }

        let monthsNames: string[];

        // get the requested format, if available.
        if (months.hasOwnProperty(format)) {
            monthsNames = months[format] as string[];
        } else {
            monthsNames = months[defaultFormat];
        }

        return monthsNames;
    }

}