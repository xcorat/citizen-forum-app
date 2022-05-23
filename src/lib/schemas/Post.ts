import Author from './Author';
import { create_uid, tstamp_from_sl_tstring } from './functions';
import topics_settings from '../../data/topics_settings';
import { info } from '$lib/logging';

interface UIDBase {
    uid?: string,
    text: string,
    tstamp: Date,
}

export default class Post {
    uid: string; // timestamp is embedded in the UID, this is not Univeraslly unique
    author: Author;
    text: string;
    title: string;
    // The categories need a category type so different category types don't mix,
    //  the first level property of the category is the type
    categories: {}; // topic_ids and other hierarchical taxonomies { <cat_name>: <cat_id> }
    tags: string[]; // language and other non-hierarchical tags
    locale?: Intl.Locale;
    meta?: any; // Any metadata, like the gform_index

    get timestamp() {
        /**
         * get the timestamp from the UUID.
         */
        console.log("timestamp from uuid not implemented yet..");
        return new Date(this.uid);
    }

    get topic() {
        return ('topic' in this.categories)? 
            this.categories['topic'] as string:
            undefined;
    }

    constructor(post) {
        this.uid = Post.create_uid(post);
        this.author = new Author(post.author)
        if(!post.text) throw TypeError("Post text is required");
        this.text = post.text;
        this.title = post.title
        // TODO: sanity check on categories
        this.categories = post.categories;
        this.tags = post.tags;
        this.locale = post.locale;
        this.meta = post.meta;
    }

    static from_gform_post(gform_post, gform_index) {
        const tstamp = tstamp_from_sl_tstring(gform_post["Timestamp"]) ;
        // const tstamp = tstamp_from_sl_tstring(gform_post["කාල මුද්‍රාව"]) ;
        const text = gform_post["ඔබේ යෝජනා / Your suggestions / உங்கள் பரிந்துரைகள்"];
        const meta = { gform_index };
        const author = new Author({
            uuid: null,
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
                if(topic_alllang.indexOf(value.label.en) != -1){
                    topicID = key;
                    break;
                };
                // TODO: use `o23` as generic topic in caseclear of error
                topicID = 'o23';
            }
            return topicID;
        })(gform_post["විෂයපථය / Subject area / பொருள் பகுதி"]);
        
        const categories = {
            topic: topic_id,
        }
        return new this({
            author,
            text,
            tstamp,
            categories,
            meta,
        });
    }

    static dummy_post(){
        return new this({
            author: Author.anon(),
            tstamp: new Date(),
            text: 'dummy',
            title: '',
            // TODO: sanity check on categories
            categories: {},
            tags: [],
            locale: new Intl.Locale('en-GB')
        })
    }

    public get_displayable() {
        let excerpt = this.text;
        let truncated = false;
        if (this.text.length > 300) {
            excerpt = this.text.slice(0,300) + ' ...';
            truncated = true;
        }
        return { ...this, topic: this.topic, excerpt, truncated };
    }


    static create_uid(post: UIDBase): string {
        const newUID = create_uid(post.text, post.tstamp);
        if('uid' in post && post.uid != newUID){
            throw TypeError('UID of the post does not match the post content')
        }
        else return newUID;
    }
}