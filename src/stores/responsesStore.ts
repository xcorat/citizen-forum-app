import {writable} from 'svelte/store'
import responsesJSON from '../data/citizen_forum_data_nocontact_1.json';
import { formatResponse, updateLocalResponses } from '../lib/format_proposals';

const defaultResponse = {
    index: 0,
    timestamp: '', //new Date(),
    author: 'anonymous',
    digitalIDProvider: 'none',
    id: 'none',
    topic: '',
    post: '',
    exerpt: '',
    truncated: false,
}

function createResponseArray(){
    const resArray = responsesJSON.map((res, index) => formatResponse(res, index) )

    return resArray;
}

function createResponsesStore() {
    const { subscribe, set, update } = writable([defaultResponse]);

    set(createResponseArray());

    function insert(res) {
        const updatedResponse = updateLocalResponses(res);
        update((resArray) => {
            const formattedResponse = formatResponse(updatedResponse, resArray.length);
            resArray.push(formattedResponse);

            return resArray;
        })

    };

    return { subscribe, insert };
};

export const responses = createResponsesStore();

