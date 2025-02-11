<template>
	<div class="user">
		{{ user }}
	</div>
	<div class="">JOPA</div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const user = computed(() => userStore.user)

</script>
