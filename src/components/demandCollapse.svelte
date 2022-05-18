<script lang='ts'>
    export let index;
    export let text;
    export let title;
    export let subs;

    let subdemands = Object.entries(subs);

</script>

<div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
    <div class="collapse-title text-xl font-medium">
      {index}. { title }
    </div>
    <div class="collapse-content"> 
        {#if text}
            <p>{text}</p>
        {/if}
        {#if subdemands}
        <ol type="a">
        {#each subdemands as [idx, subdemand] }
            <li>{subdemand}</li>
        {/each}
        </ol>
        {/if}
    </div>
</div>