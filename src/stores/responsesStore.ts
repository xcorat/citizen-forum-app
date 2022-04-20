import {writable} from 'svelte/store'
import responsesJSON from '../data/citizen_forum_data_nocontact_1.json';

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

function formatResponse(res, index){
    let response = {
        index: index,
        timestamp: res["කාල මුද්‍රාව"],
        author: res["ඔබේ නම / your name / உங்கள் பெயர்"],
        digitalIDProvider: res["ඩිජිටල් අනන්‍යතාව / Digital identity / டிஜிட்டல் அடையாளம்"],
        id: res["ඩිජිටල් අනන්‍යතා සබැඳිය (ඊමේල් ලිපිනය, දුරකථන අංකය හෝ සමාජ මාධ්‍ය සබැඳිය) / Digital identity link (email address, phone number, or social media link) / டிஜிட்டல் அடையாளம் (email, தொலைபேசி எண் அல்லது சமூக ஊடகம் link)"],
        topic: res["විෂයපථය / Subject area / பொருள் பகுதி"],
        post: res["ඔබේ යෝජනා / Your suggestions / உங்கள் பரிந்துரைகள்"],
        exerpt: '',
        truncated: false,
    }

    if (response.post.length > 300) {
        response.exerpt = response.post.slice(0,300) + ' ...';
        response.truncated = true;
    }
    else {
        response.exerpt = response.post;
    }
    
    return response;
}

function createResponseArray(){
    const resArray = responsesJSON.map((res, index) => formatResponse(res, index) )

    return resArray;
}

function createResponsesStore() {
    const { subscribe, set, update } = writable([defaultResponse]);

    set(createResponseArray());

    function insert(res) {
        update((resArray) => {
            const formattedResponse = formatResponse(res, resArray.length);
            resArray.push(formattedResponse);

            return resArray;
        })

    };

    return { subscribe, insert };
};

export const responses = createResponsesStore();

