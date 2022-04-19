<script lang="ts">
    import { page } from '$app/stores';
    import { responses } from '../../stores/responsesStore';
    
    const postId: number = parseInt($page.params.id);
    let postfound = true;

    if(postId == NaN || postId >= $responses.length) {
        postfound = false;
    }

    const post = $responses[postId];
</script>

{#if postfound}
<article class="prose lg:prose-lg">
    <h2 class="m-5">{post.topic}</h2>
    <div class="m-5 post-content">
        <p>{@html post.post.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="m-5 post-author">
        <p>by {post.author}</p>
    </div>
</article>
{:else}
<article class="prose m-10">
<h1>Post not found</h1>
<a href="/">Return to home</a>
</article>
{/if}