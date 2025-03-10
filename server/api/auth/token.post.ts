import { TokensSchema, Tokens, GetTokenBody, RefreshTokenBody } from '~/types/auth.types';
import type { H3Event } from 'h3';

const config = useRuntimeConfig();

function saveTokens(event: H3Event, tokens: Tokens) {
	console.log('new Tokens', tokens);

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
			maxAge: expires_in * 24 * 30, // 1 month
		});
	}
}

export async function getTokens(context: { event: H3Event; body: GetTokenBody | RefreshTokenBody }) {
	const { event, body } = context;

	const tokenEndpoint = config.public.SPOTIFY_ACCOUNTS_URL + '/api/token';

	const data = await $fetch(tokenEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(body),
	});

	const tokens = await TokensSchema.safeParseAsync(data);

	if (!tokens.success) throw createError(tokens.error);

	saveTokens(event, tokens.data);

	return true;
}
