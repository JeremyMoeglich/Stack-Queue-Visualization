<script lang="ts">
	import type { JSONString } from '@sveltejs/kit/types/helper';
	function stringify(v: any): string {
		if (typeof v === 'number') {
			v = Math.round((v + Number.EPSILON) * 100) / 100;
		} else if (typeof v === 'string') {
			return v;
		}
		return JSON.stringify(v);
	}
	export let value: JSONString;
</script>

<div class="element">
	<p>{stringify(value)}</p>
</div>

<style lang="scss">
	.element {
		display: flex;
		padding: 5px;
		justify-content: center;
		align-items: center;
		margin: 10px;
		background-color: var(--lt-color-gray-700);
		width: 60px;
		height: 60px;
		border-radius: 10px;
		border: 3px solid green;
		color: white;
		overflow: hidden;
		text-align: center;
		& > p {
			margin: 0px;
		}
	}
</style>
