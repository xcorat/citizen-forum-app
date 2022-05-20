<script lang='ts'>
    export let index: number = 0;
    export let text;
    export let title;
    export let subs;

    let subdemands;
    $: subdemands = Object.entries(subs);

</script>

<div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
    <div class="collapse-title">
      {#if index > 0} {index}. {/if}{ title }
    </div>
    <div class="collapse-content pr-8"> 
        {#if text}
            <p>{text}</p>
        {/if}
        {#if subdemands}
        <ol type="a">
        {#each subdemands as [idx, subdemand] }
            <li class="text-justify">{subdemand}</li>
        {/each}
        </ol>
        {/if}
    </div>
</div>

<style>
    .collapse-title {
        font-size: 1.1;
        font-weight: 600;
    }

</style>