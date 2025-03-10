import { getTokens } from './token.post';

export default defineEventHandler(async (event) => {
	const VERIFIER = 'code_verifier';

	const config = useRuntimeConfig();
	const query = getQuery(event);

	const body = {
		client_id: config.private.CLIENT_ID,
		grant_type: 'authorization_code',
		code: query.code as string,
		redirect_uri: config.public.REDIRECT_URL,
		code_verifier: getCookie(event, VERIFIER) || '',
	} as const;

	try {
		await getTokens({ event, body });

		deleteCookie(event, VERIFIER);
		return true;
	} catch (e) {
		throw e;
	}
});
