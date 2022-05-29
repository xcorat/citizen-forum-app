import { writable, derived } from "svelte/store";
import { locale } from "svelte-i18n";
import Post from "$lib/schemas/Post";
import { info, error } from "$lib/logging";

// TODO: Do people, like store these in localStorage? ::cough:: ::cough:: gunDB support?
const MAX_POSTS = 500;
const POSTS_PER_PAGE = 25;

class PostsList {
    // The real array of posts. Do not change from outside
    // We should keep both a map and an array since map doesn't support sort, and 
    //      just keeping the array will make checkin existing posts slower
    //      since these are just references, it shouldn't add much 
    private _posts: Post[] = [];
    private _posts_map: Map<string, Post>;
    
    constructor(posts: Post[]){
        // remove duplicates
        const unsorted = new Map<string, Post>(posts.map(post => [post.uid, post]));
        this._posts_map = new Map([...unsorted].sort( (uid_a, uid_b) => +uid_a - +uid_b ));

        this._posts = [...this._posts_map.values()]
    }

    get length() { return this._posts_map.size; }

    /**
     * Insert the post/s to the list and return number inserted
     * @param posts 
     * @returns the number inserted
     */
    public insert(posts: Post[] | Post) {
        const old_length = this._posts.length;
        posts = Array.isArray(posts)? posts: [ posts ];
        posts.forEach( post => this._posts_map.set(post.uid, post) );
        this._posts_map = new Map([...this._posts_map].sort( (uid_a, uid_b) => +uid_a - +uid_b ));

        this._posts = [...this._posts_map.values()]
        // this._posts = new Array<Post>(...this._posts_map.values().sort());
        console.log('update -> ', this._posts.length);
        return this._posts.length - old_length;
    }

    public insertLast(post: Post){
        // Not implemented
        error('PostsList.insertLast: not implemented -- unshift?');
        this._posts_map.set(post.uid, post);
        this._posts.unshift(post);
    }

    public filter(fn) { return this._posts.filter(fn); }
}



/**
 * A store to keep track of the posts displayed. 
 * The store acts as a queue with a max length of MAX_POSTS
 */
function create_store(){
    // TODO: FIX!
    let _base_url;
    let _fetch;

    const _filled_range = { newest: '', oldest: '' };
    let exhausted_queries = []; // What type?

    const _posts: PostsList = new PostsList([]);

    const _filters = (() => {
        const filters = {
            topic: undefined,
        }
        const {subscribe, update, set} = writable(filters);

        const _set = (params: URLSearchParams ) => {
            // Does the parameter automatically convert?
            // if(!(params instanceof URLSearchParams)) params = new URLSearchParams(params);
            console.log('filters/set', params.toString())
            const topic_id = params.get('topic_id');
            if(topic_id) filters.topic = topic_id;
            else filters.topic = undefined;

            set(filters);
        }

        return { subscribe,
                update,
                set: _set
                }
    })();

    const _all_posts = writable(_posts);

    // TODO: Probably a very bad way to do this, but works for now :/
    async function _load(params?: URLSearchParams){
        // TODO: FIX!!! -- we need to keep only the permanent info on params,
        //                  and those ideally should be in the session store anyway
        if(!params) params = new URLSearchParams('');
        // Take searchParams from the returned query, so we know nothing was changed
        //      when we keep track of exhausted queries.
        if(!params.has('limit')) params.set('limit', '100');
        
        // Trigger a redraw while the info is beaing fetched.
        _filters.set(params);

        // TODO: decide here if we really need to fetch more data
        const [{ posts, searchParams, latest, query_exhausted }] = await Promise.all([
            _fetch(`posts.json?${params}`, { credentials: 'include' }).then(r => r.json()),
        ])
        info({searchParams, latest, query_exhausted });
        if(query_exhausted) exhausted_queries.push(searchParams);
        if(Array.isArray(posts)){
            if(latest){
                _filled_range.newest = `${posts[0]._id}`;
                _filled_range.oldest = `${posts[posts.length-1]._id}`;
            }
            // call the set function only if the insertion of at least one element was 
            //      successful
            if(_posts.insert( posts.map(post => new Post(post)) )){
                _all_posts.set(_posts);
            }

        }
    }
    
    async function load({ url, fetch }) {
        info(['postsStore/load', url])
        let params = new URLSearchParams(url.search);
        _fetch = fetch;
        _base_url = url;
         _load(params)
    };

    /**
     * Insert a post to the store. The inserts should insert to the full store (_all_posts)
     * @param post 
     * @returns the post uid as a confirmation of db insertion
     */
    async function insert(post: Post) {
        // TODO: is this a good way? are we just updating the reference?
        // DEBUG: Have not tested
        error("posts store 'insert' have not been tested.")
        // _all_posts.update(posts => {
        //     posts.unshift(post);
        //     if(posts.length > MAX_POSTS) posts.shift();
        //     return posts;
        // });
        return Promise.resolve("postId-24charstring");
    }
    
    function set_topic(topic_id: string){
        if(topic_id == 'all') topic_id = undefined;
        _filters.update( filters => {
            filters.topic = topic_id;
            return filters;
        });
    }
        
    function len(){
        let len = 0;
        const unsubscribe = _displayable.subscribe(p => { len = p.length; });
        unsubscribe();
        return len;
    }

    function slice(start: number, end: number){
        let $posts = [];
        const unsubscribe = _displayable.subscribe(p => { $posts = p; });
        unsubscribe();
        return $posts.slice(start, end)
    }

    const _displayable = derived( [locale, _all_posts, _filters],
                                 ([ $locale, $_all_posts, $_filters ]) => {
        // Filter according to the locale/lang
        let filtered_posts = $_all_posts.filter(
            post => `${post.locale}` == $locale
        );
        // Filter according to the topic
        if($_filters.topic && $_filters.topic != 'all'){
            filtered_posts = filtered_posts.filter(
                post => `${post.categories.topic}` == $_filters.topic
            );
        }
        // info(['filtered1:', filtered_posts]);
        // if(filtered_posts.length < POSTS_PER_PAGE) _load();
        console.log('changed stores', $_filters, filtered_posts.length, $_all_posts.length);
        return filtered_posts.map(post => post.get_displayable());
    });
    // _displayable.subscribe((posts) => { info(['posts updated:', posts]) })

    // so the subscription really is to the _displayable store. The main store can 
    // change without the display be notified as long as the _displayable does not change
    // TODO: for above to work, we need to track when _all_posts can change
    //      without effecting the displayed (ex: prefetch?)
    return { ..._displayable, insert, load, len, slice }
}




export const posts = create_store();
// export const displayed_posts = _displayable;
// export const filters = _filters ;
// export const posts = derived([ locale, posts_alllang ], )