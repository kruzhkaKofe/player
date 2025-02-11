import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(to => {
	// if (import.meta.server) return;

	const authService = useAuthStore();

	// if (!authService.isAuth) {
	// 	abortNavigation();
	// 	if (to.path !== '/login') {
	// 		return navigateTo('/login');
	// 	}
	// }

	if (authService.isAuth) {
		if (to.path === '/login') {
			return navigateTo('/', { replace: true })
		}
	}





	// const code = to?.query?.code;


	// Promise.resolve()
	// 	.then(() => {
	// 		if (authService.isAuth && to.path === '/login') {
	// 			return Promise.resolve();
	// 		} else {
	// 			if (code) {
	// 				return authService.getToken(code as string)
	// 			}
	// 		}
	// 	})
	// 	.then(() => {
	// 		// useCookie('code_verifier').value = null;
	// 		navigateTo('/', { replace: true });
	// 	})
	// 	.catch(() => {
	// 		navigateTo('/login', { replace: true });
	// 	})
});
