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

function createResponseArray(){
    //const resArray = responsesJSON.map((res, index) => formatResponse(res, index) )
    const resArray = responsesJSON.map((res, index) => {
        const post = Post.from_gform_post(res, index);
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

    return { subscribe, insert };
};

export const responses = createResponsesStore();

