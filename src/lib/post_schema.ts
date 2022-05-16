import topics_settings from '../data/topics_settings.json'

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

export const topic_label = function(topic_id: string, locale: Intl.Locale){
    return "not implemented";
}

export class Author {
    uuid: string;
    name: string;
    // DigIds: the first ID is the default, but keep the ability to add more
    dig_ids: {
        type: string;
        id: string;
    }[];

    get main_id() { return this.dig_ids[0]; }

    constructor(author) {
        this.uuid = author.uuid;
        this.name = author.name;
        if(!this.name) throw TypeError("Cannot find property name.")
        if(Array.isArray(author.dig_ids)){
            this.dig_ids = author.dig_ids.map(dig_id => ({type: dig_id.type, id: dig_id.id}) )
        }
        else if('dig_id' in author){
            this.dig_ids = [ {type: author.dig_id.type, id: author.dig_id.id} ];
        }
        //TODO: Maybe check for a dictionary of digita Ids too, if needed
        else {
            // Digital id is required
            throw TypeError("Digital Id of the author is required.")
        }
    }

    static anon(){
        return new this({
            uuid: 0,
            name: 'Anonymous',
            dig_ids: [{
                type: null,
                id: ''
            }]
        })
    }
}

export class Post {
    uuid: string; // timestamp is embedded in the UUID
    author: Author;
    text: string;
    title: string;
    // The categories need a category type so different category types don't mix,
    //  the first level property of the category is the type
    categories: {}; // topic_ids and other hierarchical taxonomies
    tags: string[]; // language and other non-hierarchical tags
    locale: Intl.Locale;

    get timestamp() {
        /**
         * get the timestamp from the UUID.
         */
        return new Date(this.uuid);
    }

    get topic() {
        return ('topic' in this.categories)? 
            this.categories['topic'] as string: undefined;
    }

    constructor(post) {
        this.uuid = post.uuid;
        this.author = new Author(post.author)
        if(!post.text) throw TypeError("Post text is required");
        this.text = post.text;
        this.title = post.title
        // TODO: sanity check on categories
        this.categories = post.categories;
        this.tags = post.tags;
        this.locale = post.locale;
    }

    static from_gform_post(gform_post, uuid=null) {
        const tstamp = new Date(gform_post["කාල මුද්‍රාව"]);
        const text = gform_post["ඔබේ යෝජනා / Your suggestions / உங்கள் பரிந்துரைகள்"];
        if(!uuid){
            uuid = create_uuid(text, tstamp)
        }
        const author = new Author({
            uuid: 'none',
            name: gform_post["ඔබේ නම / your name / உங்கள் பெயர்"],
            dig_id: {
                type: gform_post["ඩිජිටල් අනන්‍යතාව / Digital identity / டிஜிட்டல் அடையாளம்"],
                id: gform_post["ඩිජිටල් අනන්‍යතා සබැඳිය (ඊමේල් ලිපිනය, දුරකථන අංකය හෝ සමාජ මාධ්‍ය සබැඳිය) / Digital identity link (email address, phone number, or social media link) / டிஜிட்டல் அடையாளம் (email, தொலைபேசி எண் அல்லது சமூக ஊடகம் link)"]
            }
        });
        // TODO: implement
        const topic_id = ( (topic_alllang) => {
            let topicID;
            for(const [key, value] of Object.entries(topics_settings)){
                // Just check the ennglish version. 
                if(topic_alllang.indexOf(value.label.en_GB) != -1){
                    topicID = key;
                    break;
                };
                // TODO: use `o23` as generic topic in case of error
                topicID = 'o23';
            }
            return topicID;
        })(gform_post["විෂයපථය / Subject area / பொருள் பகுதி"]);
        
        const categories = {
            topic: topic_id,
        }
        return new this({
            uuid,
            author,
            text: gform_post["ඔබේ යෝජනා / Your suggestions / உங்கள் பரிந்துரைகள்"],
            categories,
        });
    }

    static dummy_post(){
        return new this({
            uuid: 0,
            author: Author.anon(),
            text: 'dummy',
            title: '',
            // TODO: sanity check on categories
            categories: {},
            tags: [],
            locale: new Intl.Locale('en-GB')
        })
    }
}

export class PostDisplay {
    post: Post;
    exerpt: string;
    truncated: boolean;

    constructor(post: Post) {
        this.post = post;
        if (post.text.length > 300) {
            this.exerpt = post.text.slice(0,300) + ' ...';
            this.truncated = true;
        }
        else {
            this.exerpt = post.text;
            this.truncated = false;
        }
    }

}