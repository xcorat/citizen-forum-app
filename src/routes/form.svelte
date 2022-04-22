<script>
    import { form, field } from 'svelte-forms';
    import Select from 'svelte-select';
    import { required, email as email_validator } from 'svelte-forms/validators';
    import { responses } from '../stores/responsesStore'
    import { get } from 'svelte/store';
    import { dictionary, _ , locale} from 'svelte-i18n';

    import topics_settings from '../data/topics_settings.json';
    import TranslatableSelect from '../components/translatableSelect.svelte';

    import  submitGoogleForm from '../lib/submit_google_form';
    
    // TODO: read this from the path?
    const page_id = 'form'

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

        // TODO: move this to a library or something? 
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
    
    const digIDPs = ["Email Address", "Phone Number", "Facebook Link", "Twitter Link"];
    //submitGoogleForm({});
    const submitHandler = () => {
        // https://docs.google.com/forms/d/e/1FAIpQLSe3IcJXD8T5ey5fMdv9Krceve9C3Ti1oNiQOIjvrRE5bl6aGw/viewform?usp=pp_url&entry.1857901265=name&entry.1590668805=Phone+Number&entry.117508226=email&entry.474571559=National+Security+and+Intelligence+%E0%B6%A2%E0%B7%8F%E0%B6%AD%E0%B7%92%E0%B6%9A+%E0%B6%86%E0%B6%BB%E0%B6%9A%E0%B7%8A%E0%B7%82%E0%B7%8F%E0%B7%80+%E0%B7%84%E0%B7%8F+%E0%B6%B6%E0%B7%94%E0%B6%AF%E0%B7%8A%E0%B6%B0%E0%B7%92%E0%B6%B8%E0%B6%BA+%E0%B6%9A%E0%B6%A7%E0%B6%BA%E0%B7%94%E0%B6%AD%E0%B7%94+%E0%AE%A4%E0%AF%87%E0%AE%9A%E0%AE%BF%E0%AE%AF+%E0%AE%AA%E0%AE%BE%E0%AE%A4%E0%AF%81%E0%AE%95%E0%AE%BE%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AF%81+%E0%AE%AE%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%AE%E0%AF%8D+%E0%AE%89%E0%AE%B3%E0%AE%B5%E0%AF%81%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AF%81%E0%AE%B1%E0%AF%88&entry.239756388=sugg
        npForm.validate();

        if(!$npForm.valid) return;

        const vals = get(npForm).summary;

        let topic_val = vals.topic.value;
        let topic = topics_settings[topic_val].label.en_GB + " "
                    + topics_settings[topic_val].label.si_LK + " "
                    + topics_settings[topic_val].label.ta_LK;

        let data = {
            name: vals.name, 
            digIDProvider: vals.digIDProvider.label,
            digID: vals.digID,
            topic: topic,
            title: vals.title,
            post: vals.post,
        }

        // Add data to the google form
        submitGoogleForm(data);

        responses.insert(data)
        npForm.reset();
        $npForm.dirty = false;
        console.log(get(npForm).summary);
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
        <TranslatableSelect item_settings={topics_settings} bind:value={$topic.value}/>
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