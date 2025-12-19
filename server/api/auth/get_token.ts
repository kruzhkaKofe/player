import { GetTokenBody } from '@/types/auth.types';

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  const VERIFIER = 'code_verifier';

  const config = useRuntimeConfig();
  const query = getQuery(event);

  const body: GetTokenBody = {
    client_id: config.private.CLIENT_ID,
    grant_type: 'authorization_code',
    code: String(query.code),
    redirect_uri: config.public.REDIRECT_URL,
    code_verifier: getCookie(event, VERIFIER) || '',
  } as const;

  try {
    const response = await nitroApp.localCall({
      url: '/api/auth/token',
      method: 'POST',
      body,
    });

    const setCookieHeaders = response.headers['set-cookie'];

    if (setCookieHeaders && Array.isArray(setCookieHeaders) && setCookieHeaders.length) {
      setCookieHeaders.forEach((cookie) => {
        appendHeader(event, 'set-cookie', cookie);
      });
    }
    deleteCookie(event, VERIFIER);

    return response;
  } catch (e) {
    throw e;
  }
});
