<script lang="ts">
    import demandsJSON from '../data/demands.json'
    import DemandCollapse from '../components/demandCollapse.svelte';
    import { dictionary, _, locale } from "svelte-i18n";
    import { intros } from 'svelte/internal';

    const page_id = 'demands';

    const locales = [{name: 'en_GB', label: 'EN'},
                     {name: 'si_LK', label: 'SI'},
                     {name: 'ta_LK', label: 'TA'} ];

    dictionary.update( (dict) => {
        dict.si_LK[page_id] = {
            "suggestions": "suggestions-si",
            "questions": "questions-si"
        };
        dict.ta_LK[page_id] = {
            "suggestions": "suggestions-ta",
            "questions": "questions-ta"
        }

        return dict;
    })

    let demands_dict = demandsJSON['en_GB']

    locale.subscribe((val) => {
        if( val ){
            demands_dict = demandsJSON[val];
        }
    });

    let userComment;
    let user = { name: "", email: "" };

    async function submitSuggestion(){
        await submitComment(true);
    }
    async function submitQuestion(){
        await submitComment(true);
    }

    async function submitComment(suggestion: boolean) {
        console.log(userComment)
        // TODO: check how to get the redirects working.
        //      The errpr asks to use a file called `_redirects`, but not sure
        //      where to put it.
        // const url = "/api/submit_demand_comment"
        const url = "/.netfly/functions/submit_demand_comment"
        async function post_comment(suggestion: boolean) {
            const commentEntry = {
                type: (suggestion)? "Suggestion": "Question",
                user,
                comment: userComment,
            }
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(commentEntry)
            })
            
            const json = await res.json()
            console.log(JSON.stringify(json))
        }
        await post_comment(suggestion);
    }

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
<div>
    <h1>Add Suggestion/Question</h1>
    <form class="mt-5" on:submit|preventDefault={submitComment}>
        <div>
            <textarea class="w-full textarea" placeholder="Add Suggestion/Question" bind:value="{userComment}"></textarea>
        </div>
        <div>
            <a role="button" class="btn btn-primary" on:click="{submitSuggestion}">
                {$_(page_id+'.suggestions', { default: "Submit a Suggestion"})}
            </a>
            <a role="button" class="btn"  on:click="{submitQuestion}">
                {$_(page_id+'.questions', { default: "Ask a Question"})}
            </a>
        </div>
    </form>
</div>