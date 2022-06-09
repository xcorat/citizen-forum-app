<script>
    import { form, field } from 'svelte-forms';
    import Select from 'svelte-select';
    import { required, email as email_validator } from 'svelte-forms/validators';
    import { posts } from '../stores/postsStore';
    import { get } from 'svelte/store';
    import {  _ , locale} from 'svelte-i18n';
    import { add_topics } from '$lib/i18n';

    import topics_settings from '../data/topics_settings.json';
    import TranslatableSelect from '../components/translatableSelect.svelte';
import Post from '$lib/schemas/Post';

    
    // TODO: read this from the path?
    const page_id = 'form'
    $: add_topics($locale);
  
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
    let submitting = false;
    
    const digIDPs = ["Email Address", "Phone Number", "Facebook Link", "Twitter Link"];


    async function submitGoogleForm(form_summary) {
        // TODO: check how to get the redirects working.
        //      The errpr asks to use a file called `_redirects`, but not sure
        //      where to put it.
        // const url = "/api/submit_form"
        const url = "api/submit_form"
        async function post_form (form_summary) {
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(form_summary)
            })
            console.log(res);
            const json = await res.json()
            return json;
        }
        const res = await post_form(form_summary);
        // TODO: response handling..
        return res;
    }

    async function submitHandler() {
        // https://docs.google.com/forms/d/e/1FAIpQLSe3IcJXD8T5ey5fMdv9Krceve9C3Ti1oNiQOIjvrRE5bl6aGw/viewform?usp=pp_url&entry.1857901265=name&entry.1590668805=Phone+Number&entry.117508226=email&entry.474571559=National+Security+and+Intelligence+%E0%B6%A2%E0%B7%8F%E0%B6%AD%E0%B7%92%E0%B6%9A+%E0%B6%86%E0%B6%BB%E0%B6%9A%E0%B7%8A%E0%B7%82%E0%B7%8F%E0%B7%80+%E0%B7%84%E0%B7%8F+%E0%B6%B6%E0%B7%94%E0%B6%AF%E0%B7%8A%E0%B6%B0%E0%B7%92%E0%B6%B8%E0%B6%BA+%E0%B6%9A%E0%B6%A7%E0%B6%BA%E0%B7%94%E0%B6%AD%E0%B7%94+%E0%AE%A4%E0%AF%87%E0%AE%9A%E0%AE%BF%E0%AE%AF+%E0%AE%AA%E0%AE%BE%E0%AE%A4%E0%AF%81%E0%AE%95%E0%AE%BE%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AF%81+%E0%AE%AE%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AF%81%E0%AE%AE%E0%AF%8D+%E0%AE%89%E0%AE%B3%E0%AE%B5%E0%AF%81%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AF%81%E0%AE%B1%E0%AF%88&entry.239756388=sugg
        npForm.validate();
        
        
        if(!$npForm.valid) return;
        
        const vals = get(npForm).summary;
        
        let topic_val = vals.topic.value;
        let topic = topics_settings[topic_val].label.en + " "
                    + topics_settings[topic_val].label.si + " "
                    + topics_settings[topic_val].label.ta;
                    
        let data = {
            tstamp: new Date(),
            name: vals.name, 
            digIDProvider: vals.digIDProvider.label,
            digID: vals.digID,
            topic: topic,
            topicID: topic_val,
            title: vals.title,
            post: vals.post,
            locale: get(locale),
        }
        
        // Add data to the google form
        submitting = true;
        // TODO: check for errors
        try {
            await submitGoogleForm(data);
            submitting = false;
        } catch(e){
            console.log(e);
            submitting = false
        }
        
        // TODO: do we insert the post right away or wait for the response from
        //      google and db connection?
        posts.insert(Post.from_web_form(data))
        npForm.reset();
        $npForm.dirty = false;
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
        <TranslatableSelect item_settings={topics_settings} bind:value={$topic.value}/>
        <!-- {#if $npForm.hasError('topic.required')}
            <div class="validate-error">Topic is required</div>
        {/if} -->
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