import type { H3Event } from 'h3';

const config = useRuntimeConfig();

export const createCustomFetch = (event: H3Event) => {
	const nitroApp = useNitroApp();
	const opts = {
		baseURL: config.public.SPOTIFY_BASE_URL,

		onRequest({ request, options }: any) {
			const access_token = getCookie(event, 'access_token');

			options.headers.set('Authorization', `Bearer ${access_token}`);
		},

		async onResponseError({ request, response, options }: any) {
			if (response.status === 401) {
				const res = await nitroApp.localCall({
					url: '/api/auth/refresh_token',
					headers: {
						...event.node.req.headers,
						'content-type': 'application/json',
					},
					method: 'POST',
					body: {
						force: true,
					},
					event,
				});

				const setCookieHeaders = res.headers['set-cookie'];

				if (setCookieHeaders && Array.isArray(setCookieHeaders) && setCookieHeaders.length) {
					setCookieHeaders.forEach((cookie) => {
						appendHeader(event, 'set-cookie', cookie);
					});
				}

				TODO: 'solve how refetch when fail with 401';
				throw createError({
					// throw 408 instead of 401 for refetch
					statusCode: 408,
				});
			}
		},
	};

	return $fetch.create(opts);
};
