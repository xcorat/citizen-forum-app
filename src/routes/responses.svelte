<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { dictionary, _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../components/paginatedMasonicGrid.svelte';
    import { responses } from '../stores/responsesStore';
    import TranslatableSelect from "../components/translatableSelect.svelte"
    import topics_settings from "../data/topics_settings.json"

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


</script>

<div class="posts-page-content">
    <TranslatableSelect item_settings={selectable_topics_list} bind:value={topic}/>
    {topic?.value}
    <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
</div>



