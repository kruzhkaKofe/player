import { z } from 'zod';

export const TokensSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	refresh_token: z.string().optional(),
	scope: z.string().includes('user-read-email').includes('user-read-private'),
	token_type: z.literal('Bearer'),
});

export type Tokens = z.infer<typeof TokensSchema>;

export const GetTokenBodySchema = z.object({
	client_id: z.string(),
	grant_type: z.literal('authorization_code'),
	code: z.string(),
	redirect_uri: z.string(),
	code_verifier: z.string(),
});

export const RefreshTokenBodySchema = z.object({
	client_id: z.string(),
	grant_type: z.literal('refresh_token'),
	refresh_token: z.string(),
});

export const someTokenBodySchema = GetTokenBodySchema.or(RefreshTokenBodySchema);

export type GetTokenBody = z.infer<typeof GetTokenBodySchema>;

export type RefreshTokenBody = z.infer<typeof RefreshTokenBodySchema>;
