<script lang="ts">
    import { add_topics } from '$lib/i18n';

    import { onMount } from 'svelte';
    import { locale, _ } from 'svelte-i18n';

    export let numDisplayed = 25;
    export let posts = [];

    // TODO: fucking terrible way to detect component mount but dont care, fix later
    let mountDone = false;

    $: add_topics($locale);

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
    let displayed = [];

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
                <h2 class="card-title">{$_('topics.'+item.topic)}</h2>
                <p>{@html item.excerpt.replace(/\n/g, '<br>')}</p>
                <div class="card-author">by {item.author.name}</div>
                {#if item.truncated}
                    <div class="card-actions justify-center">
                        <a href="/post/{item.index}" class="btn btn-primary">
                            {$_('responses.read_more', { default: 'Read More' })}
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
    
