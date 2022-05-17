<script>
    import demandsJSON from '../data/demands.json'
    import DemandCollapse from '../components/demandCollapse.svelte';
    import { dictionary, _, locale } from "svelte-i18n";
    import { intros } from 'svelte/internal';

    const page_id = 'demands';

    const locales = [{name: 'en_GB', label: 'EN'},
                     {name: 'si_LK', label: 'SI'},
                     {name: 'ta_LK', label: 'TA'} ];

    let demands_dict = demandsJSON['en_GB']

    locale.subscribe((val) => {
        if( val ){
            demands_dict = demandsJSON[val];
        }
    })
</script>

<div class="flex">
    <div class="btn-group">
        {#each locales as loc}
            <button class="btn" class:btn-active="{loc.name == $locale}"
                on:click={() => $locale = loc.name}>{loc.label}</button>
        {/each}
    </div>
</div>
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