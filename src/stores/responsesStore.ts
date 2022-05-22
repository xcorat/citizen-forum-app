import {writable} from 'svelte/store'
import responsesJSON from '../data/citizen_forum_data_nocontact_1.json';
import { formatResponse, updateLocalResponses } from '../lib/format_posts';
import Post from '$lib/schemas/Post';

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
    const resArray = responsesJSON.map((res, index) =>
        Post.from_gform_post(res, index).get_displayable()
    )
    // console.log(resArray)
    return resArray;
}

function createResponsesStore() {
    const { subscribe, set, update } = writable([defaultResponse]);

    set(createResponseArray());

    function insert(res) {
        const updatedResponse = updateLocalResponses(res);
        update((resArray) => {
            // TODO: possible DEBUG
            const formattedResponse = Post.from_gform_post(updatedResponse, resArray.length).get_displayable();
            resArray.push(formattedResponse);

            return resArray;
        })

    };

    return { subscribe, insert };
};

export const responses = createResponsesStore();

