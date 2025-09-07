function base62_encode(num) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    do {
        result = chars[num % 62] + result;
        num = Math.floor(num / 62);
    } while (num > 0);
    return result;
}

module.exports = {
    encode: base62_encode
};