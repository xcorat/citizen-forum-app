import { writable, derived, get as get } from "svelte/store";
import { locale } from "svelte-i18n";
import Post from "$lib/schemas/Post";
import { info, error } from "$lib/logging";
import { page } from '$app/stores'

// TODO: Do people, like store these in localStorage? ::cough:: ::cough:: gunDB support?
const MAX_POSTS = 500;

const _posts: Post[] = [];
const _filters = writable({
    topic: undefined,
});

/**
 * A store to keep track of the posts displayed. 
 * The store acts as a queue with a max length of MAX_POSTS
 */
function create_store(){
    const _all_posts = writable(_posts);
    let _base_url;
    let _fetch;

    const _displayable = derived( [locale, _all_posts, _filters],
         ([ $locale, $_all_posts, $_filters ]) => {
            
            // Filter according to the locale/lang
            let filtered_posts = $_all_posts.filter( post => 
                `${post.locale}` == $locale 
            );
            // Filter according to the topic
            if($_filters.topic && $_filters.topic != 'all'){
                filtered_posts = filtered_posts.filter(post => 
                `${post.categories.topic}` == $_filters.topic
                );
            }
            // info(['filtered1:', filtered_posts]);
            if(filtered_posts.length < 10) _load();
            return filtered_posts;
    });

    async function _load(){
        let params = new URLSearchParams(_base_url.search);
        const [{ posts }] = await Promise.all([
            _fetch(`posts.json?${params}`, { credentials: 'include' }).then(r => r.json()),
        ])
        _posts.push(...(posts.map(post => new Post(post))));
        // TODO: create a way to merge the posts while keeping time ordering
        info(['fetched:', posts, _posts])
        _all_posts.set(_posts);
    }

    async function load({ url, fetch }) {
        let params = new URLSearchParams(url.search);
        _fetch = fetch;
        _base_url = url;

        params.set('limit', '100');
        
        // Add the initial queries
        
        const [{ posts }] = await Promise.all([
            fetch(`posts.json?${params}`, { credentials: 'include' }).then(r => r.json()),
        ])
        _posts.push(...(posts.map(post => new Post(post))));
        // TODO: create a way to merge the posts while keeping time ordering
        info(['fetched:', posts, _posts])
        _all_posts.set(_posts);
    };

    /**
     * Insert a post to the store. The inserts should insert to the full store (_all_posts)
     * @param post 
     */
    function insert(post: Post) {
        // TODO: is this a good way? are we just updating the reference?
        // DEBUG: Have not tested
        error("posts store 'insert' have not been tested.")
        _all_posts.update(posts => {
            posts.unshift(post);
            if(posts.length > MAX_POSTS) posts.shift();
            return posts;
        });
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

    // _displayable.subscribe((posts) => { info(['posts updated:', posts]) })

    return { ..._displayable, insert, load, set_topic,  len, slice }
}

export const posts = create_store();
// export const posts = derived([ locale, posts_alllang ], )