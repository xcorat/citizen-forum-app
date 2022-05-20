<script lang='ts'>
    import {  _ } from 'svelte-i18n';
    import LocaleSwitcher from '../components/controllers/localeSwitcher.svelte';
</script>

<div class="flex">
<!-- Navbar -->
<div class="sticky top-0 z-50 w-full navbar bg-base-100"> 
    <a href="/" class="normal-case text-xl">{$_('demands.title')}</a>
    <div class="navbar-end">
        <LocaleSwitcher/>
    </div>
</div>
</div>
<div class='max-w-6xl mx-auto bg-base-100 min-h-screen'>
    <slot></slot>
</div>


