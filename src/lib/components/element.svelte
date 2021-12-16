<script lang="ts">
	function stringify(v: any): string {
		if (typeof v === 'number') {
			v = Math.round((v + Number.EPSILON) * 100) / 100;
		}
		return v.toString();
	}
	export let value;
</script>

<div class="element">
	<p>{value}</p>
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
