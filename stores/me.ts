import { defaultMe } from '~/types/users.types';
import type { Me } from '~/types/users.types';

export const useMeStore = defineStore('me', () => {
	const { $api } = useNuxtApp();

	const me = ref<Me>(defaultMe);

	function setMe(data: Me): void {
		me.value = data;
	}

	async function getMe(): Promise<void> {
		try {
			const data = await $api('/api/users/me');
			setMe(data);
		} catch (e) {
			console.log('Get me error: ', e);
		}
	}

	return {
		me,
		getMe,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMeStore, import.meta.hot));
}
