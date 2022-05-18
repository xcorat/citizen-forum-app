import { Handler } from '@netlify/functions'

/* eslint-disable */
import fetch from 'node-fetch'

const mongo_api_key = process.env.MONGO_ATLAS_API_KEY

export const handler: Handler = async (event, context) => {
  //const { name = 'stranger' } = event.queryStringParameters
  const comment_obj = {
      "dataSource": "citizen-forum-demands",
      "database": "cf-dev",
      "collection": "demands_comments",
      "filter": { "type": "Suggestion" }
  }
    //JSON.parse(event.body);
  
  const url = 'https://data.mongodb-api.com/app/data-woxjf/endpoint/data/beta/action/find';
  const post_config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': mongo_api_key
    },
    body: JSON.stringify(comment_obj)
  }
  try {
    async function post_comment (post_config) {
      const res = await fetch(url, post_config)
      
      const json = await res.json()
      console.log(JSON.stringify(json))
    }
    // console.log(post_config)
    await post_comment(post_config);

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