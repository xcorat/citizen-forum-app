/**
 * A simple hash function from https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
 * @param str String to be hashed
 * @param seed 
 * @returns a simple 53bit hash
 */
export const cyrb53 = function(str: string, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}

/**
 * 
 * @param text text of the post to get uuid for
 * @param tstamp post timestamp
 * @returns a uuid with the text hash and timestamp in hex format 'ab34-6d'
 *      the first 3-4 chars represent the hash and the last two the timestamp.
 */
export const create_uuid = function(text: string, tstamp: Date){
    const hexhash = cyrb53(text);
    return hexhash.toString(16) + '-' + tstamp.getTime().toString(16);
}