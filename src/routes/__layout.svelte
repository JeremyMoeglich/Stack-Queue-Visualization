<script context="module">
	export const load = async ({ url }) => ({
		props: {
			key: url.pathname
		}
	});
</script>

<script>
	import PageTransition from '$lib/pagetransition.svelte';
	export let key;
</script>

<div class="site">
	<a href="/structs/queue">Queue</a>
	<a href="/structs/stack">Stack</a>
	<a href="/structs/stack2queue">Stack2Queue</a>
	<PageTransition refresh={key}>
		<slot />
	</PageTransition>
</div>

<style lang="scss">
	:global(*) {
		font-family: Arial, Helvetica, sans-serif;
	}
	:global(body) {
		margin: 0px;
		background-color: var(--lt-color-gray-800);
		overflow: hidden;
	}
	.site {
		padding: 10px;
	}
	a {
		color: rgb(0, 238, 255);
		text-decoration: none;
		padding: 5px;
		&:hover {
			background-color: var(--lt-color-gray-600);
		}
	}
	:global(button) {
		padding: 20px 10px;
		background-color: var(--lt-color-gray-700);
		border-radius: 5px;
		border: 3px solid green;
		margin: 10px;
		color: white;
		&:hover {
			background-color: var(--lt-color-gray-600);
		}
	}
</style>
