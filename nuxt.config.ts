// https://nuxt.com/docs/api/configuration/nuxt-config

import primePreset from './primePreset.js';

export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: {
		enabled: true,
		timeline: {
			enabled: true,
		},
	},
	css: ['@/assets/scss/main.scss'],
	modules: ['@primevue/nuxt-module', '@pinia/nuxt'],
	primevue: {
		options: {
			theme: {
				preset: primePreset,
				options: {
					cssLayer: {
						name: 'primevue',
						order: 'base, primevue',
					},
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			CLIENT_ID: process.env.CLIENT_ID,
			REDIRECT_URL: process.env.REDIRECT_URL,
			SPOTIFY_AUTH_BASE: process.env.SPOTIFY_AUTH_BASE,
		},
	},
});
