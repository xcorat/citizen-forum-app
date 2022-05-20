<script context="module">
	import { setupI18n } from '../lib/i18n';
	setupI18n();
</script>

<script lang='ts'>
    import {  _ } from 'svelte-i18n';
    import LocaleSwitcher from '../components/controllers/localeSwitcher.svelte';
</script>

<div class="max-w-6xl mx-auto bg-base-100 min-h-screen">
<!-- Navbar -->
    <div class="sticky top-0 z-50 navbar bg-base-300 rounded"> 
        <div class="mx-auto">
            <a href="/" class="normal-case text-2xl ">{$_('demands.title')}</a>
        </div>
        <div class="navbar-end">
            <LocaleSwitcher/>
        </div>
    </div>
    <div class='max-w-6xl mx-auto bg-base-100 min-h-screen'>
        <slot></slot>
    </div>
    <div class="sticky footer bottom-0 z-50 bg-base-300 rounded w-full">
        <span class="flex demands-link  mx-auto align-center">
            <div class="place-self-center">
                {$_('demands.aragalaya_link_text')} 
            </div>
            <a target="_blank"
                href="https://aragalaya.online/polls/demands" class="btn btn-ghost aragalaya_btn" >
        </a>
    </span>
    </div>
</div>

<style>
     .aragalaya_btn {
        background-image: url('https://aragalaya.online/assets/title-si.png');
        width:13em;
        height: 5em;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .demands-link {
        font-size: x-large;
        font-weight: 400;
        /* padding: 15px; */
        
    }

</style>

