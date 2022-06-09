import { detect_lang } from '$lib/lang_tools/detect_lang'
import { responses } from '../../../stores/responsesStore';
import { get as getval } from 'svelte/store'

/**
 * 
 * @param { params } the request params, and id contains the route at [id]
 * @returns detected language as { id: id, lang: <detected_lang || 'not detected' }
 */
/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
    const excerpt = getval(responses)[params.id]?.exerpt;
    const detections = await detect_lang(excerpt)//[0].language;
    const lang = (Array.isArray(detections))? 
                    detections[0]?.language: detections;
    if(lang) {
        return {
            body: {
                id: params.id,
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