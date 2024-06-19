<script>
	import Editor from '$lib/components/Editor.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="flex h-full flex-col overflow-hidden">
	<Navbar />
	<Editor />
</div>

<style>
	:root {
		/* Fix modal scrollbar gutter overrided by daisyui */
		scrollbar-gutter: initial !important;
	}
</style>
