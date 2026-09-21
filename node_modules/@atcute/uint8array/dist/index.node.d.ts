export declare const alloc: (size: number) => Uint8Array<ArrayBuffer>;
export declare const allocUnsafe: (size: number) => Uint8Array<ArrayBuffer>;
/**
 * compares two Uint8Array buffers bytewise
 *
 * @param a first buffer
 * @param b second buffer
 * @returns -1 if `a` sorts before `b`, 1 if it sorts after, 0 if they hold the same bytes
 */
export declare const compare: (a: Uint8Array, b: Uint8Array) => number;
export declare const equals: (a: Uint8Array, b: Uint8Array) => boolean;
/**
 * checks if the two Uint8Array buffers are equal, timing-safe version
 *
 * @param a first buffer
 * @param b second buffer
 * @returns whether the buffers hold the same bytes; false if their lengths differ
 */
export declare const timingSafeEquals: (a: Uint8Array, b: Uint8Array) => boolean;
/**
 * concatenates multiple Uint8Array buffers into one
 *
 * @param arrays buffers to concatenate
 * @param size exact byte length of the result, defaulting to the combined length of `arrays`. contents
 *   overflowing it are truncated, and any remainder past them is left zeroed
 * @returns buffer holding the concatenated contents
 */
export declare const concat: (arrays: Uint8Array[], size?: number) => Uint8Array<ArrayBuffer>;
export declare const encodeUtf8: (str: string) => Uint8Array<ArrayBuffer>;
export declare const encodeUtf8Into: (to: Uint8Array, str: string, offset?: number, length?: number) => number;
/**
 * decodes a UTF-8 string from a given buffer
 *
 * @param from source buffer
 * @param offset byte offset to start reading from
 * @param length number of bytes to read
 * @returns decoded string
 * @throws {TypeError} if the byte range is not well-formed UTF-8
 */
export declare const decodeUtf8From: (from: Uint8Array, offset?: number, length?: number) => string;
/**
 * calculates the UTF-8 byte length of a string
 *
 * @param str string to measure
 * @returns byte length when encoded as UTF-8
 */
export declare const getUtf8Length: (str: string) => number;
/**
 * checks if a string's UTF-8 byte length is within a given range
 *
 * @param str string to measure
 * @param min minimum byte length (inclusive)
 * @param max maximum byte length (inclusive)
 * @returns true if byte length is within [min, max]
 */
export declare const isUtf8LengthInRange: (str: string, min: number, max: number) => boolean;
export declare const toSha256: (buffer: Uint8Array) => Promise<Uint8Array<ArrayBuffer>>;
/**
 * generates cryptographically secure random bytes
 *
 * @param size number of bytes to generate
 * @returns buffer filled with random bytes
 */
export declare const randomBytes: (size: number) => Uint8Array<ArrayBuffer>;
