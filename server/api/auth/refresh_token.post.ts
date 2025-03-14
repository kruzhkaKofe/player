export default defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();

	const REFRESH = 'refresh_token';
	const ACCESS = 'access_token';

	const config = useRuntimeConfig();

	const reqBody = await readBody(event);

	const refresh_token = getCookie(event, REFRESH);

	if (!refresh_token) {
		throw createError({
			statusCode: 401,
			message: 'No refresh token',
		});
	}

	if (!reqBody || !reqBody.force) {
		const access_token = getCookie(event, ACCESS);

		if (access_token) return true;
	}

	const body = {
		client_id: config.private.CLIENT_ID,
		grant_type: REFRESH,
		refresh_token,
	} as const;

	try {
		const responce = await nitroApp.localCall({
			url: '/api/auth/token',
			method: 'POST',
			body,
			event,
		});

		const setCookieHeaders = responce.headers['set-cookie'];

		if (setCookieHeaders && Array.isArray(setCookieHeaders) && setCookieHeaders.length) {
			setCookieHeaders.forEach((cookie) => {
				appendHeader(event, 'set-cookie', cookie);
			});
		}

		return responce;
	} catch (e) {
		throw e;
	}
});
