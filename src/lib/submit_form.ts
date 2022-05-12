import { form } from "svelte-forms";

const googleFormAddrDeploy = import.meta.env.VITE_GOOGLE_FORM_ADDR_DEPLOY as string;
const googleFormAddrDebug = import.meta.env.VITE_GOOGLE_FORM_ADDR_DEBUG as string;
const googlekey = import.meta.env.VITE_GAPI_KEY as string  

async function submitGoogleForm(form_summary) {
    //submitGoogleFormold(form_summary)
    //return;

    const url = "/api/submit_form"
    console.log(form_summary)
    async function post_form (form_summary) {
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(form_summary)
		})
		
		const json = await res.json()
		console.log(JSON.stringify(json))
	}
    await post_form(form_summary);
}

export default submitGoogleForm;
