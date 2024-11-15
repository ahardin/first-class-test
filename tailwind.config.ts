import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				matrix: '#0f0'
			}
		}
	},

	plugins: [forms]
} satisfies Config;
