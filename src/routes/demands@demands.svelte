<script lang="ts">
    import demandsEN from '../data/demands/en.json'
    import DemandCollapse from '../components/demandCollapse.svelte';
    import {  _, locale } from "svelte-i18n";

    const page_id = 'demands';

    let demands_dict = demandsEN;

    // TODO: checking if the locale is undef might not be necessary if the 
    //      default is set properly
    locale.subscribe((val) => {
        if( val ){
            import('../data/demands/' + val + '.json').then(res => {
                demands_dict = res;
            });
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