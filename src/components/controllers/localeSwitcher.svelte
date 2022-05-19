<script lang="ts">
    import { locale, locales } from '$lib/i18n';

</script>


<div class="btn-group">
    {#each locales as loc}
        <button class="btn" class:btn-active="{loc.name == $locale}"
            on:click={() => $locale = loc.name}>{loc.label}</button>
    {/each}
</div>