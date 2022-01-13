<script lang="ts">
	import Console from '$lib/components/console.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import Element from '$lib/components/element.svelte';
	import { map } from 'lodash';

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	interface unique_element {
		element: any;
		id: number;
	}
	let e_index: number = 0;
	class Stack {
		values: Array<unique_element>;

		constructor() {
			this.values = [];
		}
		push(v: any, id: number | undefined = undefined): void {
			this.values.push({id: (id ? id : e_index), element: v })
			this.values = this.values
			e_index++;
		}
		pop(): any {
			const v = this.values.pop();
			this.values = this.values;
			return v.element;

		}
		pop_with_id(): unique_element {
			const v = this.values.pop();
			this.values = this.values;
			return v;
		}
		isEmpty(): boolean {
			return this.values.length === 0;
		}
		front(): any {
			return this.values[this.values.length - 1].element;
		}
		printStack(): Array<any> {
			return map(this.values, (v: unique_element) => {
				return v.element;
			});
		}
		length(): number {
			return this.values.length;
		}
	}

	let stack1 = new Stack();
	let stack2 = new Stack();
	const delay = 600
	async function enqueue(v: any) {
		if (typeof v === 'undefined') {
			return Error('Missing Attribute: v');
		}
		if (stack1.length() > 5) {
			return Error('Stack is full');
		}
		while (!stack1.isEmpty()) {
			const k: unique_element = stack1.pop_with_id();
			stack1 = stack1;
			stack2.push(k.element, k.id);
			stack2 = stack2;
			await sleep(delay);
		}
		stack1.push(v);
		stack1 = stack1;
		await sleep(delay);
		while (!stack2.isEmpty()) {
			const k: unique_element = stack2.pop_with_id();
			stack2 = stack2;
			stack1.push(k.element, k.id);
			stack1 = stack1;
			await sleep(delay);
		}
		return `Pushed element ${v} onto queue`;
	}
	async function dequeue() {
		if (stack1.isEmpty()) {
			return Error('Queue is empty');
		}
		const v = stack1.pop();
		stack1 = stack1;
		return v;
	}
	async function isEmpty() {
		return stack1.isEmpty();
	}
	async function front() {
		if (stack1.isEmpty()) {
			return Error('Queue is empty');
		}
		return stack1.front();
	}
	async function printQueue() {
		return stack1.printStack();
	}

	const commands = {
		enqueue: enqueue,
		dequeue: dequeue,
		isEmpty: isEmpty,
		front: front,
		printQueue: printQueue
	};
	stack1.push(5)
	stack1.push(9)
	stack1.push(2)
	stack1 = stack1

	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t, u) => `
					transform: translateY(${u * -400}%);
					opacity: ${t}
				`
			};
		}
	});
</script>

<div class="alignment">
	<Console {commands} />
	<div class="elements">
		{#each stack1.values as e (e.id)}
			<div
				in:receive={{ key: e.id, duration: 500 }}
				out:send={{ key: e.id, duration: 500 }}
			>
				<Element value={e.element} />
			</div>
		{/each}
	</div>
	<div class="elements">
		{#each stack2.values as e (e.id)}
			<div
				animate:flip={{ duration: 500 }}
				in:receive={{ key: e.id, duration: 500 }}
				out:send={{ key: e.id, duration: 500 }}
			>
				<Element value={e.element} />
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
