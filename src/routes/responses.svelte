<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { dictionary, _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../components/paginatedMasonicGrid.svelte';
    import { responses } from '../stores/responsesStore';
    import TranslatableSelect from "../components/translatableSelect.svelte";
    import topics_settings from "../data/topics_settings.json"

    // Update the translations dictionary for this page
    const page_id = "responses";
    dictionary.update( (dict) => {
                // English is not populated fully, as the default values are set to english
        dict.en_GB[page_id] = { "citizen_sugg": "Citizen Suggestions"  };
        dict.ta_LK[page_id] = {        };
        dict.si_LK[page_id] = {
            "citizen_sugg": "පුරවැසි අදහස්",
            "filter_topic": "මාතෘකාව තෝරන්න"
        }
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
    <h1 class="page-title m-10 text-3xl">{$_(page_id+'.citizen_sugg', { default: 'Citizen Suggestions' })}</h1>
    <div class="mt-10 mx-10 " >
        <label class="label" for="topic-select">
            <span class="label-text">
                {$_(page_id+'.filter_topic', { default: 'Filter Topic' })}
            </span>
        </label>
        <div>
        <TranslatableSelect
            id="topic-select"
            item_settings={selectable_topics_list} bind:value={topic}
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



