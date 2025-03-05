import { z } from 'zod';

export const userSchema = z.object({
	display_name: z.string(),
	external_urls: z.object({
		spotify: z.string(),
	}),
	followers: z.object({
		href: z.string().nullable(),
		total: z.number(),
	}),
	href: z.string(),
	id: z.string(),
	images: z.array(
		z.object({
			url: z.string(),
			height: z.number().nullable(),
			width: z.number().nullable(),
		})
	),
	type: z.literal('user'),
	uri: z.string(),
});

export const meSchema = userSchema
	.extend({
		country: z.string(),
		email: z.string(),
		explicit_content: z
			.object({
				filter_enabled: z.boolean(),
				filter_locked: z.boolean(),
			})
			.default({
				filter_enabled: false,
				filter_locked: false,
			}),
		product: z.string(),
	})
	.default({
		display_name: '',
		external_urls: {
			spotify: '',
		},
		followers: {
			href: null,
			total: 0,
		},
		href: '',
		id: '',
		images: [],
		type: 'user',
		uri: '',
		country: '',
		email: '',
		explicit_content: {
			filter_enabled: false,
			filter_locked: false,
		},
		product: '',
	});

export const defaultMe = meSchema.parse(undefined);

export type User = z.infer<typeof userSchema>;

export type Me = z.infer<typeof meSchema>;
