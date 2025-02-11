<template>
	<main class="log-in">
		<h1>Sign In</h1>
		<Button @click="authService.login">Log In</Button>
		<Button @click="authService.logout">Log Out</Button>
	</main>
</template>

<script setup lang="ts">
import '@/assets/scss/pages/login.scss';

// definePageMeta({
// 	layout: false,
// });

// setPageLayout('auth-layout');

// const userStore = useUserStore();

// function login() {
// 	userStore.login();
// }

const authService = useAuthStore();
</script>
