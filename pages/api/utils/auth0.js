import { initAuth0 } from '@auth0/nextjs-auth0'

export default initAuth0({
  baseURL: process.env.AUTH0_BASE_URL,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_SECRET,
  secret: process.env.COOKIE_SECRET,
  clockTolerance: 60,
  httpTimeout: 5000,
  authorizationParams: {
    scope: 'openid profile email',
  },
  routes: {
    callback: '/api/callback',
    postLogoutRedirect: '/',
  },
  session: {
    rollingDuration: 60 * 60 * 24,
    absoluteDuration: 60 * 60 * 24 * 7,
  },
})
