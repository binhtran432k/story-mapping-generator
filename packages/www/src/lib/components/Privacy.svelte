<script>
	import Close from '$lib/icons/Close.svelte';
</script>

<label for="privacyModal" {...$$props}>
	<slot />
</label>

<input type="checkbox" id="privacyModal" class="modal-toggle" />
<div class="modal normal-case" role="dialog">
	<div class="modal-box flex flex-col gap-4 text-base-content">
		<h1 class="text-3xl font-bold">Data security</h1>
		<p>
			<span class="text-xl font-extrabold">
				The content of the diagrams you create never leaves your browser.
			</span>
			It's stored in the URL, and the browser's local storage only.
		</p>
		<p>
			Story Mapping Generator live editor is a fully client side application, that will also work as
			an offline <a
				href="https://web.dev/explore/progressive-web-apps"
				class="link"
				target="_blank"
			>
				PWA.
			</a>
		</p>

		<label class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" for="privacyModal">
			<Close class="text-2xl" />
		</label>
	</div>
</div>
