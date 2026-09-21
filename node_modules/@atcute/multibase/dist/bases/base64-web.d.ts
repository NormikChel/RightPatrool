import { fromBase64 as fromBase64Native, fromBase64Pad as fromBase64PadNative, fromBase64Url as fromBase64UrlNative, fromBase64UrlPad as fromBase64UrlPadNative, toBase64 as toBase64Native, toBase64Pad as toBase64PadNative, toBase64Url as toBase64UrlNative, toBase64UrlPad as toBase64UrlPadNative } from './base64-web-native.ts';
export declare const fromBase64: typeof fromBase64Native;
export declare const toBase64: typeof toBase64Native;
export declare const fromBase64Pad: typeof fromBase64PadNative;
export declare const toBase64Pad: typeof toBase64PadNative;
export declare const fromBase64Url: typeof fromBase64UrlNative;
export declare const toBase64Url: typeof toBase64UrlNative;
export declare const fromBase64UrlPad: typeof fromBase64UrlPadNative;
export declare const toBase64UrlPad: typeof toBase64UrlPadNative;
