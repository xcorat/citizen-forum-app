import { detect_lang } from '$lib/lang_tools/detect_lang'
import { responses } from '../../../stores/responsesStore';
import { get as getval } from 'svelte/store'

/**
 * 
 * @param { params } the request params, and id contains the route at [id]
 * @returns detected language as { id: id, lang: <detected_lang || 'not detected' }
 */

async function post_lang(post_id) {
    const excerpt = getval(responses)[post_id]?.exerpt;
    const detections = await detect_lang(excerpt)//[0].language;
    const lang = (Array.isArray(detections))? 
                    detections[0]?.language: detections;
    if(lang) {
        return {
            body: {
                id: post_id,
                lang: lang
            }
        }
    }

    return {
        status: 404,
        body: {
            title: "Could not detect language"
        }
    };
}

async function allposts_lang(crazy=false) {
    const responses1 = (!crazy)? getval(responses).slice(0,10): [];
    const excerpt = responses1.map((post) => post.exerpt);
    const detections = await detect_lang(excerpt)//[0].language;
    const lang = detections.map(detection => detection.language);
    if(lang) {
        return {
            body: {
                lang: lang
            }
        }
    }

    return {
        status: 404,
        body: {
            title: "Could not detect language"
        }
    };
}

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
    if(params.id == 'all') {
        console.log("Are you crazy?");
        // return null;
        return allposts_lang();
    }
    return post_lang(params.id);
}