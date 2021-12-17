<script lang="ts">
	import * as parser from '$lib/parser';
	import * as animateScroll from 'svelte-scrollto';
	import { element, prevent_default } from 'svelte/internal';

	let command_value = '';
	let console_log = ['Type help() for more info'];
	let command_history = [];

	export let commands: { [key: string]: Function };

	function help() {
		return Object.keys(commands).join(', ')
	}

	function command_execution() {
		commands.help = help
		const returned_value = parser.parse_code_line(command_value, commands);
		console_log = [...console_log, `> ${command_value}`];
		if (command_history.at(-1) !== command_value) {
			command_history.push(command_value)
		}
		if (typeof returned_value !== 'undefined') {
			console_log = [...console_log, `${returned_value}`];
		}
		command_value = '';
		const console_obj = document.getElementById('console');
		console.log(console_obj.scrollHeight)
		console_obj.scrollTop = console_obj.scrollHeight;
	}
	let history_index = 0
	function keydown_input(event) {
		if (event.key === 'Enter') {
			command_execution();
			history_index = 0
		}
		else if (event.key === 'ArrowUp') {
			event.preventDefault()
			if (history_index < command_history.length) {
				history_index++
			}
			command_value = command_history.at(-history_index)
		}
		else if (event.key === 'ArrowDown') {
			event.preventDefault()
			if (history_index > 1) {
				history_index--
			}
			command_value = command_history.at(-history_index)
		}
	}
</script>

<div class="outer">
	<div
		id="console"
		class="console"
		on:click={() => {
			document.getElementById('input').focus();
		}}
	>
		<p>Console</p>
		{#each console_log as value}
			<p>{`${value}`}</p>
		{/each}
		> <input id="input" type="text" bind:value={command_value} on:keydown={keydown_input}/>
	</div>

	<div>
		<button on:click={command_execution}>Execute</button>
	</div>
</div>

<style lang="scss">
	* {
		font-size: 15px;
	}
	.outer {
		height: 60vh;
		max-height: 60vh;
	}
	.console {
		background-color: var(--lt-color-gray-700);
		color: white;
		padding: 10px;
		margin: 10px;
		border-width: 3px;
		border-color: green;
		border-radius: 5px;
		border-style: solid;
		max-height: calc(60vh - 160px);
		overflow-y: auto;
		padding-bottom: 50px;
	}
	p {
		margin: 0px;
	}
	input {
		background-color: transparent;
		outline: none;
		width: max-content;
		min-width: 40vw;
		border-width: 0px;
		color: white;
		width: 90%;
		padding: 0px;
	}
</style>
