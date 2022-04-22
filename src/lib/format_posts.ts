// functions needed to sanitize the proposals between local form and db/JSON

import topics_settings from "../data/topics_settings.json"

/**
 * 
 * @param res 
 * @returns 
 */
export function updateLocalResponses(res){
    let post: string = '#' + res.title + '#' + '\n' + res.post;
    // TODO: This localization doesn't give results in sinhala
    let tstamp: string = (new Date()).toLocaleString('si-LK');

    let response = {
        "කාල මුද්‍රාව": tstamp,
        "ඔබේ නම / your name / உங்கள் பெயர்": res.name,
        "ඩිජිටල් අනන්‍යතාව / Digital identity / டிஜிட்டல் அடையாளம்": res.digIDProvider,
        "ඩිජිටල් අනන්‍යතා සබැඳිය (ඊමේල් ලිපිනය, දුරකථන අංකය හෝ සමාජ මාධ්‍ය සබැඳිය) / Digital identity link (email address, phone number, or social media link) / டிஜிட்டல் அடையாளம் (email, தொலைபேசி எண் அல்லது சமூக ஊடகம் link)": res.digID,
        "විෂයපථය / Subject area / பொருள் பகுதி": res.topic,
        "ඔබේ යෝජනා / Your suggestions / உங்கள் பரிந்துரைகள்": post,
    }

    return response;
}

export function formatResponse(res, index){
    const topic_alllang = res["විෂයපථය / Subject area / பொருள் பகுதி"];
    let topicID;
    for(const [key, value] of Object.entries(topics_settings)){
        // Just check the ennglish version. 
        if(topic_alllang.indexOf(value.label.en_GB) != -1){
            topicID = key;
            break;
        };
        // TODO: use `o23` as generic topic in case of error
        topicID = 'o23';
    }
    const topic = (topics_settings) => { }

    let response = {
        index: index,
        timestamp: res["කාල මුද්‍රාව"],
        author: res["ඔබේ නම / your name / உங்கள் பெயர்"],
        digitalIDProvider: res["ඩිජිටල් අනන්‍යතාව / Digital identity / டிஜிட்டல் அடையாளம்"],
        id: res["ඩිජිටල් අනන්‍යතා සබැඳිය (ඊමේල් ලිපිනය, දුරකථන අංකය හෝ සමාජ මාධ්‍ය සබැඳිය) / Digital identity link (email address, phone number, or social media link) / டிஜிட்டல் அடையாளம் (email, தொலைபேசி எண் அல்லது சமூக ஊடகம் link)"],
        topic: res["විෂයපථය / Subject area / பொருள் பகுதி"],
        topicID: topicID,
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