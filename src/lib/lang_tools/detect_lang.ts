// Imports the Google Cloud client library
import { v2 } from '@google-cloud/translate'
import { browser } from '$app/env';
import { gcs_lang } from '$lib/variables'
import { info, error } from '$lib/logging';
import { element } from 'svelte/internal';

const DETECTION_ARRAY_MAX_LENGTH = 128;

const translate = new v2.Translate({
    projectId: gcs_lang.project_id,
    credentials: {
        client_email: gcs_lang.client_email,
        private_key: gcs_lang.private_key.split("\\n").join("\n")
    }
});

interface LangDetection {
  confidence: number,
  language: string,
  input: string,
}

function* get_partials(arr, n){
  for(let i = 0; i < arr.length; i += n) yield arr.slice(i, i + n);
}

async function detect_partial(excerpts: string | string[]): Promise<LangDetection[]> {
    let [detections] = await translate.detect(excerpts);
    detections = Array.isArray(detections) ? detections : [detections];
    // console.log('Detections:');
    // detections.forEach(detection => {
    //   console.log(`${detection.input} => ${detection.language}`);
    // });
    return detections;
}

async function detect_lang(text: string | string[]): Promise<LangDetection[]> {
    // cannot be run on browser
    if( browser ) return null;
    if( !text ) return null;
    let excerpts: string | string[];
    if(Array.isArray(text)) {
      excerpts = text.map(element => element.substring(0, 250))
    }
    else {
      excerpts = text.substring(0, 250);
      return await detect_partial(excerpts);
    }

    const arr_partials = [...get_partials(excerpts, DETECTION_ARRAY_MAX_LENGTH)];
    const detections = await Promise.all(arr_partials.map(async (excerpts) => {
      try {
        const detection_partial = await detect_partial(excerpts);
        return detection_partial;
      }
      catch(e){
        error(e);
        return null;
      }
    })
    ); 

    const detect_all = detections.flat();
      
    // return type from google:
    // { confidence: 1, language: 'si', input: <input> }
    return detect_all || [];
}

export { detect_lang };