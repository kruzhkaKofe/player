export const useAuthStore = defineStore('auth', () => {
	const config = useRuntimeConfig();

	const EXPIRE_KEY = 'expire';
	const VERIFIER = 'code_verifier';
	const REFRESH = 'refresh_token';
	const ACCESS = 'access_token';

	const redirectUrl = config.public.REDIRECT_URL;
	const spotifyAuthBaseUrl = config.public.SPOTIFY_ACCOUNTS_URL;
	const authorizationEndpoint = spotifyAuthBaseUrl + '/authorize';

	let clientId: string = '';

	useFetch('/api/auth/client').then(({ data }) => {
		if (data.value?.id) clientId = data.value.id;
	});

	const codeVerifierCookie = useCookie<string | null>(VERIFIER, {
		default: () => null,
	});

	const refreshTokenCookie = useCookie<string | null>(REFRESH, {
		default: () => null,
		secure: true,
		sameSite: 'strict',
	});

	const accessToken = useCookie<string | null>(ACCESS, {
		default: () => null,
		secure: true,
		sameSite: 'strict',
	});

	// Auth state
	const isAuth = ref<boolean>(false);

	function setAuth(bool: boolean): void {
		isAuth.value = bool;
	}

	// Token Expire
	const expireTime = ref<number>(0);

	if (import.meta.client) {
		expireTime.value = JSON.parse(localStorage.getItem(EXPIRE_KEY) || '0');
	}

	function accessExpired(): boolean {
		return new Date().getTime() >= expireTime.value;
	}

	function saveExpireTimestamp(seconds: number): void {
		expireTime.value = new Date().getTime() + seconds * 1000 - 10 * 1000;

		if (import.meta.client) {
			localStorage.setItem(EXPIRE_KEY, JSON.stringify(expireTime.value));
		}
	}

	// State action
	function login() {
		redirectToSpotify();
	}

	function logout(): void {
		clearState();
		navigateTo('/login');
	}

	async function checkAuth(): Promise<any | void> {
		const route = useRoute();
		const code = route?.query?.code;

		if (code && route.path === '/login') {
			return getToken(code as string).then(() => {
				return { path: '/', replace: true };
			});
		}

		if (useCookie(REFRESH).value && useCookie(ACCESS).value) {
			return accessExpired() ? refreshToken() : Promise.resolve().then(() => setAuth(true));
		}

		return Promise.reject('Пользователь не авторизован');
	}

	function saveTokens(authServerRes: any): void {
		saveExpireTimestamp(authServerRes.expires_in);
		accessToken.value = authServerRes.access_token;
		if (authServerRes.refresh_token) {
			refreshTokenCookie.value = authServerRes.refresh_token;
		}
	}

	function clearState() {
		codeVerifierCookie.value = null;
		accessToken.value = null;
		refreshTokenCookie.value = null;
		expireTime.value = 0;
		localStorage.removeItem(EXPIRE_KEY);
		setAuth(false);
	}

	// Soptify API Calls
	function redirectToSpotify() {
		codeVerifierCookie.value = generateRandomString(64);

		sha256(codeVerifierCookie.value).then((hashed) => {
			const authUrl = new URL(authorizationEndpoint);

			const params = {
				response_type: 'code',
				client_id: clientId,
				scope: 'user-read-private user-read-email',
				code_challenge_method: 'S256',
				code_challenge: base64Encode(hashed),
				redirect_uri: redirectUrl,
			};

			authUrl.search = new URLSearchParams(params).toString();

			navigateTo(authUrl.toString(), {
				external: true,
			});
		});
	}

	async function getToken(code: string): Promise<any> {
		const body = new URLSearchParams({
			client_id: clientId,
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUrl,
			code_verifier: codeVerifierCookie.value || '',
		});

		return $fetch('/api/auth/token', {
			method: 'POST',
			body,
		})
			.then((response: any) => {
				saveTokens(response);
				setAuth(true);
				useCookie(VERIFIER).value = null;
			})
			.catch((e) => {
				setAuth(false);
				throw e;
			});
	}

	async function refreshToken(): Promise<any> {
		const refreshToken = useCookie(REFRESH).value;

		if (!refreshToken) return Promise.reject('User not authorised!');

		const body = new URLSearchParams({
			client_id: clientId,
			grant_type: REFRESH,
			refresh_token: refreshToken,
		});

		return $fetch('/api/auth/token', {
			method: 'POST',
			body,
		})
			.then((response: any) => {
				saveTokens(response);
				setAuth(true);
			})
			.catch((e) => {
				setAuth(false);
				throw e;
			});
	}

	return {
		login,
		getToken,
		logout,
		isAuth,
		refreshToken,
		accessToken,
		checkAuth,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
