<template>
	<div class="">
		<Button as="router-link" label="На страницу логина" to="/login" />
		<Button @click="authService.logout" label="logout"></Button>

		<!-- <Button @click="test" label="Get Me"></Button> -->
		<!-- <Button @click="refresh" label="Refresh token"></Button> -->

	</div>
</template>

<script setup lang="ts">
const authService = useAuthStore();
// const { $http } = useNuxtApp();

// function getUserData() {
// 	// return useAsyncData(() =>
// 	return $http('https://api.spotify.com/v1/me', {
// 		method: 'GET',
// 	})
// 	// );
// }

// function test() {
// 	getUserData().then((res) => {
// 		console.log('ressss', res);
// if (data.value) {
// 	console.log('data', data.value);
// }
// if (error.value) {
// 	console.log('error', error.value);
// }
// });
// .catch((e) => {
// 	console.log('e from handler', e);
// });
// }

// function refresh(): void {
// 	authService.refreshToken();
// }
</script>
