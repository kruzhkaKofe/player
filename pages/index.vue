<template>
	<div class="">
		<Button as="router-link" label="На страницу логина" to="/login" />
		<Button @click="authService.logout" label="logout"></Button>
	</div>
</template>

<script setup lang="ts">
const authService = useAuthStore();

</script>
