<script lang="ts">
    import { dictionary, _, locale } from "svelte-i18n";
    
    const page_id = 'demand_comment_form';

    dictionary.update( (dict) => {
        console.log(dict)
        dict['si_LK'][page_id] = {
            "suggestions": "suggestions-si",
            "questions": "questions-si"
        };
        dict['ta_LK'][page_id] = {
            "suggestions": "suggestions-ta",
            "questions": "questions-ta"
        }

        return dict;
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
    <h1>Add Suggestion/Question</h1>
    <form class="mt-5" on:submit|preventDefault>
        <div>
            <textarea class="w-full textarea" placeholder="Add Suggestion/Question" bind:value="{userComment}"></textarea>
        </div>
        <div>
            <button class="btn btn-primary" on:click="{submitSuggestion}">
                {$_(page_id+'.suggestions', { default: "Submit a Suggestion"})}
            </button>
            <button class="btn"  on:click="{submitQuestion}">
                {$_(page_id+'.questions', { default: "Ask a Question"})}
            </button>
        </div>
    </form>
</div>