<script lang="ts">
	import Console from '$lib/components/console.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import Element from '$lib/components/element.svelte';
	let queue = [];
	let e_index = 0;
	function push(v) {
		if (typeof v === 'undefined') {
			return Error('Missing Attribute: v');
		}
		queue = [[e_index, v], ...queue];
		e_index++;
		return `Pushed element ${v} onto queue`;
	}
	function pop() {
		if (isEmpty()) {
			return Error('Queue is empty');
		}
		const v = queue.pop();
		queue = queue;
		return v[1];
	}
	function isEmpty() {
		return queue.length === 0;
	}
	function top() {
		if (isEmpty()) {
			return Error('Queue is empty');
		}
		return queue.at(-1)[1];
	}
	function printQueue() {
		return queue;
	}

	const commands = {
		push: push,
		pop: pop,
		put: push,
		dequeue: pop,
		enqueue: push,
		isEmpty: isEmpty,
		top: top,
		printQueue: printQueue
	};
	push(5);
	push(4);
	push(6);
	push(8);
</script>

<div>
	<Console {commands} />
	<div class="elements">
		{#each queue as e (e[0])}
			<div
				animate:flip={{ duration: 500 }}
				in:fly={{ x: -300, duration: 500 }}
				out:fly={{ x: 300, duration: 500 }}
			>
				<Element value={e[1]} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.elements {
		display: flex;
		justify-content: center;
		border-top: 10px solid white;
		border-bottom: 10px solid white;
		width: 80vw;
		min-height: 100px;
		margin-left: auto;
		margin-right: auto;
		padding: 20px;
	}
</style>
