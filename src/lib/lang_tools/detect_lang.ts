// Imports the Google Cloud client library
import { v2 } from '@google-cloud/translate'
import { browser } from '$app/env';
import { gcs_lang } from '$lib/variables'

const translate = new v2.Translate({
    projectId: gcs_lang.project_id,
    credentials: {
        client_email: gcs_lang.client_email,
        private_key: gcs_lang.private_key.split("\\n").join("\n")
    }
});

async function detect_lang(text: string | string[]) {
    
    // cannot be run on browser
    if( browser ) return null;
    if( !text ) return null;
    
    async function detectLanguage() {
        let [detections] = await translate.detect(text);
        detections = Array.isArray(detections) ? detections : [detections];
        console.log('Detections:');
        detections.forEach(detection => {
          console.log(`${detection.input} => ${detection.language}`);
        });
        return detections;
    }
      
    // return type from google:
    // { confidence: 1, language: 'si', input: <input> }
    const langs = await detectLanguage();
    return langs || [];
}

export { detect_lang };