<script>
    //import runSample from '../lib/forms_api.js.bak'
    import { onMount } from 'svelte';
    import { responses } from '../stores/responsesStore';

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

</script>

<h1>Citizen Suggestions</h1>
<div class="masonry-grid">
    {#each res as item}
    <div class="item blog">
        <div class="card bg-base-100 shadow-xl content">
            <div class="card-body">
                <h2 class="card-title">{item.topic}</h2>
                <p>{@html item.exerpt.replace(/\n/g, '<br>')}</p>
                <div class="card-author">by {item.author}</div>
                {#if item.truncated}
                    <div class="card-actions justify-center">
                        <a href="/post/{item.index}" class="btn btn-primary">Read More</a>
                    </div>
                {/if}   
            </div>
        </div>
    </div>
    {/each}
</div>


<style>
.masonry-grid {
   display: grid;
   grid-gap: 10px;
   grid-template-columns: repeat(auto-fill, minmax(350px,1fr));
   grid-auto-rows: 100px;
}

.trunc {
    color: red;
    overflow-y: hidden  ;
}

.card-author {
    text-align: right;
}
</style>
