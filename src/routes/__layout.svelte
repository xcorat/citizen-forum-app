<script>
	import '../app.css';
	import '../lib/i18n';
    import Nav from "../components/nav.svelte"
</script>


<div class='max-w-6xl mx-auto bg-base-100 min-h-screen'>
    <Nav/>
    <slot></slot>
</div>