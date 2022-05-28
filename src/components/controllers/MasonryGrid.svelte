<script lang="ts">
    import { _ } from 'svelte-i18n';
    import PostCard from './PostCard.svelte';
    import {  onMount, onDestroy } from 'svelte';
    import { posts } from '../../stores/postsStore';

    function resizeGridItem(grid, item){
        // TODO: just remove the 'px' and use '+' operator?
        let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        
        // TODO: Just a quick debug, see how to fix this properly
        let contentDiv = item.querySelector('.content');
        if(!contentDiv) {
            console.log("ERROR: (MasonryGrid)", item)
            return;
        }
        
        let rowSpan = Math.ceil((contentDiv.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
        item.style.gridRowEnd = "span "+rowSpan;

    }

    function resizeAllGridItems(){
        console.log('resizeall', $posts.length)
        let grid = document.getElementsByClassName("masonry-grid")[0];
        let allItems = document.getElementsByClassName("post-item");
        for(let x=0; x<allItems.length; x++){
            resizeGridItem(grid, allItems[x]);
        }
    }

    // Detect change in displayed posts, and trigger redraw
    // const posts_unsubscribe = posts.subscribe(resizeAllGridItems);
    

    onMount(() => {
        resizeAllGridItems();
        let mgrid = document.getElementsByClassName("masonry-grid")[0];
        new ResizeObserver(resizeAllGridItems).observe(mgrid)
        // window.addEventListener("resize", resizeAllGridItems);
    });

    onDestroy( () => {
        // posts_unsubscribe();
    });

</script>

<div class="masonry-grid">
    {#each $posts as post}
    <div class="post-item">
        <PostCard {post}/>
    </div>
    {/each}
</div>

<style>
    .masonry-grid {
       display: grid;
       grid-gap: 10px;
       grid-template-columns: repeat(auto-fill, minmax(330px,1fr));
       grid-auto-rows: 100px;
    }
    
    /** DEBUG */
    .page-title {
        border-bottom: 1px;
    }
</style>