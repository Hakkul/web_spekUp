import { createRouter, createWebHistory } from 'vue-router';

import SplashView from '../views/SplashView.vue';
import AuthView from '../views/AuthView.vue';
import OnboardingView from '../views/OnboardingView.vue';
import HomeView from '../views/HomeView.vue';
import PracticeView from '../views/PracticeView.vue';
import TranslateView from '../views/TranslateView.vue';
import QuizView from '../views/QuizView.vue';
import ProfileView from '../views/ProfileView.vue';
import ClosingView from '../views/ClosingView.vue';
import { store } from '../stores/appStore';

const routes = [
  { path: '/', name: 'splash', component: SplashView },
  { path: '/auth/:mode?', name: 'auth', component: AuthView }, // login, register, forgot
  { path: '/onboarding/:step?', name: 'onboarding', component: OnboardingView }, // consent, level
  { path: '/home', name: 'home', component: HomeView, meta: { showNav: true } },
  { path: '/practice/:tab?', name: 'practice', component: PracticeView, meta: { showNav: true } }, // record, result
  { path: '/translate', name: 'translate', component: TranslateView, meta: { showNav: true } },
  { path: '/quiz', name: 'quiz', component: QuizView, meta: { showNav: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { showNav: true } },
  { path: '/closing/:stage?', name: 'closing', component: ClosingView }, // summary, goodbye
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

// router.beforeEach((to) => {
//   const hasOAuthHash = typeof window !== 'undefined' && window.location.hash.includes('access_token');
//   const isAuthenticated = store.user.isLoggedIn || hasOAuthHash;

//   // Jika sudah login Google atau sedang membawa token dari Google, cegah balik ke Splash (/) atau Auth (/auth/...)
//   if (isAuthenticated && (to.path === '/' || to.path.startsWith('/auth'))) {
//     return store.user.onboardingCompleted ? '/home' : '/onboarding';
//   }
// });

router.beforeEach((to) => {
  const hasOAuthHash = typeof window !== 'undefined' && window.location.hash.includes('access_token');

  // Biarkan Supabase memproses #access_token dulu sebelum router memindahkan halaman
  if (hasOAuthHash) {
    return true;
  }

  // Jika sudah login Google, cegah balik ke Splash (/) atau Auth (/auth/...)
  if (store.user.isLoggedIn && (to.path === '/' || to.path.startsWith('/auth'))) {
    return store.user.onboardingCompleted ? '/home' : '/onboarding';
  }
});

export default router;