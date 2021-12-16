<script lang="ts">
	import Console from '$lib/components/console.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import Element from '$lib/components/element.svelte';

	let stack = [];
	let e_index = 0;
	function push(v) {
		if (typeof v === 'undefined') {
			return Error('Missing Attribute: v');
		}
        if (stack.length > 5) {
			return Error('Stack is full')
		}
		stack = [...stack, [e_index, v]];
		e_index++;
		return `Pushed element ${v} onto stack`;
	}
	function pop() {
		if (isEmpty()) {
			return Error('Stack is empty');
		}
		const v = stack.pop();
		stack = stack;
		return v[1];
	}
	function isEmpty() {
		return stack.length === 0;
	}
	function top() {
		if (isEmpty()) {
			return Error('Stack is empty');
		}
		return stack.at(-1)[1];
	}
	function printStack() {
		return stack;
	}

	const commands = {
		push: push,
		pop: pop,
		put: push,
		isEmpty: isEmpty,
		top: top,
		printStack: printStack
	};
	push(5);
	push(4);
	push(6);
	push(8);
</script>

<div class="alignment">
	<Console {commands} />
	<div class="elements">
		{#each stack as e (e[0])}
			<div
				animate:flip={{ duration: 500 }}
				in:fly={{ y: -300, duration: 500 }}
				out:fly={{ y: -300, duration: 500 }}
			>
				<Element value={e[1]} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.alignment {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.elements {
		display: flex;
		flex-direction: column-reverse;
		border-left: 10px solid white;
		border-right: 10px solid white;
        border-bottom: 10px solid white;
		min-width: 100px;
		min-height: 80vh;
        max-height: 80vh;
		margin-left: auto;
		margin-right: auto;
		padding: 20px;
        border-radius: 10px;
	}
</style>
