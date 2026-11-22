import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../lib/supabase';
import { store } from '../stores/appStore';

import SplashView from '../views/SplashView.vue';
import AuthView from '../views/AuthView.vue';
import OnboardingView from '../views/OnboardingView.vue';
import HomeView from '../views/HomeView.vue';
import PracticeView from '../views/PracticeView.vue';
import TranslateView from '../views/TranslateView.vue';
import QuizView from '../views/QuizView.vue';
import ProfileView from '../views/ProfileView.vue';
import ClosingView from '../views/ClosingView.vue';

const routes = [
  { path: '/', name: 'splash', component: SplashView },
  { path: '/auth/:mode?', name: 'auth', component: AuthView },
  { path: '/onboarding/:step?', name: 'onboarding', component: OnboardingView },
  { path: '/home', name: 'home', component: HomeView, meta: { showNav: true } },
  { path: '/practice/:tab?', name: 'practice', component: PracticeView, meta: { showNav: true } },
  { path: '/translate', name: 'translate', component: TranslateView, meta: { showNav: true } },
  { path: '/quiz', name: 'quiz', component: QuizView, meta: { showNav: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { showNav: true } },
  { path: '/closing/:stage?', name: 'closing', component: ClosingView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user && !store.user.isLoggedIn) {
    store.syncGoogleUser(session.user);
  }

  if (store.user.isLoggedIn && (to.path === '/' || to.path.startsWith('/auth'))) {
    return store.user.onboardingCompleted ? '/home' : '/onboarding';
  }
});

export default router;