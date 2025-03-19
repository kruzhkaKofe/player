export default defineNuxtPlugin(() => {
	const api = $fetch.create({
		async onResponseError({ request, response, options }: any) {
			if (response.status === 401 && !options.isRetried) {
				options.isRetried = true;
				await $fetch('/api/auth/refresh_token', {
					method: 'POST',
					body: {
						force: true,
					},
				});
				await $fetch(request, options);
			}
		},
	});

	return {
		provide: {
			api,
		},
	};
});
