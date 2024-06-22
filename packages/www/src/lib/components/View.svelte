<script>
	import { stateStore, updateCodeStore } from '$lib/utils/state';
	import { onMount } from 'svelte';
	import { renderDiagram } from 'story-mapping-generator';

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
	let code = '';
	let hide = false;

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

	const handleDisablePanZoom = () => {
		if (!pzoom) {
			throw new Error('pan zoom did not define yet!');
		}
		pzoom.disableControlIcons();
		pzoom.disableDblClickZoom();
		pzoom.disablePan();
		pzoom.disableZoom();
		pzoom.disableMouseWheelZoom();
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

	/**
	 * @param {ValidatedState} state
	 */
	const handleStateChange = async (state) => {
		if (state.errors.length) {
			handleDisablePanZoom();
			return;
		}
		if (!view || !container) {
			throw new Error('view and container must be binded');
		}
		// Do not render if there is no change in Code/Config/PanZoom
		if (code === state.code) {
			return;
		}

		code = state.code;
		const scroll = view.parentElement?.scrollTop;
		const svg = renderDiagram('graph-div', code);

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
			void handleStateChange(state);
		});
		window.addEventListener('resize', () => {
			if (pzoom) {
				pzoom.resize();
			}
		});
	});
</script>

<div id="view" bind:this={view} class="relative h-full p-2">
	<div
		class="absolute left-1/2 w-80 -translate-x-1/2 bg-error p-2 text-error-content"
		class:hidden={!$stateStore.errors.length}
	>
		{$stateStore.errors}
	</div>
	<div
		id="container"
		bind:this={container}
		class="h-full overflow-auto {hide && 'invisible'}"
		class:opacity-50={$stateStore.errors.length}
	/>
</div>
