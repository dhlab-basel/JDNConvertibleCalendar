/**
 * Represents an error that occurred when using `JDNConvertibleCalendarModule`.
 */
export class JDNConvertibleCalendarError extends Error {

    /**
     *
     * @param message description of the error.
     */
    constructor(message: string) {
        super(message);
    }
}
