export const useUserStore = defineStore('user', () => {
	const { $http } = useNuxtApp();

	const user = ref<any>(null);

	function setUser(userData: any): void {
		user.value = userData;
		console.log(user.value)
	}

	function getUser(): void {
		$http('https://api.spotify.com/v1/me', {
			method: 'GET',
		})
			.then((response) => {
				console.log('user', response)
				if (response) {
					setUser(response);
				}
			})
	}

	return {
		user,
		getUser
		// setUser,
	};
});
