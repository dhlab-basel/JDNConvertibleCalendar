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

import { JDNConvertibleCalendarError } from './JDNConvertibleCalendarError';
import { TypeDefinitionsModule } from './TypeDefinitions';
import { Utils } from './Utils';

/**
 * Represents a period as two JDNs.
 */
export class JDNPeriod {

    /**
     * Indicates if the date is exact (day precision).
     */
    public readonly exactDate: Boolean;

    /**
     *
     * @param periodStart start of the period.
     * @param periodEnd End of the period.
     */
    constructor(public readonly periodStart: TypeDefinitionsModule.JDN, public readonly periodEnd: TypeDefinitionsModule.JDN) {

        // check that periodStart equals or is before periodEnd
        if (periodStart > periodEnd) throw new JDNConvertibleCalendarError(`start of a JDNPeriod must not be greater than its end`);

        // check that given arguments are integers (JDNs have no fractions)
        if (!(Utils.isInteger(periodStart) && Utils.isInteger(periodEnd))) {
            throw new JDNConvertibleCalendarError('JDNs are expected to be integers');
        }

        this.exactDate = (periodStart === periodEnd);

    }
}
