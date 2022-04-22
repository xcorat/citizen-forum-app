<script>
    /**
     * TODO: Proper documentation
     * TODO: if an element with `{orderingID: 0}` exists in the list, 
     *      that element will take the first position. Implement this more
     *      comprehensively.
     * 
    */
    import Select from 'svelte-select';
    import { dictionary, _ , locale} from 'svelte-i18n';
    import { get } from 'svelte/store';
    import { createEventDispatcher } from 'svelte';

    export let item_settings;
    export let value;

    // Don't subscribe, this keeps track of the locale of the page, so we can update
    //      the topics list when the user changes the locale settings.
    let currentLocale = get(locale);

    // To send the input selected message to the top controller. This is used by the 
    //  pagination component
    const dispatch = createEventDispatcher();

    const items = []
    // Read the topics list from JSON with schema:
    // { key: {label: {en_GB: "english", "ta_LK": "tamil", "si_LK": "sinhala"} }}
    for (const [key, value] of Object.entries(item_settings)) {
        if(value.orderingID === 0) {
            items.unshift({
                value: key,
                label: value.label[currentLocale]
            });
        }
        else {
            items.push({
                value: key,
                label: value.label[currentLocale]
            })
        }
    }

    // Change the topics list labels when the locale changes
    locale.subscribe((loc) => {
        // Update only if the locale has changed
        if(loc == currentLocale) return;
        items.forEach((item) => {
            item.label = get(dictionary)[loc].topics[item.value]
        });
        currentLocale = loc;
    });

</script>


<Select inputStyles="select select-bordered" items={items}
    placeholder="Select topic"
    bind:value={value} id="responses-topic"
    on:select={() => dispatch('select')}>  
</Select>