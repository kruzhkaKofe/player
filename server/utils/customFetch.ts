import type { H3Event } from 'h3';

const config = useRuntimeConfig();

export const createCustomFetch = (event: H3Event) => {
	return $fetch.create({
		baseURL: config.public.SPOTIFY_BASE_URL,

		onRequest({ request, options }: any) {
			const access_token = getCookie(event, 'access_token');

			if (!access_token) {
				throw createError({
					statusCode: 401,
					message: 'No access token',
				});
			}

			options.headers.set('Authorization', `Bearer ${access_token}`);
		},
	});
};
