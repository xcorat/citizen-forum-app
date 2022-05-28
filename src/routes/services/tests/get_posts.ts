import { type GetPostsQuery,  getPosts } from '$lib/api/posts'
import {page} from '$app/stores';
import Post from '$lib/schemas/Post'
import { info, error } from '$lib/logging';

// Disable when done adding data
const ENABLED = true; // || vars.tests.ENABLE;

async function test_older_newer(params: any){
    try {
        const posts = await getPosts(params);
        return {
            status: 200,
            body: {
                documents: posts?.documents,
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

async function test_oldtest(params: any){
    const limit = parseInt(params.get('limit')) || undefined;
    const skip = parseInt(params.get('skip')) || undefined;
    const topic_id = params.get('topic_id') || undefined;
    const locale = params.get('locale') || undefined
    
    // let filter: any = (topic_id)? { "categories" :{"topic" : topic_id }}: undefined;
    // if(locale){
    //     if(filter) filter["locale"] = locale;
    //     else filter = { locale };
    // } 
    info(['services/tests/get_posts/get', params])
    console.log(limit)
    if(!ENABLED){
        return {
            status: 400,
            body: {
                error: "Oh ooh, this service is manually disabled. Check code ;)"
            }
        };
    }

    try {
        const posts = await getPosts({limit, skip, topic_id, locale});
        return {
            status: 200,
            body: {
                documents: posts?.documents,
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
            error: "Could not get posts, it seems"
        }
    };
}
     
export async function get({ url: { searchParams } }) {
    if(searchParams.has('oldtest')) return await test_oldtest(searchParams);
    if(searchParams.has('older_newer')) return await test_older_newer(searchParams);

    return {
        status: 404,
        body: {
            error: "Set the test name as a parameter to run tests."
        }
    };
}