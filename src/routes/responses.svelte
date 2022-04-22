<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { dictionary, _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../components/paginatedMasonicGrid.svelte';
    import { responses } from '../stores/responsesStore';
    import TranslatableSelect from "../components/translatableSelect.svelte";
    import topics_settings from "../data/topics_settings.json"
import { updateLocalResponses } from '$lib/format_posts';

    // Update the translations dictionary for this page
    dictionary.update( (dict) => {
             return dict;
    })

    let topic;
    // Do a shallow copy of the topics list. We need to add a new
    //   selectable without changing the original.
    let selectable_topics_list = Object.assign({}, topics_settings);
    selectable_topics_list['all'] = {
        "label" :{
            "en_GB": "All Topics",
            "si_LK": "සියලු මාතෘකා",
            "ta_LK": "All Topics"
        },
        "orderingID": 0,
    };

    let posts = $responses;
    
    function updatePosts(){
        if(topic?.value && topic.value != "all") {
            posts = $responses.filter( (post) => post.topicID == topic.value);
        }
        else {
            posts = $responses; 
        }
    }


</script>

<div class="posts-page-content">
    <div class="mt-10 mx-10" >
        <TranslatableSelect item_settings={selectable_topics_list} bind:value={topic}
            on:select={updatePosts}/>
    </div>
    <PaginatedMasonicGrid numDisplayed={25} {posts}/>
   <!-- {#if (topic?.value)}

        <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
            posts={$responses.filter( (post) => post.topicID == topic.value)}/>       
    {:else}
        <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
    {/if} -->
   
</div>



