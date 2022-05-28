<script context="module">
    import { locale } from "svelte-i18n";
    import { get as getval } from 'svelte/store'
    import { posts } from "../../stores/postsStore";
    
    import { browser } from "$app/env";

    export const POSTS_PER_PAGE = 25;

	export async function load({ url, fetch }) {
        // const params = url.searchParams;
        // // TODO: how to check if we need to get the latest?
        // if( !params.has('latest') && !(params.has('skip') || params.has('locale') || params.has('topic_id')) ){
        //     params.set('latest', true);
        //     info(url);
        //     // goto(url, { replaceState: true });
        // }
        posts.load({ url, fetch });
        info(['postModule/load', browser ])
		return {
			props: {
				// posts
			}
		};
	}
</script>
<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../../components/paginatedMasonicGrid.svelte';
    import TranslatableSelect from "../../components/translatableSelect.svelte";
    import topics_settings from "../../data/topics_settings.json";
    import { pageFormatter } from '$lib/i18n';
    import { info } from "$lib/logging";
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';


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

    function updatePosts(){
        $page.url.searchParams.set('topic_id', topic?.value);
        const url = `${$page.url}`
        info(url)
        goto(url)
        // posts.set_topic(topic?.value);
    }


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



