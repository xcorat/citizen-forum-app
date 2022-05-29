<script lang="ts">
    import { page } from '$app/stores';
    import { posts } from "../../stores/postsStore";
    import { _ } from 'svelte-i18n';
    
    const postId = $page.params.id;
    enum Status {
        NotFound = -1,
        Init,
        Found,
    } 
    
    let status: Status = Status.Init;

    const post = posts.find_post(postId)?.get_displayable();
    status = (post)? Status.Found: Status.NotFound;

</script>

{#if status == Status.Found}
<article class="prose lg:prose-lg">
    <h2 class="m-5">{post.title || $_('topics.'+post.topic_id) }</h2>
    <div class="m-5 post-content">
        <p>{@html post.text.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="m-5 post-author">
        <p>by {post.author.name}</p>
    </div>
</article>
{:else if status == Status.NotFound}
<article class="prose m-10">
    <h1>Post not found</h1>
    <a href="/">Return to home</a>
</article>
{:else}
    <h1>Loading...</h1>
{/if}