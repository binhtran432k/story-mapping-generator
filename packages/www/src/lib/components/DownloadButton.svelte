<script>
	import Download from '$lib/icons/Download.svelte';
	import { stateStore } from '$lib/utils/state';
	import { renderDiagram } from 'story-mapping-generator';
</script>

<button
	class="btn btn-secondary btn-xs"
	class:hidden={!$stateStore.validDiagram}
	title="Download diagram"
	on:click={(e) => {
		e.preventDefault();
		const a = document.createElement('a');
		a.setAttribute('download', 'story-mapping.svg');
		a.setAttribute(
			'href',
			'data:image/svg;charset=utf-8,' +
				encodeURIComponent(renderDiagram('graph-div', $stateStore.code))
		);
		a.click();
		a.remove();
	}}
>
	<Download class="text-sm" />
</button>
