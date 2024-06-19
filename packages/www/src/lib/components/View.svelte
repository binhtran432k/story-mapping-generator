<script>
	import { stateStore, updateCodeStore } from '$lib/utils/state';
	import { onMount } from 'svelte';

	/**
	 * @typedef {import('$lib/types').State} State
	 * @typedef {import('$lib/types').ValidatedState} ValidatedState
	 */

	// Dependency injections variables
	/** @type {import('svg-pan-zoom')|undefined} */
	let panzoom;
	/** @type {HTMLDivElement|undefined} */
	let view;
	/** @type {HTMLDivElement|undefined} */
	let container;
	/** @type {panzoom|undefined} */
	let pzoom;

	// Normal variables
	let hide = false;
	/** @type {string} */
	let svg;

	/** @type {Timer|undefined} */
	let panZoomDebounce;
	const handlePanZoomChange = () => {
		clearTimeout(panZoomDebounce);
		panZoomDebounce = setTimeout(() => {
			if (!pzoom) {
				return;
			}
			const pan = pzoom.getPan();
			const zoom = pzoom.getZoom();
			updateCodeStore({ pan, zoom });
		}, 300);
	};

	/**
	 * @param {State} state
	 */
	const handlePanZoom = (state) => {
		hide = true;
		pzoom?.destroy();
		pzoom = undefined;
		void Promise.resolve().then(() => {
			if (!panzoom) {
				throw new Error('panzoom must be initialied');
			}
			pzoom = panzoom('#graph-div', {
				onPan: handlePanZoomChange,
				onZoom: handlePanZoomChange,
				controlIconsEnabled: true,
				fit: true,
				center: true
			});
			// Make sure the pan zoom has proper size
			pzoom.resize();
			const { pan, zoom } = state;
			if (pan !== undefined && zoom !== undefined && Number.isFinite(zoom)) {
				pzoom.zoom(zoom);
				pzoom.pan(pan);
			}
			hide = false;
		});
	};

	// HACK: hard code generated svg
	const generatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" id='graph-div' width="10em" height="10em" viewBox="0 0 32 32" ><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-4.5 9A2.5 2.5 0 1 1 9 13.5a2.48 2.48 0 0 1 2.5-2.5M16 24a8.11 8.11 0 0 1-7-4h14a8.11 8.11 0 0 1-7 4m4.5-8a2.5 2.5 0 1 1 2.5-2.5a2.48 2.48 0 0 1-2.5 2.5"/></svg>`;

	/**
	 * @param {ValidatedState} state
	 */
	const handleStateChange = (state) => {
		if (!view || !container) {
			throw new Error('view and container must be binded');
		}
		const scroll = view.parentElement?.scrollTop;
		if (generatedSvg === svg) {
			return;
		}
		svg = generatedSvg;
		if (svg.length > 0) {
			container.innerHTML = svg;
			handlePanZoom(state);
			/** @type {SVGSVGElement|null} */
			const graphDiv = document.querySelector('#graph-div');
			if (!graphDiv) {
				throw new Error('#graph-div not found');
			}
			graphDiv.setAttribute('height', '100%');
			graphDiv.setAttribute('width', '100%');
			graphDiv.style.maxWidth = '100%';
			if (view.parentElement && scroll) {
				view.parentElement.scrollTop = scroll;
			}
		}
	};

	onMount(async () => {
		panzoom = (await import('svg-pan-zoom')).default;
		stateStore.subscribe((state) => {
			handleStateChange(state);
		});
		window.addEventListener('resize', () => {
			if (pzoom) {
				pzoom.resize();
			}
		});
	});
</script>

<div id="view" bind:this={view} class="h-full p-2">
	<div id="container" bind:this={container} class="h-full overflow-auto {hide && 'invisible'}" />
</div>
