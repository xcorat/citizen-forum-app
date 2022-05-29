<script context="module">
    import { locale } from "svelte-i18n";
    import { get } from 'svelte/store'
    import { posts } from "../../stores/postsStore";
    
    import { browser } from "$app/env";

    export const POSTS_PER_PAGE = 25;

    // TODO: for SSR, we should implement the data fetching on the
    //      shadow endpoint and export it here initially.
    //  So maybe inplement the initial get on that side?

</script>
<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../../components/paginatedMasonicGrid.svelte';
    import TranslatableSelect from "../../components/translatableSelect.svelte";
    import topics_settings from "../../data/topics_settings.json";
    import { pageFormatter } from '$lib/i18n';
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import { onMount } from "svelte";

    /**
     * TODO: need to debug and check this!
     * @param name
     * @param value
     */
    async function update_page(name: string, value: string){
        const url = $page.url;
        url.searchParams.set(name, value)
        posts.load({ url, fetch });
        if(browser) await goto(`${url}`);
        // else redirect?
    }

    // Update the translations dictionary for this page
    const page_id = "responses";
    const _p = pageFormatter('responses');

    // export let posts;

    let topic;

    // Do a shallow copy of the topics list. We need to add a new
    //   selectable without changing the original.
    let selectable_topics_list = Object.assign({}, topics_settings);
    selectable_topics_list['all'] = {
        "label" :{
            "en": "All Topics",
            "si": "සියලු මාතෘකා",
            "ta": "All Topics"
        },
        "orderingID": 0,
    };

    async function updatePosts(){
        console.log('updateposts', topic)
        update_page('topic_id', topic?.value);
    }

    onMount(() => {
        // we dont need too many calls initially, and this wont work on SSR anyway
        locale.subscribe( (locale) => {
            update_page('locale', locale);
        });
        
        // Update the topic parameter from the page URLSearchParams
        // const topic_id = $page.url.searchParams.get('topic_id');
        // if(topic_id && (topic_id != 'all' || selectable_topics_list[topic_id] ))
        // topic = {
        //     label: topic_id,
        //     value: selectable_topics_list[topic_id][get(locale)]
        // }
        // console.log(selectable_topics_list[topic_id], topic)
    })


</script>

<div class="posts-page-content">
    <h1 class="page-title m-10 text-3xl">{$_(page_id+'.citizen_sugg', { default: 'Citizen Suggestions' })}</h1>
    <div class="mt-10 mx-10 " >
        <label class="label" for="topic-select">
            <span class="label-text">
                <!-- {$_(page_id+'.filter_topic', { default: 'Filter Topic' })} -->
                {$_p('filter_topic', 'Filter Topic')}
            </span>
        </label>
        <div>
        <TranslatableSelect item_settings={selectable_topics_list} bind:value={topic}
            on:select={updatePosts}/>
        </div>
    </div>
    <div class="mt-1 mx-10">
        <PaginatedMasonicGrid numDisplayed={25}/>
    </div>
   <!-- {#if (topic?.value)}

        <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
            posts={$responses.filter( (post) => post.topicID == topic.value)}/>       
    {:else}
        <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
    {/if} -->
   
</div>



