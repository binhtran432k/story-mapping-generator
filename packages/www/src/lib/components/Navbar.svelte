<script>
	import Menu from '$lib/icons/Menu.svelte';
	import Close from '$lib/icons/Close.svelte';
	import Privacy from './Privacy.svelte';
	import Github from '$lib/icons/Github.svelte';
	import clsx from 'clsx';
	import Shield from '$lib/icons/Shield.svelte';

	let isMenuOpen = false;
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	/**
	 * @typedef Link
	 * @property {string} href
	 * @property {string} [title]
	 * @property {'github'} [icon]
	 */

	/** @type {Link[]} */
	const links = [
		{
			href: 'https://github.com/binhtran432k/story-mapping-generator',
			icon: 'github'
		}
	];
</script>

<div class="navbar relative z-50 bg-primary text-primary-content shadow-lg">
	<div class="mx-2 flex-1">
		<span class="text-lg font-bold">
			<a href="/" class="flex flex-col items-baseline gap-2 sm:flex-row"
				><span>Story Mapping Generator</span><span class="text-xs font-thin">by Binh Tran</span></a
			>
		</span>
	</div>

	<label for="menu-toggle" class="cursor-pointer text-2xl lg:hidden">
		{#if isMenuOpen}<Close />{:else}<Menu />{/if}
	</label>
	<input
		class="hidden"
		type="checkbox"
		id="menu-toggle"
		bind:checked={isMenuOpen}
		on:click={toggleMenu}
	/>

	<div
		class={clsx(
			'text w-full bg-primary uppercase lg:flex lg:w-auto lg:items-center',
			isMenuOpen ? 'absolute left-0 top-full flex p-2 lg:static lg:p-0' : 'hidden'
		)}
	>
		<!-- <Theme /> -->
		<ul class="w-full items-center justify-between pt-2 lg:flex lg:pt-0">
			<li>
				<Privacy class="btn btn-ghost w-full">
					<Shield class="text-xl" /> Security
				</Privacy>
			</li>
			{#each links as { title, href, icon }}
				<li>
					<a class="btn btn-ghost w-full" target="_blank" {href}>
						{#if icon == 'github'}
							<Github class="text-xl" />
						{/if}
						{#if title}
							{title}
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
