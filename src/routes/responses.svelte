<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import {  _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../components/paginatedMasonicGrid.svelte';
    import { responses } from '../stores/responsesStore';
    import TranslatableSelect from "../components/translatableSelect.svelte";
    import topics_settings from "../data/topics_settings.json"
    import { pageFormatter } from '$lib/i18n'

    // Update the translations dictionary for this page
    const page_id = "responses";
    const _p = pageFormatter('responses');

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

    let posts = $responses;
    
    function updatePosts(){
        if(topic?.value && topic.value != "all") {
            posts = $responses.filter( (post) => post.topic == topic.value);
        }
        else {
            posts = $responses; 
        }
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
        <PaginatedMasonicGrid numDisplayed={25} {posts}/>
    </div>
   <!-- {#if (topic?.value)}

        <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
            posts={$responses.filter( (post) => post.topicID == topic.value)}/>       
    {:else}
        <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
    {/if} -->
   
</div>



