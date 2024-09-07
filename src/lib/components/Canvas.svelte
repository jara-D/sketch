<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let ready = false;
	let drawPoints: Array<{ x: number; y: number }> = [];
	export let drawingSave: Array<{ line: typeof drawPoints }> = [];

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			resizeCanvas();
			window.addEventListener('resize', resizeCanvas);
			if (ctx) {
				canvas.style.backgroundColor = 'black';
				ctx.imageSmoothingEnabled = true; // Enable antialiasing
				canvas.addEventListener('mousedown', () => {
					canvas.addEventListener('mousemove', addTodrawPoints);
				});
				canvas.addEventListener('mouseup', clearDrawPoints);
				canvas.addEventListener('mouseleave', clearDrawPoints);
				ready = true;
				load();
			} else {
				console.error('Failed to get 2D context');
			}
		} else {
			console.error('Canvas element not found');
		}
	});

	export function clear() {
		drawingSave = [];
		drawPoints = [];
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
	}

	function resizeCanvas() {
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			load();
		}
	}
	// save to local storage
	function save() {
		localStorage.setItem('drawingSave', JSON.stringify(drawingSave));
	}
	// load from local storage
	function load() {
		let loaded = localStorage.getItem('drawingSave');
		if (loaded) {
			drawingSave = JSON.parse(loaded);
			drawingSave.forEach((line) => {
				draw(line.line);
			});
		}
	}

	function clearDrawPoints() {
		canvas.removeEventListener('mousemove', addTodrawPoints);
		drawingSave.push({ line: drawPoints });
		save();
		drawPoints = [];
	}

	function addTodrawPoints(event: MouseEvent) {
		let x = event.pageX;
		let y = event.pageY;
		drawPoints.push({ x, y });
		draw(drawPoints);
	}

	function draw(points: Array<{ x: number; y: number }>) {
		if (!ready || !ctx || points.length < 2) return;
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i++) {
			let prevPoint = points[i - 1];
			let currentPoint = points[i];
			let controlPoint = {
				x: (prevPoint.x + currentPoint.x) / 2,
				y: (prevPoint.y + currentPoint.y) / 2
			};
			ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, controlPoint.x, controlPoint.y);
		}
		ctx.stroke();
	}
</script>

<canvas bind:this={canvas}></canvas>
