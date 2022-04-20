<script>
    import { form, field } from 'svelte-forms';
    import Select from 'svelte-select';
    import { required, email as email_validator } from 'svelte-forms/validators';
    import { responses } from '../stores/responsesStore'
    import { get } from 'svelte/store';
    import { dictionary, _ , locale} from 'svelte-i18n';
    import topics_settings from '../data/topics_settings.json';
    
    // TODO: read this from the path?
    const page_id = 'form'

    // Don't subscribe, this keeps track of the locale of the page, so we can update
    //      the topics list when the user changes the locale settings.
    let currentLocale = get(locale);

    // The dictionary with translations strings for this page.
    dictionary.update( (dict) => {
        // English is not populated fully, as the default values are set to english
        dict.si_LK[page_id] = {
            "name": "ඔබේ නම",
            "digIDProvider": "ඩිජිටල් අනන්‍යතාව",
            "digID": "ඩිජිටල් අනන්‍යතා සබැඳිය (ඊමේල් ලිපිනය, දුරකථන අංකය හෝ සමාජ මාධ්‍ය සබැඳිය)",
            "topic": "විෂයපථය",
            "title": "කෙටි මාතෘකාව",
            "post": "ඔබේ යෝජනා",
            // "submit": "",
        };
        dict.ta_LK[page_id] = {
            "name": "உங்கள் பெயர்",
            "digIDProvider": "டிஜிட்டல் அடையாளம்",
            "digID": "டிஜிட்டல் அடையாளம் (email, தொலைபேசி எண் அல்லது சமூக ஊடகம் link)",
            "topic": "பொருள் பகுதி",
           // "title": "කෙටි මාතෘකාව",
            "post": "உங்கள் பரிந்துரைகள்",
            // "submit": ""
        };

        dict.en_GB['topics'] = {};
        dict.si_LK['topics'] = {};
        dict.ta_LK['topics'] = {};
        for (const [key, value] of Object.entries(topics_settings)) {
            dict.en_GB['topics'][key] = value.label.en_GB;
            dict.si_LK['topics'][key] = value.label.si_LK;
            dict.ta_LK['topics'][key] = value.label.ta_LK;
        }   
        return dict;
    })
  
    // Form fields
    const name = field('name', '', [required()]);
    const digIDProvider = field('digIDProvider', '', [required()]);
    const digID = field('digID', '', [required()]);
    //const email = field('email', '', [required(), email_validator()]);
    const topic = field('topic', '', [required()]);
    const title = field('title', '', [required()]);
    const post = field('post', '', [required()]);
    
    // Create form
    const npForm = form(name, digIDProvider, digID, topic, title, post);
    
    const digIDPs = ["email", "phone", "facebook", "twitter"];
    const topics = []
    // Read the topics list from JSON
    for (const [key, value] of Object.entries(topics_settings)) {
        topics.push({
            value: key,
            label: value.label[currentLocale]
        })
    }

    // Change the topics list labels when the locale changes
    locale.subscribe((loc) => {
        // Update only if the locale has changed
        if(loc == currentLocale) return;
        topics.forEach((topicVal) => {
            topicVal.label = get(dictionary)[loc].topics[topicVal.value]
        });
        currentLocale = loc;
    });


    const submitHandler = () => {
        npForm.validate();
        if(!$npForm.valid) return;

        const vals = get(npForm).summary;

        responses.insert({
            name: vals.name, 
            digIDProvider: vals.digIDProvider.label,
            digID: vals.digID,
            topic: vals.topic.label,
            title: vals.title,
            post: vals.post,
        })
        npForm.reset();
    }
  </script>
  
<section class="m-5 max-w-2xl ">
<!-- svelte-ignore component-name-lowercase -->
<form on:submit|preventDefault={submitHandler}>
    <div class="form-control">
        <label class="label" for="npform-name">
            <span class="label-text">
                {$_(page_id+'.name', { default: 'Name' })}
            </span>
        </label>
        <input type="t  ext" placeholder="Your Name" class="input input-bordered"
            bind:value={$name.value} id="npform-name">
        {#if $npForm.hasError('name.required')}
            <div class="validate-error">Name is required</div>
        {/if}
    </div>

    <div class="form-control">
        <label class="label" for="npform-digIDProvider">
            <span class="label-text">
                {$_(page_id+'.digIDProvider', { default: 'Digital identity' })}
            </span>
        </label>
        <Select inputStyles="select select-bordered" items={digIDPs} 
            placeholder="Phone/Email/Facebook etc.."
            bind:value={$digIDProvider.value} id="npform-digIDProvider">
        </Select>
        {#if $npForm.hasError('digIDProvider.required')}
            <div class="validate-error">Digital ID is required</div>
        {/if}
    </div>

    <div class="form-control">
        <label class="label" for="npform-digID">
            <span class="label-text">
                {$_(page_id+'.digID', { default: 'Digital Identity link' })}
            </span>
        </label>
        <input type="text" placeholder="aragalakarie@gotagogama.lk" class="input input-bordered"
            bind:value={$digID.value} id="npform-digID">  
        {#if $npForm.hasError('digID.required')}
            <div class="validate-error">
                Digital Identity link is required
            </div>
        <!-- {:else if $npForm.hasError('email.not_an_email')}
            <div class="validate-error">Not an email</div> -->
        {/if}
    </div>

    <div class="form-control">
        <label class="label" for="npform-topic">
            <span class="label-text">
                {$_(page_id+'.topic', { default: 'Topic' })}</span>
        </label>
        <Select inputStyles="select select-bordered" items={topics}
            placeholder="Select topic"
            bind:value={$topic.value} id="npform-topic">  
        </Select>

        {#if $npForm.hasError('topic.required')}
            <div class="validate-error">Topic is required</div>
        {/if}
    </div>

    <div class="form-control">
        <label class="label" for="npform-title">
            <span class="label-text">
                {$_(page_id+'.title', { default: 'Post Title' })}</span>
        </label>
        <input type="text" placeholder="Short title for the suggestion" class="input input-bordered"
            bind:value={$title.value} id="npform-title">  
    </div>

    <div class="form-control">
        <label class="label" for="npform-post">
            <span class="label-text">
                {$_(page_id+'.post', { default: 'Suggestion' })}
            </span>
        </label>
        <textarea class="textarea textarea-bordered" placeholder="Type your suggestion" 
            bind:value={$post.value} id="npform-post"></textarea>
        {#if $npForm.hasError('post.required')}
            <div class="validate-error">Post is required</div>
        {/if}   
    </div>
    <div class="content-center">
        <button class="btn mt-10" disabled={!$npForm.valid}>
            {$_(page_id+'.submit', { default: 'Submit' })}
        </button>
    </div>
</form>
</section>

<style>
    .validate-error {
        color: maroon;
    }

    .form-control {
        margin-bottom: 1em;
    }
</style>