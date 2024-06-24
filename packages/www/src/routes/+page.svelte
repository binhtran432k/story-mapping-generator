<script>
	import Card from '$lib/components/Card/Card.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import View from '$lib/components/View.svelte';
</script>

<div class="flex h-full flex-col overflow-hidden">
	<Navbar />
	<div class="flex flex-1">
		<div class="hidden flex-col md:flex" id="editorPane" style="width: 40%">
			<Card isCloseable={false} title="Code">
				<Editor />
			</Card>
		</div>
		<div class="flex flex-1 flex-col">
			<Card title="Diagram" isCloseable={false}>
				<div slot="actions" class="flex flex-row items-center">
					<DownloadButton />
				</div>
				<View />
			</Card>
			<div class="mx-2 rounded p-2 shadow md:hidden">
				Code editing not supported on mobile. Please use a desktop browser.
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		/* Fix modal scrollbar gutter overrided by daisyui */
		scrollbar-gutter: initial !important;
	}
</style>
