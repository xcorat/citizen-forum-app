const googleFormAddrDeploy = import.meta.env.VITE_GOOGLE_FORM_ADDR_DEPLOY as string;
const googleFormAddrDebug = import.meta.env.VITE_GOOGLE_FORM_ADDR_DEBUG as string;
const googlekey = import.meta.env.VITE_GAPI_KEY as string

function submitGoogleForm(form_summary) {
    // TODO: TEST:
    console.log(form_summary);
    console.log(googlekey);
    
    let form_action = "https://docs.google.com/forms/d/" + googleFormAddrDebug;
    try {
        var xhr = new XMLHttpRequest();

        let full_post = format_post_text(form_summary);

        let data =    "entry.1857901265=" + encodeURIComponent(form_summary.name)
                    + "&entry.1590668805=" + encodeURIComponent(form_summary.digIDProvider)
                    + "&entry.117508226=" + encodeURIComponent(form_summary.digID)
                    + "&entry.474571559=" + encodeURIComponent(form_summary.topic)
                    + "&entry.239756388=" + encodeURIComponent(full_post);

       console.log(data)
        xhr.open('POST', form_action + '/formResponse', true);
        xhr.setRequestHeader('Accept',
            'application/xml, text/xml, */*; q=0.01');
        xhr.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(data);
    } catch(e) {}

    return false;
}

function format_post_text(form_summary) {
    let full_post = "# " + form_summary.title + " #\n" + form_summary.post;
    full_post += "\n\n" + "#lang:" + form_summary.lang;
    if(form_summary.admin_div) {
        full_post += ", " + "#admin_div:" + form_summary.admin_div;
    }
    if(form_summary.sector) {
        full_post += ", " + "#sector:" + form_summary.sector;
    }
    return full_post;
}

export default submitGoogleForm;
