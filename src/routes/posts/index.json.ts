import { getPosts } from '$lib/db'

export async function get({ url: { searchParams }, locals }) {
    const limit = +searchParams.get('limit') || undefined;
    const skip = +searchParams.get('skip') || undefined;
    const topic_id = searchParams.get('topic_id') || undefined;
    const locale = searchParams.get('locale') || undefined

    console.log("posts/get ...")
    let filter: any = (topic_id)? { "categories" :{"topic" : topic_id }}: undefined;
    if(locale){
        if(filter) filter["locale"] = locale;
        else filter = { locale };
    } 
    try {
        const posts = await getPosts(limit, skip, filter);
        if(!posts) throw Error("Could not fetch data...");
        return {
            status: 200,
            body: {
                posts,
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
