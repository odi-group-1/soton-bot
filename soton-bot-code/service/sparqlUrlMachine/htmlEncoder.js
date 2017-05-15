/**
 * HTML encoder/decoder - used to encode SPARQL query strings into acceptable URI form and vice versa
 */

/**
 * Encode query string to HTML. Also takes care of replacing single and double quotes
 * @param unencoded string to encode
 * @returns {string} encoded string
 */
let encode = (unencoded) => {
    return encodeURIComponent(unencoded).replace(/'/g, "%27").replace(/"/g, "%22");
};

/**
 * Decode HTML to normal string. Also takes care of replacing spaces
 * @param encoded HTML to be decoded
 * @returns {string} decoded string
 */
let decode = (encoded) => {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
};

module.exports = {
    encode: encode,
    decode: decode
};
