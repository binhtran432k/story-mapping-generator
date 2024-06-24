<script>
	import { onDestroy, onMount } from 'svelte';
	import { stateStore, updateCode, generatedStateStore } from '$lib/utils/state';

	/** @type {HTMLDivElement|undefined} */
	let divElement;
	/** @type {import('monaco-editor')|undefined} */
	let monaco;
	/** @type {import('monaco-editor').editor.IStandaloneCodeEditor|undefined} */
	let editor;

	let text = '';

	stateStore.subscribe(({ code }) => {
		if (!editor || !monaco) {
			return;
		}

		// Update editor text if it's different
		const newText = code;
		if (newText !== text) {
			editor.setScrollTop(0);
			editor.setValue(newText);
			text = newText;
		}

		// Update editor mode if it's different
		const model = editor.getModel();
		if (!model) {
			throw new Error("editor model doesn't exist");
		}
	});

	/**
	 * @param {string} text
	 */
	const handleUpdate = (text) => {
		updateCode(text);
	};

	onMount(async () => {
		if (!divElement) {
			throw new Error('div element is undefined');
		}
		monaco = (await import('$lib/utils/monaco')).default;
		const model = monaco.editor.createModel(
			$stateStore.code,
			undefined,
			monaco.Uri.parse('file:///storymapping.yaml')
		);
		monaco.editor.onDidChangeMarkers(() => {
			if (monaco) {
				const owner = 'yaml';
				const markers = monaco.editor
					.getModelMarkers({ owner })
					.map((x) => ({ ...x, severity: 8 }));
				monaco.editor.removeAllMarkers(owner);
				monaco.editor.setModelMarkers(model, owner, markers);

				// Update the state store
				generatedStateStore.update((state) => ({
					...state,
					errors: markers.map((marker) => marker.message)
				}));
			}
		});
		editor = monaco.editor.create(divElement, {
			minimap: { enabled: false },
			theme: 'vs-dark',
			automaticLayout: true,
			model,
			fixedOverflowWidgets: true,
			quickSuggestions: {
				other: true,
				comments: true,
				strings: true
			}
		});
		editor.onDidChangeModelContent(({ isFlush }) => {
			const newText = editor?.getValue();
			if (!newText || text === newText || isFlush) {
				return;
			}
			text = newText;
			handleUpdate(text);
		});
	});

	onDestroy(() => {
		editor?.dispose();
	});
</script>

<div class="flex h-full flex-col overflow-hidden">
	<div bind:this={divElement} id="editor" class="h-full flex-grow" />
</div>
