import { error } from '$lib/logging'
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
 * @returns a uuid with the text hash and timestamp in hex format '1234567890abcd-1234567890a'
 *      the first 13-14 chars represent the hash and the last 11 the timestamp.
 */
export const create_uid = function(text: string, tstamp: Date){
    const hexhash = cyrb53(text);
    return hexhash.toString(16) + '-' + tstamp.getTime().toString(16);
}

/**
 * 
 * @param tstamp The time stamp from google form, in srilankan time ("4/15/2022 16:22:15")
 */
export const tstamp_from_sl_tstring = (tstamp: string) =>{
    const utc = new Date(tstamp+ ' GMT+0530')
    if(!tstamp || !utc?.getTime()) {
        error('tstamp cannot be converted to UTC date: ' + tstamp + ' => ' + utc);
        return null;
    }
    return utc;
}