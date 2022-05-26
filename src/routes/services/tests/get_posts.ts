import { getPosts } from '$lib/db'
import {page} from '$app/stores';
import Post from '$lib/schemas/Post'
import { info, error } from '$lib/logging';

// Disable when done adding data
const ENABLED = true; // || vars.tests.ENABLE;
     
export async function get( { url }) {
    const limit = parseInt(url.searchParams.get('limit')) || undefined;
    const skip = parseInt(url.searchParams.get('skip')) || undefined;
    const topic_id = url.searchParams.get('topic_id') || undefined;
    const locale = url.searchParams.get('locale') || undefined
    
    let filter: any = (topic_id)? { "categories" :{"topic" : topic_id }}: undefined;
    if(locale){
        if(filter) filter["locale"] = locale;
        else filter = { locale };
    } 
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
        const posts = await getPosts(limit, skip, filter);
        return {
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