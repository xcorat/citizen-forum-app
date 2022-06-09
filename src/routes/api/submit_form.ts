import { submit_form } from '$lib/api/submit_form'

export async function post({ request }) {
    try {
        const form_summary = await request.json();
        const { status, statusText, headers, body } = await submit_form(form_summary);

        return {
            statusCode: status,
            body: JSON.stringify({ status, statusText, headers, body })
        }
    }
    catch(error) {
        return {
            statusCode: 500,
            body: error.toString()
        }
    }

}
