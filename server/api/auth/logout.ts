export default defineEventHandler((event) => {
	const REFRESH = 'refresh_token';
	const ACCESS = 'access_token';

	deleteCookie(event, ACCESS);
	deleteCookie(event, REFRESH);

	return true;
});
