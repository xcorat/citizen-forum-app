<script>
    import Select from 'svelte-select';
    import { dictionary, _ , locale} from 'svelte-i18n';
    import { get } from 'svelte/store';

    export let item_settings;
    export let value;

    // Don't subscribe, this keeps track of the locale of the page, so we can update
    //      the topics list when the user changes the locale settings.
    let currentLocale = get(locale);

    const items = []
    // Read the topics list from JSON with schema:
    // { key: {label: {en_GB: "english", "ta_LK": "tamil", "si_LK": "sinhala"} }}
    for (const [key, value] of Object.entries(item_settings)) {
        items.push({
            value: key,
            label: value.label[currentLocale]
        })
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
    bind:value={value} id="npform-topic">  
</Select>