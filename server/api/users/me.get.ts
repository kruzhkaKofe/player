import { createCustomFetch } from '#imports';
import { meSchema } from '~/types/users.types';

export default defineEventHandler(async (event) => {
	const $customFetch = createCustomFetch(event);

	const data = await $customFetch('/me');

	const me = await meSchema.safeParseAsync(data);

	if (!me.success) throw createError(me.error);

	return me.data;
});
