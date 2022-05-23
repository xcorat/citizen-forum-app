import { dev, browser } from '$app/env'
import { info } from './logging';

function get_gcs_lang() {
    // This shouldn't be called from the browser, so return a dummy
    // TODO: https://github.com/xcorat/citizen-forum-app/issues/5
    if(browser) return null;
    
    const gcs_lang = {
        project_id: process.env.GCS_LANG_PROJECT_ID,
        client_email: process.env.GCS_LANG_CLIENT_EMAIL,
        private_key: process.env.GCS_LANG_PRIVATE_KEY,
    };
    return gcs_lang;
}

function get_mongo() {
    // This shouldn't be called from the browser, so return a dummy
    // TODO: https://github.com/xcorat/citizen-forum-app/issues/5
    if(browser) return null;
    
    const mongo = {
        uri: process.env.MONGO_ATLAS_ENDPOINT,
        api_key: process.env.MONGO_ATLAS_API_KEY,
        dataSource: 'citizen-forum',
        // Currently in tests...
        db: (true || dev)? 'cf-test': 'cf-dev',
        users: 'users',
        posts: 'posts',
    };
    return mongo;
}

export const gcs_lang = get_gcs_lang();
export const mongo = get_mongo();