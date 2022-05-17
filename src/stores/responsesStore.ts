import {writable} from 'svelte/store'
import responsesJSON from '../data/citizen_forum_data_nocontact_1.json';
import { formatResponse, updateLocalResponses } from '../lib/format_posts'
import { Post, PostDisplay } from '../lib/post_schema'

const defaultResponse = {
    index: 0,
    timestamp: '', //new Date(),
    author: 'anonymous',
    digitalIDProvider: 'none',
    id: 'none',
    topic: '',
    topicID: '',
    post: '',
    exerpt: '',
    truncated: false,
}

async function getAllResponses(){
    const url = "/.netfly/functions/get_posts";
    const res = await fetch(url);
    const data = await res.json();

    return data as [];
}

async function createResponseArray(){
    //const resArray = responsesJSON.map((res, index) => formatResponse(res, index) )
    const postsJSON = await getAllResponses();
    const resArray = postsJSON.map((res, index) => {
        // index starts from 1
        const post = Post.from_gform_post(res, 0);
        return new PostDisplay(post);
    })

    return resArray;
}

function createResponsesStore() {
    const { subscribe, set, update } = writable([new PostDisplay(Post.dummy_post())]);

    set(createResponseArray());

    function insert(res) {
        const updatedResponse = updateLocalResponses(res);
        update((resArray) => {
            const formattedResponse = Post.from_gform_post(updatedResponse, resArray.length);
            resArray.push(formattedResponse);

            return resArray;
        })

    };

    function get_post()

    return { subscribe, insert };
};

export const responses = createResponsesStore();

