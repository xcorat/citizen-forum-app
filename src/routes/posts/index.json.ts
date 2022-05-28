import { getPosts } from '$lib/api/posts';
import { info } from '$lib/logging';

// Time to wait between latest requests in milliseconds
const COOLDOWN_TIME = 500;

export async function get({ url: { searchParams }, locals }) {
    try {
        const res = await getPosts(searchParams);
        const posts = res?.documents;
        // const posts = await get_posts(searchParams);
        if(!posts) throw Error("Could not fetch data...", posts);

        // TODO: should we just return the response here? why more shit?
        return {
            status: 200,
            body: {
                posts,
                searchParams,
                latest: res?.latest || false,
                query_exhausted: res.query_exhausted || false,
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
            title: "Could not get posts, it seems"
        }
    };

}
