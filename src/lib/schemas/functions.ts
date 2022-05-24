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
export const create_uid_old = function(text: string, tstamp: Date){
    const hexhash = cyrb53(text);
    return hexhash.toString(16) + '-' + tstamp.getTime().toString(16);
}

/**
 * 
 * @param text text of the post to get uuid for
 * @param tstamp post timestamp
 * @returns a uuid with the text hash and timestamp in BSON ObjectId format.
 *      The BSON ObjectId is 4-byte tstamp, 5-byte random number, 3-byte random incrementor,
 *      
 *      For us, we store the timestamp as 5bytes, and the hash string with 7bytes.
 *      This would allow us to use it as an object Id and be able run comparisons to
 *      order them in time.
 * 
 *      stored as: [4byte-seconds since epoch, 1-byte millisec value, 7-byte hash ]
 * 
 *      This does not match exactly with mongo specification since the last 3bytes wont
 *      always be incremental, but given we don't have to care too much about lower than 
 *      1sec granularity, this seems ok.
 */
 export const create_uid = function(text: string, tstamp: Date){
    const hexhash = cyrb53(text);
    const tstamp_sec = Math.floor(tstamp.getTime()/1000);
    const tstamp_ms = (tstamp.getTime()%1000) >>> 2; // get closest millisec: *= 4
    const uid = tstamp_sec.toString(16).padStart(8, '0')
                + tstamp_ms.toString(16).padStart(2, '0')
                + hexhash.toString(16).padStart(14, '0') ;
    return uid;
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