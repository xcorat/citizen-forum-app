import { dev, browser } from '$app/env'

function get_gcs_lang() {
    // This shouldn't be called from the browser, so return a dummy
    // TODO: https://github.com/xcorat/citizen-forum-app/issues/5
    
    if(browser) return {
        project_id:     import.meta.env.VITE_GCS_LANG_PROJECT_ID,
        client_email:   import.meta.env.VITE_GCS_LANG_CLIENT_EMAIL,
        private_key:    import.meta.env.VITE_GCS_LANG_PRIVATE_KEY,
    }
    
    console.log(dev)
    const gcs_lang = {
        project_id: process.env.GCS_LANG_PROJECT_ID,
        client_email: process.env.GCS_LANG_CLIENT_EMAIL,
        private_key: process.env.GCS_LANG_PRIVATE_KEY,
    };
    return gcs_lang;
}

export const gcs_lang = get_gcs_lang();