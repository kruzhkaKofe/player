import { z } from 'zod';

export const TokensSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	refresh_token: z.string().optional(),
	scope: z.string().includes('user-read-email').includes('user-read-private'),
	token_type: z.literal('Bearer'),
});

export type Tokens = z.infer<typeof TokensSchema>;

export type GetTokenBody = {
	client_id: string;
	grant_type: 'authorization_code';
	code: string;
	redirect_uri: string;
	code_verifier: string;
};

export type RefreshTokenBody = {
	client_id: string;
	grant_type: string;
	refresh_token: string;
};
