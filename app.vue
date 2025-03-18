<template>
	<NuxtLayout>
		{{ authService.isAuth ? 'Авторизован' : 'Не авторизован' }}
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
const authService = useAuthStore();
const me = useMeStore();

onMounted(async () => {
	try {
		const redirectTo = await authService.checkAuth();
		if (redirectTo) navigateTo(redirectTo);
		me.getMe();
	} catch (e) {
		navigateTo('/login');
	}
});
</script>
