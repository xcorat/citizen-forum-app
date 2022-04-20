<script>
	import '../app.css';

    import { dictionary, locale, _ } from 'svelte-i18n';

	import '../lib/i18n';
    import Nav from "../components/nav.svelte"

	// TODO: this shouldn't be needed? do we need to wait for load to be done?

</script>


<!--
	TODO: The drawer doesn't close after clicking th second time. Debug?
-->
<div class='max-w-6xl mx-auto bg-base-100 min-h-screen'>
	<div class="drawer">
		<input id="nav-drawer-1" type="checkbox" class="drawer-toggle"> 
		<div class="drawer-content flex flex-col">
			<Nav/>
			<slot></slot>
		</div>
		<div class="drawer-side">
			<label for="nav-drawer-1" class="drawer-overlay"></label> 
			<ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
				<!-- Sidebar content here -->
				<li><a href="/form">{$_('nav.fill')}</a></li>
				<li><a href="/responses">{$_('nav.read_responses')}</a></li>
			</ul>
		</div>
			
	</div>
</div>