import { mongo } from '$lib/variables';
import type Post from '$lib/schemas/Post';
import type Author from '$lib/schemas/Author';
import { detect_lang } from '$lib/lang_tools/detect_lang'
import '$lib/logging'
import { info, error } from '$lib/logging';

const MAX_DOCS_LIMIT = 100;

interface Payload {
    dataSource: string,
    database: string,
    collection: string,

    document?: any, // For insertOne
    filter?: {}, // For find
    pipeline?: any[], // For aggregate
    sort?: {},
    limit?: number,
    skip?: number
}

interface PostSchema {
    _id?: string,
    authorId: string,
    test: string,
    title: string,
    categories: any, // Make { <cat_name>: <cat_id> }
    tags: string[],
    locale?: Intl.Locale,
    meta: any,
}

async function dbConnect(action: string, payload: Payload){
    if( !([ 'insertOne', 'findOne', 'find', 'insertMany', 'aggregate' ].includes(action)) ){
        // TODO: return error?
        error("Invalid database operation:" + action);
        return null; // throw Error()!
    }
    const url = mongo.uri + '/action/' + action;
    const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': mongo.api_key
        },
        body: JSON.stringify(payload)
    }
    try {
        async function connect () {
            const res = await fetch(url, config)
            const json = await res.json()
            
            // DEBUG: TODO: check for errors!!  
            if(res.status >= 400){
                error('in dbConnect');
                error(json);
                throw Error(json);
            }
            return json;
        }
        const data = await connect();
        return data;
    }
    catch(e) {
        // TODO: Do some error checking and sanitizing here
        error(e)
        return null;
    }
}

/**
 * 
 * @param author - if the uuid is truthy, no document is added, and the uuid is returned.
 * @returns the UUID of the author object inserted to the DB. return falsy on failure.
 */
async function addAuthor(author: Author){

    // TODO: do we need to do any checking here?
    const document = {
        name: author.name,
        dig_ids: author.dig_ids,
    }

    if(author.uuid){
        console.log("Trying to add an object with already existing uuid, error?")
        return author.uuid;
        // document._id = {"$oid": this.uuid};
    }

    const payload = {
        "dataSource": mongo.dataSource,
        database: mongo.db,
        collection: mongo.users,
        document,
    }
    
    const res = await dbConnect('insertOne', payload)
    return res?.insertedId;
    
}

/**
 * 
 * @param author - if the uuid is truthy, no document is added, and the uuid is returned.
 * @returns the UUID of the author object inserted to the DB. return falsy on failure.
 */
async function addPost(post: Post) {
    const authorId = post.author.uuid || await addAuthor(post.author);
    if(!authorId){
        console.log("error adding the author, the post will not have an author.");
    }

    if(post.uid){
        // TODO: better error handling
        console.log("Cannot insert post with a UID.");
        return null;
    }

    const document: any = {
        authorId,
        text: post.text,
    }
    if(post.title) document.title = post.title;
    if(post.categories) document.categories = post.categories;
    if(post.tags) document.tags = post.tags;
    if(post.locale) document.locale = post.locale.toString();

    // TODO: Add limit to the query
    const payload = {
        "dataSource": mongo.dataSource,
        "database": mongo.db,
        "collection": mongo.posts, //TODO
        document
    }

    const res = await dbConnect('insertOne', payload);
    return res?.insertedId;
}

/**
 * 
 * @param author - if the uuid is truthy, no document is added, and the uuid is returned.
 * @returns the UUIDs of the posts inserted. Throws errors.
 */
 async function addPostsMany(posts: Post[]) {
    // Insert the authors first and get the author ids list
    const authors = posts.map(post => {
        const author = post.author;
        if(author.uuid) {
            console.log('Are you sure you want to add a post with a user uuid?' +
                        ' Change the code and re-run this if this is not a mistake.');
            throw TypeError('Trying to add an author with existing UUID' + author);
        }
        return {
            name: author.name,
            dig_ids: author.dig_ids,
        };
    });
    // Add authors
    const payload_authors = {
        "dataSource": mongo.dataSource,
        "database": mongo.db,
        "collection": mongo.users,
        documents: authors,
    }
    info("Adding authors ...");
    const res_authors = await dbConnect('insertMany', payload_authors);
    
    const authorIds = res_authors?.insertedIds;
    // TODO: TODO: check is all the ids are valid
    if(!authorIds){
        throw Error("Adding authors failed");
    }   

    // Detect the language of each post

    info("Language detection ...");
    const lang_detections = await detect_lang( posts.map((post => post.text)) );
    if( !lang_detections ||
        !Array.isArray(lang_detections) ||
        lang_detections.length != posts.length) {

        throw Error("Detecting language failed");
    }
    info(lang_detections.map(det=>det.language))
    // Create posts
    const post_docs = posts.map((post, index) => {
        const document: any = {
            authorId: { "$oid": authorIds[index] },
            text: post.text,
            locale: lang_detections[index].language,
        }
        document._id = { "$oid": post.uid };
        if(post.title) document.title = post.title;
        if(post.categories) document.categories = post.categories;
        if(post.tags) document.tags = post.tags;
        if(post.meta) document.meta = post.meta;

        return document;
    })

    // TODO: Add limit to the query
    const payload = {
        "dataSource": mongo.dataSource,
        "database": mongo.db,
        "collection": mongo.posts, //TODO
        documents: post_docs,
    }

    info("Adding the posts ...")
    const res = await dbConnect('insertMany', payload);
    console.log(res)
    return res?.insertedIds;
}

// Most likely we want to keep the timestamp-hash => uid implementation
//  on db side, and not have the user worry about it.
//  if that is the case we can just use the timestamp as part of the db_api
async function getPosts({ limit=25, skip=0, filter={}, sort={ _id: -1 } }:
                        { limit?: number, skip?: number, filter?: any, sort?: any })
    : Promise<any> {
    // TODO: do we need to do any checking here?
    limit = (limit < 1)? 1: (limit > MAX_DOCS_LIMIT)? MAX_DOCS_LIMIT: limit; 
    const payload: Payload = {
        "dataSource": mongo.dataSource,
        database: mongo.db,
        collection: mongo.posts,
        sort,
        limit,
        skip,
    }
    let latest = true;
    // TODO: check if filter has empty keys too
    // WARING: filter can have keys that are empty..
    if(filter && JSON.stringify(filter) != '{}') {
        payload.filter = filter;
        latest = false; 
    }
    if(+skip > 0) { payload.skip = skip; latest = false; }

    const res = await dbConnect('find', payload);
    // The query returned all possible data when the limit is larger
    //      than the returned number of documents.
    //      Do check if this is better to be moved to the caller, 
    //      and just return the limit.
    //
    // This should mean that 'the same query will not return any data'
    //  So maybe keep track of that query if so..
    const query_exhausted = res?.documents?.length < limit;
    info([ "db/getPosts payload", filter, limit, res?.documents?.length, query_exhausted ])
    return {
        documents: res?.documents,
        latest,
        query_exhausted,
    }
}

// Most likely we want to keep the timestamp-hash => uid implementation
//  on db side, and not have the user worry about it.
//  if that is the case we can just use the timestamp as part of the db_api
async function getPostswithUsers({ limit=25, skip=0, filter={}, sort={ _id: -1 } }:
                        { limit?: number, skip?: number, filter?: any, sort?: any })
    : Promise<any> {
    // TODO: do we need to do any checking here?
    limit = (limit < 1)? 1: (limit > MAX_DOCS_LIMIT)? MAX_DOCS_LIMIT: limit; 

    // TODO: is match required for aggregation?
    // TODO: check if filter has empty keys too
    // WARING: filter can have keys that are empty..
    // if(filter && JSON.stringify(filter) != '{}') {
    //     const match = filter;
    // }
    let latest = true;
    // TODO: check if filter has empty keys too
    // WARING: filter can have keys that are empty..
    if(filter && JSON.stringify(filter) != '{}') {
        latest = false; 
    }
    if(+skip > 0) latest = false;
    else skip = 0;

    const addUserName = [{ 
        "$lookup": {
            "from": "users",
            "localField": "authorId",
            "foreignField": "_id",
            "as": "user"
        }
    },
    {
        "$unwind": "$user"
    },
    {
        "$addFields": {
            "authorName": "$user.name"
        }
    }];

    const project = {
        "authorId": 1,
        "authorName": 1,
        "text": 1,
        "title": 1,
        "locale": 1,
        "categories": 1,
        "tags": 1
    }

    const pipeline = [
        { "$match": filter },
        { "$sort": sort },
        { "$limit": limit },
        { "$skip": skip },
        ...addUserName,
        { "$project": project }
    ]
    
    const payload: Payload = {
        "dataSource": mongo.dataSource,
        database: mongo.db,
        collection: mongo.posts,
        pipeline,
    }
    const res = await dbConnect('aggregate', payload);
    // The query returned all possible data when the limit is larger
    //      than the returned number of documents.
    //      Do check if this is better to be moved to the caller, 
    //      and just return the limit.
    //
    // This should mean that 'the same query will not return any data'
    //  So maybe keep track of that query if so..
    const query_exhausted = res?.documents?.length < limit;
    info([ "db/getPosts payload", filter, limit, res?.documents?.length, query_exhausted ])
    return {
        documents: res?.documents,
        latest,
        query_exhausted,
    }
}

export { addAuthor, addPost, addPostsMany, getPostswithUsers as getPosts };