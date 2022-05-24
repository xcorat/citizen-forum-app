import { addPostsMany } from '$lib/db'
import responsesJSON from '../../../data/cf-forum-18-05.json';
import Post from '$lib/schemas/Post'
import { info, error } from '$lib/logging';

// Disable when done adding data
const ENABLED = false;


/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
    // console.log("Oops,  u know what u doin?")
    // return null;
    if(!ENABLED){
        return {
            status: 400,
            body: {
                error: "Oh ooh, this service is manually disabled. Check code ;)"
            }
        };
    }
    const posts: Post[] = responsesJSON.map((res, index) =>
        Post.from_gform_post(res, index)
    )
    // test with 10 objects
    // const posts_slice = posts.slice(0, 10)
    try {
        const postids = addPostsMany(posts);
        if(postids) {
            info(await postids);
            info("Posts submission done.")
            return {
                body: {
                    ids: postids,
                    posts,
                }
            }
        }
        
    }
    catch(e){
        console.log("Error")
        console.log(e);
    }
    return {
        status: 404,
        body: {
            title: "Could not add posts, it seems"
        }
    };
}