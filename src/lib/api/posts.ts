import { getPostswithUsers as getPostsDB} from '$lib/db';
import { info } from '$lib/logging';
import { tstamp_from_uid } from '$lib/schemas/functions';

// Hmm... should try out 'functional programming sometime.. 🤷

interface GetPostsQuery {
    skip?: number;
    sort?: any;
    locale?: string;
    topic_id?: string;
    newer_than?: string;
    older_than?: string;
    limit?: number;
    filter?: any;
}

function build_filter({ topic_id='', locale='', newer_than='', older_than='', filter=undefined }){
    // if undefined or some weird value
    const _filter = { ...filter };
    if(topic_id){
        if(_filter.categories) _filter.categories.topic = topic_id;
        else _filter.categories = { topic: topic_id };
    }
    if(locale) _filter.locale = locale;

    let filter_id = {};
    if(newer_than){
        const tstamp = tstamp_from_uid(newer_than)
        if(tstamp) filter_id["$gt"] = { "$oid": newer_than };
    }
    if(older_than){
        const tstamp = tstamp_from_uid(older_than);
        if(tstamp) filter_id["$lt"] = { "$oid" : older_than };
    }

    console.log(_filter)
    
    if(JSON.stringify(filter_id) != '{}') _filter['_id'] = filter_id;
            
    if(JSON.stringify(_filter) != '{}') return _filter;
    else return null;
}

/**
 * Sanitize the request parameters here. Do not edit any. Any editing done after
 * 
 * @param params search parameters, as a map (like received from a get request)
 * @returns a query object
 */
function create_query(params_any) {
    const params = (params_any instanceof URLSearchParams)? 
                    params_any:
                    new Map(Object.entries(params_any));

    const query: GetPostsQuery = {};

    const limit = +params.get('limit');
    if(limit > 0) query.limit = limit;

    const skip = +params.get('skip');
    if(skip > 0) query.skip = skip;

    const topic_id = params.get('topic_id');
    if(topic_id) query.topic_id = `${topic_id}`;

    const locale = params.get('locale');
    if(locale) query.locale = `${locale}`;

    // TODO: Check for valid string here! and may even convert to timestr?
    const newer_than = params.get('newer_than');
    if(newer_than) query.newer_than = `${newer_than}`;

    // TODO: Check for valid string here! and may even convert to timestr?
    const older_than = params.get('older_than');
    if(older_than) query.older_than = `${older_than}`;

    // TODO: what to check here? remove already existing? 🤷?
    const filter = params.get('filter')
    if(filter) query.filter = filter;

    return query
}

async function getPosts(params: any){
    const query = create_query(params);
    query.filter = build_filter(query);

    return await getPostsDB({ ...query });
}


export type { GetPostsQuery } 
export { getPosts }