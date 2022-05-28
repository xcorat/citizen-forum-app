<script lang="ts">
    import { add_topics } from '$lib/i18n';
    import { get } from 'svelte/store'
    import { posts } from '../stores/postsStore';

    import { onDestroy, onMount } from 'svelte';
    import { locale, _ } from 'svelte-i18n';
    import MasonryGrid from './controllers/MasonryGrid.svelte';

    export let numDisplayed = 25;

    // TODO: fucking terrible way to detect component mount but dont care, fix later
    let mountDone = false;

    $: add_topics($locale);

    let displayIndices = {start: 0, end: numDisplayed};
    let displayed = [];

    // TODO: this is on a seperate function call so we can call the redrawing of
    //  posts whwnever the posts change
    // TODO: we can probably use `MutationObserver` to do this..
    // function getUpdatedDisplayList(posts){
    //     // TODO: update the grid layout when it's done drawing instead of a timeout
    //     displayIndices = {start: 0, end: numDisplayed};
    //     if(mountDone) setTimeout(() => resizeAllGridItems(), 300);
    //     displayed = posts.slice(displayIndices.start, displayIndices.end)
    //             .map(post => post.get_displayable());
    // }
    
    // const posts_unsubscribe = posts.subscribe(getUpdatedDisplayList);

    function loadMore(newer: boolean = true, len: number = numDisplayed) {
    //     if(newer) {
    //         displayIndices.end = (displayIndices.end + len < posts.len())?
    //                                 displayIndices.end + len: posts.len();
    //         displayIndices.start = displayIndices.end - len; 
    //     }
    //     else {
    //         displayIndices.start = (displayIndices.start < len)? 0: displayIndices.start - len;
    //         displayIndices.end = displayIndices.start + len; 
    //     }
    //     displayed = posts.slice(displayIndices.start, displayIndices.end)
    //                 .map(post => post.get_displayable());
    //     // TODO: update the grid layout when it's done drawing instead of a timeout
    //     setTimeout(() => resizeAllGridItems(), 300);
    }


    onDestroy( () => {
        // posts_unsubscribe();
    })

</script>

<MasonryGrid/>

<div class="m-10 flex justify-center">
    <button class="btn  m-5" on:click={() => { loadMore(false) }} disabled={displayIndices.start < 1}>
        Previous
    </button>
    <button class="btn m-5" on:click={() => { loadMore(true) }} disabled={displayIndices.end >= posts.len()}>
        Next
    </button>
</div>

<style>
    .masonry-grid {
       display: grid;
       grid-gap: 10px;
       grid-template-columns: repeat(auto-fill, minmax(330px,1fr));
       grid-auto-rows: 100px;
    }
    
    /** Longer posts are truncated, and is marked with `trunc` class */
    /* .trunc .card-actions {
        background-color: red;
        overflow-y: hidden  ;
    } */
    
    .card-author {
        text-align: right;
    }
    
    /** DEBUG */
    .page-title {
        border-bottom: 1px;
    }
</style>
    
