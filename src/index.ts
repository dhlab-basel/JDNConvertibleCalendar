export { CalendarDate } from "./CalendarDate";
export { CalendarPeriod } from "./CalendarPeriod";
export { JDNPeriod } from "./JDNPeriod";
export { JDNConvertibleCalendar, GregorianCalendarDate, IslamicCalendarDate, JulianCalendarDate } from "./JDNConvertibleCalendar";

import { JDNConvertibleConversionModule } from './JDNCalendarConversion';

import gregorianToJDC = JDNConvertibleConversionModule.gregorianToJDC;
import gregorianToJDN = JDNConvertibleConversionModule.gregorianToJDN;
import julianToJDC = JDNConvertibleConversionModule.julianToJDC;
import julianToJDN = JDNConvertibleConversionModule.julianToJDN;
import islamicToJDC = JDNConvertibleConversionModule.islamicToJDC;
import islamicToJDN = JDNConvertibleConversionModule.islamicToJDN;

import JDNToGregorian = JDNConvertibleConversionModule.JDNToGregorian;
import JDCToGregorian = JDNConvertibleConversionModule.JDCToGregorian;
import JDNToJulian = JDNConvertibleConversionModule.JDNToJulian;
import JDCToJulian = JDNConvertibleConversionModule.JDCToJulian;
import JDNToIslamic = JDNConvertibleConversionModule.JDNToIslamic;
import JDCToIslamic = JDNConvertibleConversionModule.JDCToIslamic;

import dayOfWeekFromJDC = JDNConvertibleConversionModule.dayOfWeekFromJDC

export {gregorianToJDC, gregorianToJDN, julianToJDC, julianToJDN, JDNToGregorian, JDCToGregorian, JDNToJulian, JDCToJulian, islamicToJDC, islamicToJDN, JDNToIslamic, JDCToIslamic, dayOfWeekFromJDC}

import { JDNConvertibleCalendarNames } from './JDNCalendarNames';

import getWeekdayNames = JDNConvertibleCalendarNames.getWeekdayNames;
import getMonthNames = JDNConvertibleCalendarNames.getMonthNames;

export {getWeekdayNames, getMonthNames}
