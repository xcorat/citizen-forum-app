<script lang="ts">
    import {  _ } from 'svelte-i18n';
    import LocaleSwitcher from './controllers/localeSwitcher.svelte';

</script>
<!-- Navbar -->
<div class="sticky top-0 z-50 w-full navbar bg-base-100">
    <div class="flex-none lg:hidden">
        <label for="nav-drawer-1" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
    </div> 
    <div class="w-10 mr-5">
        <img src="/images/cflogo1.png" alt="cf logo"/>
    </div>
    <div class="mr-auto">
        <a href="/" class="normal-case text-xl">{$_('app_title')}</a>
    </div>
    <div class="navbar-end">
        <div class="flex-none hidden lg:block">
            <ul class="menu menu-horizontal p-5">
                <li><a href="/form">{$_('nav.fill')}</a></li>
                <li><a href="/responses">{$_('nav.read_responses')}</a></li>
            </ul>
        </div>
        <LocaleSwitcher/>
    </div>
</div>
    