<template>
	<NuxtLayout>
		{{ authService.isAuth ? 'Авторизован' : 'Не авторизован' }}
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
const authService = useAuthStore();
const userService = useUserStore();

onMounted(() => {
	console.log('wefwef')
	authService.checkAuth()
		.then(redirectTo => {
			if (redirectTo) {
				navigateTo(redirectTo);
			}
			userService.getUser();
		})
		.catch(() => {
			navigateTo('/login');
		})
});
</script>
