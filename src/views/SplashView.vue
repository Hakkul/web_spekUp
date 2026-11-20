<script setup>
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';
import AppLogo from '../components/AppLogo.vue';

const router = useRouter();

const startDemoMode = () => {
  Object.assign(store.user, {
    id: 'demo-guest',
    name: 'Sania (Demo)',
    email: 'demo@speakup.id',
    provider: 'demo',
    googleLinked: false,
    googleEmail: '',
    education: 'SMA',
    level: 'Pemula',
    streak: 3,
    newWords: 4,
    weeklyProgress: 65,
    micPermission: true,
    privacyAgreed: true,
    parentalAgreed: true
  });
  store.showToast('Masuk sebagai Mode Demo tanpa akun!', 'info');
  router.push('/home');
};
</script>

<template>
  <section class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b from-brand-50/60 via-white to-mint-50/40">
    <div class="flex justify-end">
      <span class="px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-brand-600 shadow-sm">
        Versi Pelajar • v1.0
      </span>
    </div>

    <div class="flex flex-col items-center text-center my-auto py-8 max-w-md mx-auto w-full">
      <AppLogo size="w-24 h-24 mb-6" />
      <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Speak Up</h1>
      <p class="text-sm font-semibold text-brand-600 tracking-wide uppercase mt-1">Voice note Coach</p>

      <div class="mt-8 bg-white/90 backdrop-blur border border-slate-200/80 rounded-3xl p-6 shadow-sm w-full">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-50 text-mint-600 text-xs font-semibold mb-2.5">
          <span class="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></span>
          Ruang aman untuk bicara
        </div>
        <p class="text-base sm:text-lg font-bold text-slate-800 leading-snug">
          "Berani bicara, tumbuh percaya diri"
        </p>
        <p class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Latihan speaking bahasa Inggris tanpa takut salah dengan umpan balik pelafalan instan.
        </p>
      </div>
    </div>

    <div class="max-w-md mx-auto w-full pb-2 space-y-2.5">
      <button @click="router.push('/auth/login')" class="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2">
        <span>Lanjut</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <button @click="startDemoMode" class="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2">
        <span>🚀 Coba Mode Demo (Tanpa Akun)</span>
      </button>
    </div>
  </section>
</template>