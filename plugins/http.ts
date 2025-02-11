export default defineNuxtPlugin((nuxtApp) => {
	const authService = useAuthStore();

	const opts = {
		async onRequest({ request, options }: any) {
			if (authService.isAuth && authService.accessToken) {
				options.headers.set('Authorization', `Bearer ${authService.accessToken}`);
			}
		},
		async onResponseError({ request, response, options }: any) {
			// console.log('[request]', request);
			// console.log('[response]', response);
			// console.log('[options]', options);

			if (response.status === 401 && !options.isRetry) {
				options.isRetry = true;
				authService.refreshToken()
					.then(() => {
						$fetch(request, options);
					})
					.catch((e) => {
						console.log("Ошибка авторизации", e);
					});
			}
		},
	};

	return {
		provide: {
			http: $fetch.create(opts),
		},
	};
});
