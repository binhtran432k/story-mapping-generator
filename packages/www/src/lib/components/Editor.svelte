<script>
	import { onDestroy, onMount } from 'svelte';

	/** @type {HTMLDivElement|undefined} */
	let divElement;
	/** @type {import('monaco-editor')|undefined} */
	let monaco;
	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor|undefined} */
	let editor;
	/** @type {import('monaco-editor').editor.IStandaloneEditorConstructionOptions} */
	const editorOptions = {
		minimap: { enabled: false },
		theme: 'vs-dark',
		overviewRulerLanes: 0
	};

	onMount(async () => {
		if (!divElement) {
			throw new Error('div element is undefined');
		}
		monaco = (await import('$lib/utils/monaco')).default;
		editor = monaco.editor.create(divElement, editorOptions);
		editor.setValue('Hello World');
	});

	onDestroy(() => {
		editor?.dispose();
	});
</script>

<div class="flex h-full flex-col">
	<div bind:this={divElement} id="editor" class="h-full flex-grow overflow-hidden" />
</div>
