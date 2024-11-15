<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import rickroll from '$lib/img/rickroll-roll.gif';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let preloadedImage: HTMLImageElement;

	const chars =
		'ABCXYZRWXアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
	const size = 18;
	let intro = true;

	// Array to track character positions
	let drops: number[] = [];
	const start = new Date().getTime();

	onMount(() => {
		preloadedImage = new Image();
		preloadedImage.src = rickroll;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d')!;

		// Initialize drops
		const columns = Math.floor(canvas.width / size); // character width
		for (let i = 0; i < columns; i++) {
			drops[i] = Math.random() * -100;
		}

		animate();

		try {
			const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

			supabase.from('tests').insert({ event: 'load' }).select().then((res) => {
				console.log(res);
			});
		} catch (error) {
			console.error(error);
		}
	});

	function animate() {
		const currentTime = new Date().getTime();
		const elapsedTime = currentTime - start;

		if (elapsedTime > 8000) {
			setTimeout(() => {
				intro = false;
			}, 1200);

			return;
		}

		// Reduce opacity for longer trails
		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#0F0'; // Matrix green
		ctx.font = `${size}px monospace`;

		// Draw characters
		for (let i = 0; i < drops.length; i++) {
			// Random character from chars string
			const char = chars[Math.floor(Math.random() * chars.length)];

			ctx.fillText(char, i * size, drops[i] * size);

			// Reset drop when it reaches bottom
			if (drops[i] * size > canvas.height) {
				drops[i] = 0;
			}

			drops[i] += 1; // Slow down the falling speed
		}

		setTimeout(() => {
			requestAnimationFrame(animate);
		}, 40);
	}

	function click() {
		document.body.style.background = 'black';
		document.body.innerHTML = `
				<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
					<img src="${preloadedImage.src}" 
						 style="max-width: 100%; max-height: 100%; object-fit: contain;">
				</div>`;

		try {
			const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

			supabase.from('tests').insert({ event: 'click' }).select().then((res) => {
				console.log(res);
			});
		} catch (error) {
			console.error(error);
		}
	}
</script>

{#if intro}
	<canvas
		transition:fly={{ y: 2000, duration: 800, easing: cubicOut }}
		bind:this={canvas}
		style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black;"
	>
	</canvas>
{:else}
	<div class="text-center">
		<h1 class="mt-28 text-xl">Thanks for your help!</h1>

		<button type="button" class="bg-matrix mt-10 p-3 text-black" on:click={click}
			>Don't touch this button!</button
		>
	</div>
{/if}
