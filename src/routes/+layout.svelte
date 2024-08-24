<script lang="ts">
	import type { LayoutData } from './$types';

	export const data: LayoutData = {};
</script>

<main>
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
