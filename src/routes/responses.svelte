<script lang="ts">
    //import runSample from '../lib/forms_api.js.bak'
    import { onMount } from 'svelte';
    import { dictionary, _ } from 'svelte-i18n';
    import { responses } from '../stores/responsesStore';

    // Update the translations dictionary for this page
    dictionary.update( (dict) => {
        // English is not populated fully, as the default values are set to english
        dict.en_GB['responses'] = { "citizen_sugg": "Citizen Suggestions"  };
        dict.si_LK['responses'] = {
            "citizen_sugg": "පුරවැසි අදහස්",
            "read_more": "තවත් කියවන්න" };
        dict.ta_LK['responses'] = {        };

        return dict;
    })

    // TODO: Move the mosaic js to a seperate file/library
    function resizeGridItem(item){
        let grid = document.getElementsByClassName("masonry-grid")[0];
        let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        let rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
        item.style.gridRowEnd = "span "+rowSpan;

    }
    function resizeAllGridItems(){
        let allItems = document.getElementsByClassName("item");
        for(let x=0; x<allItems.length; x++){
            resizeGridItem(allItems[x]);
        }
    }

    onMount(() => {
        resizeAllGridItems();
        window.addEventListener("resize", resizeAllGridItems);
    })

    const res = $responses;

    // TODO: Create a separate store to implement pagination. Possibly a derived store
    //      that we can use in different pages with different lengths
    const postsPerPage = 25;
    let displayIndices = {start: 0, end: postsPerPage};
    let displayed = res.slice(displayIndices.start, displayIndices.end);

    function loadMore(newer: boolean = true, len: number = postsPerPage) {
        if(newer) {
            displayIndices.end = (displayIndices.end + len < res.length)?
                                    displayIndices.end + len: res.length;
            displayIndices.start = displayIndices.end - len; 
        }
        else {
            displayIndices.start = (displayIndices.start < len)? 0: displayIndices.start - len;
            displayIndices.end = displayIndices.start + len; 
        }
        displayed = res.slice(displayIndices.start, displayIndices.end);
        // TODO: update the grid layout when it's done drawing instead of a timeout
        setTimeout(() => resizeAllGridItems(), 300);
    }


</script>

<h1 class="page-title m-10 text-3xl">{$_('responses.citizen_sugg', { default: 'Citizen Suggestions' })}</h1>
<div class="masonry-grid">
    {#each displayed as item}
    <div class="item blog">
        <div class="card bg-base-100 shadow-xl content" class:trunc={item.truncated}>
            <div class="card-body">
                <h2 class="card-title">{item.topic}</h2>
                <p>{@html item.exerpt.replace(/\n/g, '<br>')}</p>
                <div class="card-author">by {item.author}</div>
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
    <button class="btn m-5" on:click={() => { loadMore(true) }} disabled={displayIndices.end >= res.length}>
        Next
    </button>
</div>


<style>
.masonry-grid {
   display: grid;
   grid-gap: 10px;
   grid-template-columns: repeat(auto-fill, minmax(350px,1fr));
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
