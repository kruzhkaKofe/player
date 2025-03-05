import { z } from 'zod';

export const tokensSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	refresh_token: z.string().optional(),
	scope: z.string().includes('user-read-email').includes('user-read-private'),
	token_type: z.literal('Bearer'),
});

export type Token = z.infer<typeof tokensSchema>;
