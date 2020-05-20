import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@okta/okta-vue'

import Home from '../views/Home.vue'
import Replay from '../views/Replay.vue'
import Chess from '../components/Chessboard.vue'

Vue.use(Auth, {
  issuer: 'https://dev-232123.okta.com/oauth2/default',
  clientId: '0oaanm545S538wrmZ4x6',
  redirectUri: window.location.origin + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
})

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/play',
      name: 'chess',
      component: Chess
    },
    {
      path: '/replay',
      name: 'replay',
      component: Replay
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router