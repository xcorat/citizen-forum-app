<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { dictionary, _ } from 'svelte-i18n';
    import PaginatedMasonicGrid from '../components/paginatedMasonicGrid.svelte';
    import { responses } from '../stores/responsesStore';

    // Update the translations dictionary for this page
    dictionary.update( (dict) => {
             return dict;
    })

</script>

<div class="posts-page-content">
    <PaginatedMasonicGrid numDisplayed={25} posts={$responses}/>
</div>



