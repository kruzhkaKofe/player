import { TokensSchema, Tokens, someTokenBodySchema } from '~/types/auth.types';
import type { H3Event } from 'h3';

const config = useRuntimeConfig();

function saveTokens(event: H3Event, tokens: Tokens) {
	const { access_token, refresh_token, expires_in } = tokens;

	setCookie(event, 'access_token', access_token, {
		httpOnly: true,
		secure: config.public.ENV === 'production',
		maxAge: expires_in, // 1 hour
	});

	if (refresh_token) {
		setCookie(event, 'refresh_token', refresh_token, {
			httpOnly: true,
			secure: config.public.ENV === 'production',
			maxAge: expires_in * 24 * 30, // 30 days
		});
	}
}

export default defineEventHandler(async (event) => {
	const tokenEndpoint = config.public.SPOTIFY_ACCOUNTS_URL + '/api/token';

	const body = someTokenBodySchema.safeParse(await readBody(event));

	if (!body.success) throw createError(body.error);

	const data = await $fetch(tokenEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(body.data),
	});

	const tokens = TokensSchema.safeParse(data);

	if (!tokens.success) throw createError(tokens.error);

	saveTokens(event, tokens.data);

	return tokens.data;
});
