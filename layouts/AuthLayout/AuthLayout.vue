<template>
	<div>
		<header class="header">
			<Button icon="pi pi-arrow-left" size="small" rounded></Button>
			<div class="logo">LOGO</div>
		</header>
		<slot></slot>
	</div>
</template>

<script setup>
import './AuthLayout.scss';
</script>
