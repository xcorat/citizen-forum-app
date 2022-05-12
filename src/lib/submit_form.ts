const googleFormAddrDeploy = import.meta.env.VITE_GOOGLE_FORM_ADDR_DEPLOY as string;
const googleFormAddrDebug = import.meta.env.VITE_GOOGLE_FORM_ADDR_DEBUG as string;
const googlekey = import.meta.env.VITE_GAPI_KEY as string

function submitGoogleForm(form_summary) {
    const url = "/api/submit_form"
    async function post_form () {
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(form_summary)
		})
		
		const json = await res.json()
		console.log(JSON.stringify(json))
	}
}

export default submitGoogleForm;
