import { detect_lang } from '$lib/lang_tools/detect_lang'

export function get() {
    detect_lang('sdfsdff').then((res) => console.log(res))
    // dummy
    return {
        body: {
            title: 'None'
        }
    }
}