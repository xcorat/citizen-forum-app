<script lang="ts">
    import { locale, locales } from '$lib/i18n';
    import LangSelect from '../svg-icons/langSelect.svelte';

</script>

<div title="Change Language" class="dropdown dropdown-end">
    <div tabindex="0" class="btn btn-ghost gap-1 normal-case ">
        <LangSelect/>
    </div>
    <div class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-12 w-56 overflow-y-auto shadow-2xl">
        <ul class="menu gap-1 p-1" tabindex="0">
            {#each locales as loc}
            <li>
                <div class="flex" class:btn-warning="{loc.name == $locale}"
                    on:click={() => $locale = loc.name}>{loc.label}
                    <!-- <img loading="lazy" width="20" height="20" alt="English" src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1ec-1f1e7.svg"> -->
                    <span class="flex flex-1 justify-between"></span>
                </div>
            </li>
            {/each}
        </ul>
        </div>
</div>