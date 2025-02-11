export const useAuthStore = defineStore('auth', () => {
	const config = useRuntimeConfig();

	const clientId = config.public.CLIENT_ID;
	const redirectUrl = config.public.REDIRECT_URL;
	const spotifyAuthBaseUrl = config.public.SPOTIFY_AUTH_BASE;
	const authorizationEndpoint = spotifyAuthBaseUrl + '/authorize';
	const tokenEndpoint = spotifyAuthBaseUrl + '/api/token';
	const scope = 'user-read-private user-read-email';

	const codeVerifierCookie = useCookie<string | null>('code_verifier', {
		default: () => null,
	});

	const refreshTokenCookie = useCookie<string | null>('refresh_token', {
		default: () => null,
		secure: true,
		sameSite: 'strict',
	});

	const accessToken = ref<string | null>(null);


	const isAuth = ref<boolean>(false);

	function setAuth(bool: boolean): void {
		isAuth.value = bool;
	}


	// const expireIn = ref<number>(0);

	// function accessExpired(): boolean {
	// 	return new Date().getTime() >= expireIn.value;
	// }

	// function saveExpireTimestamp(seconds: number): void {
	// 	expireIn.value = new Date().getTime() + (seconds * 1000) - (10 * 1000);
	// }

	function login() {
		redirectToSpotify();
	}

	function logout(): void {
		codeVerifierCookie.value = null;
		accessToken.value = null;
		refreshTokenCookie.value = null;
		// expireIn.value = 0;
		setAuth(false);
	}

	async function checkAuth(): Promise<any | void> {
		const route = useRoute();
		const code = route?.query?.code;

		if (code && route.path === '/login') {
			return getToken(code as string)
				.then(() => {
					return { path: '/', replace: true }
				})
		} else {
			return refreshToken();
		}
	}


	function redirectToSpotify() {
		codeVerifierCookie.value = generateRandomString(64);

		sha256(codeVerifierCookie.value).then((hashed) => {
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
		});
	}


	// Soptify API Calls
	async function getToken(code: string): Promise<any> {
		const body = new URLSearchParams({
			client_id: clientId,
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUrl,
			code_verifier: codeVerifierCookie.value,
		} as any);

		return $fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body,
		})
			.then((response: any) => {
				console.log('token from getToken', response);
				// saveExpireTimestamp(response.expires_in);
				accessToken.value = response.access_token;
				refreshTokenCookie.value = response.refresh_token;
				setAuth(true);

				useCookie('code_verifier').value = null;
			})
			.catch((e) => {
				console.log('e from getToken', e);
				setAuth(false);
				throw e;
			});
	}

	async function refreshToken(): Promise<any> {
		if (useCookie('refresh_token').value) {
			return $fetch(tokenEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					client_id: clientId,
					grant_type: 'refresh_token',
					refresh_token: useCookie('refresh_token').value,
				} as any),
			})
				.then((response: any) => {
					console.log('refreshToken()', response);
					// saveExpireTimestamp(response.expires_in);
					accessToken.value = response.access_token;
					if (response.refresh_token) {
						refreshTokenCookie.value = response.refresh_token;
					}
					setAuth(true);
				})
				.catch((e) => {
					console.log('Ошибка обновления токенов: ', e);
					setAuth(false);
					throw e;
				});
		} else {
			return Promise.reject('Вы не авторизованы')
		}
	}

	return {
		login,
		// getToken,
		logout,
		isAuth,
		refreshToken,
		accessToken,
		// accessExpired,
		checkAuth
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
