<script>
    import { form, field } from 'svelte-forms';
    import Select from 'svelte-select';
    import { required, email as email_validator } from 'svelte-forms/validators';
    import { responses } from '../stores/responsesStore'
    import { get } from 'svelte/store';
    import { dictionary, _ , locale} from 'svelte-i18n';

    import topics_settings from '../data/topics_settings.json';
    import admin_div_settings from '../data/admin_div_settings.json';
    import sector_settings from '../data/sector_settings.json';

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
            "sector": "sector-si",
            "admin-division": "admin-division-si",
            "title": "කෙටි මාතෘකාව",
            "post": "ඔබේ යෝජනා",
            // "submit": "",
            "topic_placeholder": "select-topic-si", 
            "sector_placeholder": "selecte-sector-si",
            "admin-div-placeholder": "select-admin-div-si"
        };
        dict.ta_LK[page_id] = {
            "name": "உங்கள் பெயர்",
            "digIDProvider": "டிஜிட்டல் அடையாளம்",
            "digID": "டிஜிட்டல் அடையாளம் (email, தொலைபேசி எண் அல்லது சமூக ஊடகம் link)",
            "topic": "பொருள் பகுதி",
            "sector": "sector-tm",
            "admin-division": "admin-division-tm",
           // "title": "කෙටි මාතෘකාව",
            "post": "உங்கள் பரிந்துரைகள்",
            // "submit": ""
            "topic_placeholder": "select-topic-tm", 
            "sector_placeholder": "selecte-sector-tm",
            "admin_div_placeholder": "select-admin-div-tm"
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

        dict.en_GB['admin_divs'] = {};
        dict.si_LK['admin_divs'] = {};
        dict.ta_LK['admin_divs'] = {};
        for (const [key, value] of Object.entries(admin_div_settings)) {
            dict.en_GB['admin_divs'][key] = value.label.en_GB;
            dict.si_LK['admin_divs'][key] = value.label.si_LK;
            dict.ta_LK['admin_divs'][key] = value.label.ta_LK;
        }   

        dict.en_GB['sectors'] = {};
        dict.si_LK['sectors'] = {};
        dict.ta_LK['sectors'] = {};
        for (const [key, value] of Object.entries(sector_settings)) {
            dict.en_GB['sectors'][key] = value.label.en_GB;
            dict.si_LK['sectors'][key] = value.label.si_LK;
            dict.ta_LK['sectors'][key] = value.label.ta_LK;
        }

        return dict;
    })
  
    // Form fields
    const name = field('name', '', [required()]);
    const digIDProvider = field('digIDProvider', '', [required()]);
    const digID = field('digID', '', [required()]);
    //const email = field('email', '', [required(), email_validator()]);
    const topic = field('topic', '', [required()]);

    let admin_div_selected = false;
    const admin_div = field('admin_div', '', []);
    let sector_selected = false;
    const sector = field('sector', '', []);
    const title = field('title', '', []);
    const post = field('post', '', [required()]);
    
    // Create form
    const npForm = form(name, digIDProvider, digID, topic, admin_div, sector, title, post);
    
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
        let admin_div = (admin_div_selected)? vals.admin_div.value: null;
        let sector = (sector_selected)? vals.sector.value: null;

        let data = {
            name: vals.name, 
            digIDProvider: vals.digIDProvider.label,
            digID: vals.digID,
            topic,
            admin_div,
            sector,
            title: vals.title,
            post: vals.post,
            lang: get(locale),
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
<div class="alert shadow-lg alert-small">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span >Data from this form will automatically be uploaded to the google form.</span>
    </div>
</div>
<!-- svelte-ignore component-name-lowercase -->
<form class="mt-5" on:submit|preventDefault={submitHandler}>
    <div class="form-control">
        <label class="label" for="npform-name">
            <span class="label-text">
                {$_(page_id+'.name', { default: 'Name' })}
            </span>
            <span class="alert-small" class:text-error={$npForm.hasError('name.required')}>
                required</span>
        </label>
        <input type="t  ext" placeholder="Your Name" class="input input-bordered"
            bind:value={$name.value} id="npform-name">
        <!-- {#if $npForm.hasError('name.required')}
            <div class="validate-error">Name is required</div>
        {/if} -->
    </div>

    <div class="form-control">
        <label class="label" for="npform-digIDProvider">
            <span class="label-text">
                {$_(page_id+'.digIDProvider', { default: 'Digital identity' })}
            </span>
            <span class="alert-small" class:text-error={$npForm.hasError('digIDProvider.required')}>
                required</span>
        </label>
        <Select inputStyles="select select-bordered" items={digIDPs} 
            placeholder="Phone/Email/Facebook etc.."
            bind:value={$digIDProvider.value} id="npform-digIDProvider">
        </Select>
        <!-- {#if $npForm.hasError('digIDProvider.required')}
            <div class="validate-error">Digital ID is required</div>
        {/if} -->
    </div>

    <div class="form-control">
        <label class="label" for="npform-digID">
            <span class="label-text">
                {$_(page_id+'.digID', { default: 'Digital Identity link' })}
            </span>
            <span class="alert-small" class:text-error={$npForm.hasError('digID.required')}>
                required</span>
        </label>
        <input type="text" placeholder="aragalakarie@gotagogama.lk" class="input input-bordered"
            bind:value={$digID.value} id="npform-digID">  
        <!-- {#if $npForm.hasError('digID.required')}
            <div class="validate-error">
                Digital Identity link is required
            </div>
            {/if} -->
        <!-- {:else if $npForm.hasError('email.not_an_email')}
            <div class="validate-error">Not an email</div> -->
    </div>

    <div class="form-control">
        <label class="label" for="npform-topic">
            <span class="label-text">
                {$_(page_id+'.topic', { default: 'Topic' })}
            </span>
            <span class="alert-small" class:text-error={$npForm.hasError('topic.required')}>required</span>
        </label>
        <TranslatableSelect id="npform-topic"
            placeholder={$_(page_id+'.topic_placeholder', { default: 'Select Topic' })}
            item_settings={topics_settings} bind:value={$topic.value}/>
        <!-- {#if $npForm.hasError('topic.required')}
            <div class="validate-error">Topic is required</div>
        {/if} -->
    </div>

    <div class="flex w-full">
        <div class="grid flex-grow">
            <div tabindex="0" class="collapse collapse-plus	">
                <input type="checkbox" bind:checked={admin_div_selected} /> 
                <label class="collapse-title" for="npform-admin_div">
                    <span class="label-text">
                        Select Province
                    </span>
                </label>
                <div class="collapse-content"> 
                    <TranslatableSelect id="npform-admin-div"
                    placeholder={$_(page_id+'.admin_div_placeholder', { default: 'Select Provice' })}
                    item_settings={admin_div_settings} bind:value={$admin_div.value}/>
                </div>
            </div>    
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="grid flex-grow">       
            <div tabindex="0" class="collapse collapse-plus	">
            <input type="checkbox"  bind:checked={sector_selected}/> 
            <label class="collapse-title" for="npform-sector">
                <span class="label-text">
                    Select Sector
                </span>
            </label>
            <div class="collapse-content"> 
                <TranslatableSelect id="npform-sector"
                 placeholder={$_(page_id+'.sector_placeholder', { default: 'Select Sector' })}
                item_settings={sector_settings} bind:value={$sector.value}/>
            </div>
        </div>
    </div>
    </div>



    <div class="form-control">
        <label class="label" for="npform-title">
            <span class="label-text">
                {$_(page_id+'.title', { default: 'Post Title' })}
            </span>
        </label>
        <input type="text" placeholder="Short title for the suggestion" class="input input-bordered"
            bind:value={$title.value} id="npform-title">  
    </div>

    <div class="form-control">
        <label class="label" for="npform-post">
            <span class="label-text">
                {$_(page_id+'.post', { default: 'Suggestion' })}
            </span>
            <span class="alert-small" class:text-error={$npForm.hasError('post.required')}>
                required</span>
        </label>
        <textarea class="textarea textarea-bordered" placeholder="Type your suggestion" 
            bind:value={$post.value} id="npform-post"></textarea>
        <!-- {#if $npForm.hasError('post.required')}
            <div class="validate-error">Post is required</div>
        {/if}    -->
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

    .alert-small {
        font-size: small;
    }
</style>