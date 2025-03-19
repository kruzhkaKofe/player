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
			ENV: process.env.ENV,
			REDIRECT_URL: process.env.REDIRECT_URL,
			SPOTIFY_ACCOUNTS_URL: process.env.SPOTIFY_ACCOUNTS_URL,
			SPOTIFY_BASE_URL: process.env.SPOTIFY_BASE_URL,
		},
		private: {
			CLIENT_ID: process.env.CLIENT_ID,
		},
	},
	app: {
		head: {
			title: 'Nuxt Player',
		},
	},
});
