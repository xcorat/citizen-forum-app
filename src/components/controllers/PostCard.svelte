<script lang='ts'>
    import { _ } from 'svelte-i18n';
    export let post;

</script>
<div class="card bg-base-100 shadow-xl content" class:trunc={post.truncated}>
    <div class="card-body"> 
        <h2 class="card-title">{$_('topics.'+post.topic)}</h2>
        <p>{@html post.excerpt.replace(/\n/g, '<br>')}</p>
        <!-- <div class="card-author">by {item.author.name}</div> -->
        {#if post.truncated}
            <div class="card-actions justify-center">
                <a href="/post/{post.index}" class="btn btn-primary">
                    {$_('responses.read_more', { default: 'Read More' })}
                </a>
            </div>
        {/if}   
    </div>
</div>

<style>
    /** Longer posts are truncated, and is marked with `trunc` class */
    /* .trunc .card-actions {
        background-color: red;
        overflow-y: hidden  ;
    } */
    
    .card-author {
        text-align: right;
    }
</style>