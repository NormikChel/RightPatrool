// native `fromHex` accepts uppercase hex, but multibase base16 (`f`) is lowercase-only.
const UPPER_RE = /[A-F]/;
export const fromBase16 = (str) => {
    if (UPPER_RE.test(str)) {
        throw new SyntaxError(`unexpected uppercase characters in base16 string`);
    }
    return Uint8Array.fromHex(str);
};
export const toBase16 = (bytes) => {
    return bytes.toHex();
};
