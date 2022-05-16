<script lang="ts">
import type { PostDisplay } from '$lib/post_schema';

    import { onMount } from 'svelte';
    import { dictionary, _ } from 'svelte-i18n';

    import topics_settings from '../data/topics_settings.json';

    export let numDisplayed = 25;
    export let posts: PostDisplay[] = [];

    // TODO: fucking terrible way to detect component mount but dont care, fix later
    let mountDone = false;

    // Update the translations dictionary for this page
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

    // TODO: Move the mosaic js to a seperate file/library
    function resizeGridItem(item){
        let grid = document.getElementsByClassName("masonry-grid")[0];
        let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        // TODO: Just a quick debug, see how to fix this properly
        let contentDiv = item.querySelector('.content');
        if(!contentDiv) {
            console.log("ERROR: ", item)
            return;
        }
        let rowSpan = Math.ceil((contentDiv.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
        item.style.gridRowEnd = "span "+rowSpan;

    }
    function resizeAllGridItems(){
        let allItems = document.getElementsByClassName("item");
        for(let x=0; x<allItems.length; x++){
            resizeGridItem(allItems[x]);
        }
    }

    let displayIndices = {start: 0, end: numDisplayed};
    let displayed: PostDisplay[] = [];

    // TODO: this is on a seperate function call so we can call the redrawing of
    //  posts whwnever the posts change
    // TODO: we can probably use `MutationObserver` to do this..
    function updatePostsList(posts){
        // TODO: update the grid layout when it's done drawing instead of a timeout
        displayIndices = {start: 0, end: numDisplayed};
        if(mountDone) setTimeout(() => resizeAllGridItems(), 300);
        return posts.slice(displayIndices.start, displayIndices.end);
    }
    
    $: displayed = updatePostsList(posts);

    function loadMore(newer: boolean = true, len: number = numDisplayed) {
        if(newer) {
            displayIndices.end = (displayIndices.end + len < posts.length)?
                                    displayIndices.end + len: posts.length;
            displayIndices.start = displayIndices.end - len; 
        }
        else {
            displayIndices.start = (displayIndices.start < len)? 0: displayIndices.start - len;
            displayIndices.end = displayIndices.start + len; 
        }
        displayed = posts.slice(displayIndices.start, displayIndices.end);
        // TODO: update the grid layout when it's done drawing instead of a timeout
        setTimeout(() => resizeAllGridItems(), 300);
    }

    onMount(() => {
        resizeAllGridItems();
        window.addEventListener("resize", resizeAllGridItems);
        mountDone = true;
    })

</script>

<div class="masonry-grid">
    {#each displayed as item}
    <div class="item blog">
        <div class="card bg-base-100 shadow-xl content" class:trunc={item.truncated}>
            <div class="card-body"> 
                <h2 class="card-title">{$_('topics.'+item.post.topic)}</h2>
                <p>{@html item.exerpt.replace(/\n/g, '<br>')}</p>
                <div class="card-author">by {item.post.author.name}</div>
                {#if item.truncated}
                    <div class="card-actions justify-center">
                        <a href="/post/{item.post.uuid}" class="btn btn-primary">
                            {$_('read_more', { default: 'Read More' })}
                        </a>
                    </div>
                {/if}   
            </div>
        </div>
    </div>
    {/each}
</div>
<div class="m-10 flex justify-center">
    <button class="btn  m-5" on:click={() => { loadMore(false) }} disabled={displayIndices.start < 1}>
        Previous
    </button>
    <button class="btn m-5" on:click={() => { loadMore(true) }} disabled={displayIndices.end >= posts.length}>
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
    
