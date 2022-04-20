<script>
    import { form, field } from 'svelte-forms';
    import Select from 'svelte-select';
    import { required, email as email_validator } from 'svelte-forms/validators';
  
    const name = field('name', '', [required()]);

    const digIDProvider = field('digIDProvider', '', [required()]);
    const digID = field('digID', '', [required()]);
    //const email = field('email', '', [required(), email_validator()]);
    
    const topic = field('topic', '', [required()]);
    const title = field('title', '', [required()]);
    const post = field('post', '', [required()]);
    
    const npForm = form(name, digIDProvider, digID, topic, title, post);
    
    const digIDPs = ["email", "phone", "facebook", "twitter"];
    const topics = [{
        value: "banking",
        label: "Banking, Finance, & Financial Services"
    },
    {
        value: "banking2",
        label: "Banking, Finawerwerwers"
    },
    {
        value: "banking3",
        label: "werrwer"
    },
    {
        value: "banking4",
        label: "dshhrServices"
    },
    {
        value: "banking5",
        label: "Banking, Finance, jytettrh"
    },
    {
        value: "banking6",
        label: "ertwertertes"
    },
    {
        value: "banking7",
        label: "jetyd"
    },
    ]

    const submitHandler = () => {
        npForm.validate();
        console.log($npForm)
    }
  </script>
  
<section class="m-5 max-w-2xl ">
<!-- svelte-ignore component-name-lowercase -->
<form on:submit|preventDefault={submitHandler}>
    <div class="form-control">
        <label class="label" for="npform-name">
            <span class="label-text">Name</span>
        </label>
        <input type="t  ext" placeholder="Your Name" class="input input-bordered"
            bind:value={$name.value} id="npform-name">
        {#if $npForm.hasError('name.required')}
            <div class="validate-error">Name is required</div>
        {/if}
    </div>

    <div class="form-control">
        <label class="label" for="npform-digIDProvider">
            <span class="label-text">Digital identity</span>
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
            <span class="label-text">Digital Identity link</span>
        </label>
        <input type="text" placeholder="aragalakarie@gotagogama.lk" class="input input-bordered"
            bind:value={$digID.value} id="npform-digID">  
        {#if $npForm.hasError('digID.required')}
            <div class="validate-error">Digital Identity link is required</div>
        <!-- {:else if $npForm.hasError('email.not_an_email')}
            <div class="validate-error">Not an email</div> -->
        {/if}
    </div>

    <div class="form-control">
        <label class="label" for="npform-topic">
            <span class="label-text">Topic</span>
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
            <span class="label-text">Post Title</span>
        </label>
        <input type="text" placeholder="Short title for the suggestion" class="input input-bordered"
            bind:value={$title.value} id="npform-title">  
    </div>

    <div class="form-control">
        <label class="label" for="npform-post">
            <span class="label-text">Suggestion</span>
        </label>
        <textarea class="textarea textarea-bordered" placeholder="Type your suggestion" 
            bind:value={$post.value} id="npform-post"></textarea>
        {#if $npForm.hasError('post.required')}
            <div class="validate-error">Post is required</div>
        {/if}   
    </div>
    <div class="content-center">
        <button class="btn mt-10" disabled={!$npForm.valid}
            on:click={submitHandler}>Submit</button>
    </div>
</form>
</section>

<style>
    .validate-error {
        color: red;
    }
</style>