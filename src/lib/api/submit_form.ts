import { google_form } from '$lib/variables';
import { addPost } from '$lib/api/posts'
import Post from '$lib/schemas/Post'

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

async function submitGoogleForm(form_summary) {
    // TODO: TEST:
    const url = "https://docs.google.com/forms/d/" + google_form.debug + '/formResponse';
    let full_post = format_post_text(form_summary);
    const entry_ids = google_form.entry_ids;
    let formdata =  `entry.${entry_ids.name}=` + encodeURIComponent(form_summary.name)
                + `&entry.${entry_ids.digIDProvider}=` + encodeURIComponent(form_summary.digIDProvider)
                + `&entry.${entry_ids.digID}=` + encodeURIComponent(form_summary.digID)
                + `&entry.${entry_ids.topic}=` + encodeURIComponent(form_summary.topic)
                + `&entry.${entry_ids.full_post}=` + encodeURIComponent(full_post);


    try {
        const res = await fetch( url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept' : 'application/xml, text/xml, */*; q=0.01'
            },
            body: formdata
        });
        console.log('google form resolved');
        return res;
        
    }
    catch(error) {
        return error;
    }

}

async function submitMongoPost(form_summary){
    try {
        const post = Post.from_web_form(form_summary);
        return await addPost(post);
    }
    catch(error){
        console.log(error)
        return Promise.resolve({
            status: 500,
            body: error,
        })
    }
}

export const submit_form = async (form_summary) => {
    const [gform_res, mongo_res] = await Promise.all([
        submitGoogleForm(form_summary).then( r => r.json() ),
        submitMongoPost(form_summary).then( r => r.json() ),
    ]);
    // TODO: check both responses and return a combined one.
    //  for now just return the mongo one?
    console.log(gform_res, mongo_res);
    return mongo_res;
}
