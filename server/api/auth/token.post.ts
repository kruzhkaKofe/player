export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const tokenEndpoint = config.public.SPOTIFY_ACCOUNTS_URL + '/api/token';

	const body = new URLSearchParams(await readBody(event));

	if (!body || body.toString().length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Body is missing',
		});
	}

	return $fetch(tokenEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body,
	})
		.then((res) => res)
		.catch((error) => {
			throw error;
		});
});
