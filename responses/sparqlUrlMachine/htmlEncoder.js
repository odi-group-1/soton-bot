/**
 * Created by stefan on 24/03/17.
 */

let encode = (unencoded) => {
    return encodeURIComponent(unencoded).replace(/'/g, "%27").replace(/"/g, "%22");
};

let decode = (encoded) => {
        obj.value = decodeURIComponent(encoded.replace(/\+/g,  " "));
};

module.exports = {
    encode: encode,
    decode: decode
};
