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

<div class="flex justify-center">

<article class="prose dark:prose-invert max-w-5xl prose-h1:text-xl prose-h2:text-xl">
    <div class="title text-center mx-14 my-4">
        <h1>{@html demands_dict.title}</h1>
    </div>
    <div class="intro text-justify">
        <h2>{@html demands_dict.intro.title}</h2>
        <p>{@html demands_dict.intro.text}</p>
    </div>
    <div class="demand-list my-4">
        <h2 class="m-2">{@html demands_dict.demands_list_title}</h2>
        {#each demands_dict.demands_list as demand}
            <DemandCollapse index={demand.enum_idx} subs={demand.subs}
                title={demand.title} text={demand.text} ></DemandCollapse>
        {/each}
    </div>
</article>

</div>

<style>
    /* .intro :global(p) { */
        /* text-indent: 2rem; */
        /* padding-top: 1em; */

    /* } */
    /*
    h1 {
        font-size: 1.3em;
        font-weight:600;
    }

    h2{
        font-size: 1.2em;
        font-weight: 500;
    } */
</style>