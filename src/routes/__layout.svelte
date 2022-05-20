<script context="module">
	import { setupI18n } from '../lib/i18n';
	setupI18n();
</script>

<script>
	import '../app.css';
    import { _ } from 'svelte-i18n';
    import Nav from "../components/nav.svelte"
	import Footer from '../components/footer.svelte';

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
			<Footer/>
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