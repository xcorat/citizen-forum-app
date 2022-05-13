import { Handler } from '@netlify/functions'
/* eslint-disable */
import fetch from 'node-fetch'
import { form } from 'svelte-forms';

const googleFormAddrDebug = "1wdiZObfkHM33v4a7cA2DWZRtKhWNfrh3rwPOWXYDlTU"//import.meta.env.VITE_GOOGLE_FORM_ADDR_DEBUG as string;

async function submitGoogleForm(form_summary) {
  // TODO: TEST:
  console.log(form_summary);
  const url = "https://docs.google.com/forms/d/" + googleFormAddrDebug + '/formResponse';
  let full_post = format_post_text(form_summary);
  let formdata = "entry.1857901265=" + encodeURIComponent(form_summary.name)
              + "&entry.1590668805=" + encodeURIComponent(form_summary.digIDProvider)
              + "&entry.117508226=" + encodeURIComponent(form_summary.digID)
              + "&entry.474571559=" + encodeURIComponent(form_summary.topic)
              + "&entry.239756388=" + encodeURIComponent(full_post);

  console.log(formdata);
  try {
    const res = await fetch( url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept' : 'application/xml, text/xml, */*; q=0.01'
      },
      body: formdata
    })
    console.log(res)
    const { status, statusText, headers, body } = res;
    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, body })
    }
  } catch(error) {
    console.log(error);
    const { status, statusText, headers, data } = error;
    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data })
    }
  }

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

export const handler: Handler = async (event, context) => {
  //const { name = 'stranger' } = event.queryStringParameters
  try {
    const form_summary = JSON.parse(event.body);
    
    await submitGoogleForm(form_summary)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'submitted',
      }),
    }
  }
  catch(e) {
    return {
      statusCode: 500,
      body: e.toString()
    }
  }
}
