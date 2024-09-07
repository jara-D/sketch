<script lang="ts">
	import Canvas from '$lib/components/Canvas.svelte';
	let CanvasComp: Canvas;
</script>

<Canvas bind:this={CanvasComp} />

<div class="container">
	<ul>
		<button on:click={CanvasComp.clear} class="button" tabindex="0"></button>
	</ul>
</div>

<style>
	.container {
		position: absolute;
		bottom: 1%;
		left: 50%;
		display: flex;
		z-index: 100;
		background-color: aliceblue;
		padding: 10px;
		border-radius: 10%;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style-type: none;
		display: flex;
		gap: 10px;
	}
	.button {
		background-image: url('$lib/icons/clear.svg');
		background-size: contain;
		background-repeat: no-repeat;
		border: 2px solid rgb(76, 76, 76);
		border-radius: 10%;
		background-color: rgba(0, 0, 0, 0);
		width: 60px;
		height: 60px;
	}
	.button:hover,
	.button:active {
		background-color: rgba(0, 0, 0, 0.3);
	}
</style>
