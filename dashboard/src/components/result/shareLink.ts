import pako from 'pako';

/**
 * Deflates a JSON string using the pako library and encodes it in base64.
 * @param jsonString - The JSON string to deflate and encode.
 * @returns The deflated and base64-encoded string.
 */
export function deflate(jsonString: string): string {
  const utf8Bytes = new TextEncoder().encode(jsonString);
  const compressedBytes = pako.deflate(utf8Bytes, {
    level: 9,
    raw: true,
  });
  return window.btoa(String.fromCharCode(...compressedBytes));
}

/**
 * Inflates a compressed string using the pako library.
 * @param compressedString The compressed string to be inflated.
 * @returns The inflated string.
 */
export function inflate(compressedString: string): string {
  const compressedBytes = Uint8Array.from(window.atob(compressedString), (c) =>
    c.charCodeAt(0)
  );
  const inflatedBytes = pako.inflate(compressedBytes, { raw: true });
  return new TextDecoder().decode(inflatedBytes);
}

/**
 * Generates a short link for sharing calculation results.
 *
 * @param obj - object.
 * @param isSimpleCalculation - Indicates whether it is a simple calculation.
 * @param isDisasterCalculation - Indicates whether it is a disaster calculation.
 * @returns The generated short link.
 */
export default function shortLink(
  obj: object,
  isSimpleCalculation: boolean,
  isDisasterCalculation: boolean
) {
  return `${window.location.protocol}//${
    window.location.host
  }/result?share=${deflate(JSON.stringify(obj))}&1=${
    isSimpleCalculation ? 1 : 0
  }&2=${isDisasterCalculation ? 1 : 0}`;
}

/**
 * Retrieves the calculation type based on the URL parameters.
 * @returns An object containing the calculation type information.
 */
export function calculationType() {
  const urlParams = new URLSearchParams(window.location.search);
  const isSimpleCalculation = urlParams.get('1') === '1';
  const isDisasterCalculation = urlParams.get('2') === '1';
  return { isSimpleCalculation, isDisasterCalculation };
}
