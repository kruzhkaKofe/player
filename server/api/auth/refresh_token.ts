import { getTokens } from './token.post';

export default defineEventHandler(async (event) => {
	const REFRESH = 'refresh_token';
	const ACCESS = 'access_token';

	const config = useRuntimeConfig();

	const refresh_token = getCookie(event, REFRESH);

	if (!refresh_token) {
		throw createError({
			statusCode: 401,
			message: 'Not Jopa',
		});
	}

	const access_token = getCookie(event, ACCESS);

	if (access_token) return true;

	const body = {
		client_id: config.private.CLIENT_ID,
		grant_type: REFRESH,
		refresh_token,
	} as const;

	return await getTokens({ event, body });
});
