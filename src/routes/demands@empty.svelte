<script lang="ts">
    import demandsJSON from '../data/demands.json'
    import DemandCollapse from '../components/demandCollapse.svelte';
    import SubmitCommentForm from '../components/submitCommentForm.svelte';
    import { dictionary, _, locale } from "svelte-i18n";

    const page_id = 'demands';

    let demands_dict = demandsJSON['en_GB']

    locale.subscribe((val) => {
        if( val ){
            demands_dict = demandsJSON[val];
        }
    });




</script>


<div>
    <h1>{@html demands_dict.title}</h1>
    <h2>{@html demands_dict.intro.title}</h2>
    <p>{@html demands_dict.intro.text}</p>
    <h3>{@html demands_dict.demands_list_title}</h3>
    {#each demands_dict.demands_list as demand}
        <DemandCollapse index={demand.enum_idx} subs={demand.subs}
            title={demand.title} text={demand.text} ></DemandCollapse>
    {/each}
</div>
<SubmitCommentForm/>