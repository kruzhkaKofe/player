export const useAuthStore = defineStore('auth', () => {
	const config = useRuntimeConfig();

	const VERIFIER = 'code_verifier';

	const redirectUrl = config.public.REDIRECT_URL;
	const authorizationEndpoint = config.public.SPOTIFY_ACCOUNTS_URL + '/authorize';

	const scope = `
		user-read-private 
		user-read-email 
		user-modify-playback-state 
		user-read-playback-state 
		streaming
	`;

	let clientId: string = '';

	useFetch('/api/auth/client').then(({ data }) => {
		if (data.value?.id) clientId = data.value.id;
	});

	const codeVerifierCookie = useCookie<string | null>(VERIFIER, {
		default: () => null,
	});

	// Auth state
	const isAuth = ref<boolean>(false);

	function setAuth(bool: boolean): void {
		isAuth.value = bool;
	}

	// State action
	function login() {
		redirectToSpotify();
	}

	async function logout(): Promise<void> {
		await $fetch('/api/auth/logout');
		codeVerifierCookie.value = null;
		setAuth(false);
		navigateTo('/login');
	}

	async function checkAuth(): Promise<{ path: '/'; replace: true } | void> {
		const route = useRoute();
		const code = route?.query?.code;

		if (code && route.path === '/login') {
			await getToken(code as string);
			return { path: '/', replace: true };
		}

		return refreshToken();
	}

	// Soptify API Calls
	async function redirectToSpotify() {
		codeVerifierCookie.value = generateRandomString(64);

		const hashed = await sha256(codeVerifierCookie.value);

		const authUrl = new URL(authorizationEndpoint);

		const params = {
			response_type: 'code',
			client_id: clientId,
			scope,
			code_challenge_method: 'S256',
			code_challenge: base64Encode(hashed),
			redirect_uri: redirectUrl,
		};

		authUrl.search = new URLSearchParams(params).toString();

		navigateTo(authUrl.toString(), {
			external: true,
		});
	}

	async function getToken(code: string): Promise<void> {
		try {
			await $fetch('/api/auth/get_token', {
				query: {
					code,
				},
			});

			setAuth(true);
		} catch (e) {
			setAuth(false);
			throw e;
		}
	}

	async function refreshToken(): Promise<void> {
		try {
			await $fetch('/api/auth/refresh_token', {
				method: 'POST',
			});
			setAuth(true);
		} catch (e) {
			setAuth(false);
			throw e;
		}
	}

	return {
		login,
		logout,
		isAuth,
		checkAuth,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
