<script lang="ts">
    import { page } from '$app/stores';
    import { responses } from '../../stores/responsesStore';
    import { dictionary, _ } from 'svelte-i18n';
    import topics_settings from '../../data/topics_settings.json';
    
    const postId: number = parseInt($page.params.id);
    let postfound = true;

    dictionary.update( (dict) => {
        dict.si_LK['read_more'] = "තවත් කියවන්න" ;
        // TODO: correct?
        dict.ta_LK['read_more'] = "மேலும் படிக்க" ;

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

    if(postId == NaN || postId >= $responses.length) {
        postfound = false;
    }

    const postdis = $responses[postId];
</script>

{#if postfound}
<article class="prose lg:prose-lg">
    <h2 class="m-5">{$_('topics.'+postdis.post.topic)}</h2>
    <div class="m-5 post-content">
        <p>{@html postdis.post.text.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="m-5 post-author">
        <p>by {postdis.post.author.name}</p>
    </div>
</article>
{:else}
<article class="prose m-10">
<h1>Post not found</h1>
<a href="/">Return to home</a>
</article>
{/if}