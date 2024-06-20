<script>
	import { onDestroy, onMount } from 'svelte';
	import sample from '$lib/sample.yaml?raw';

	/** @type {HTMLDivElement|undefined} */
	let divElement;
	/** @type {import('monaco-editor')|undefined} */
	let monaco;
	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor|undefined} */
	let editor;

	onMount(async () => {
		if (!divElement) {
			throw new Error('div element is undefined');
		}
		monaco = (await import('$lib/utils/monaco')).default;
		const model = monaco.editor.createModel(
			sample,
			undefined,
			monaco.Uri.parse('file:///storymapping.yaml')
		);
		editor = monaco.editor.create(divElement, {
			minimap: { enabled: false },
			theme: 'vs-dark',
			automaticLayout: true,
			model,
			quickSuggestions: {
				other: true,
				comments: true,
				strings: true
			}
		});
	});

	onDestroy(() => {
		editor?.dispose();
	});
</script>

<div class="flex h-full flex-col">
	<div bind:this={divElement} id="editor" class="h-full flex-grow" />
</div>
