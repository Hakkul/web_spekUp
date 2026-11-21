<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';
import AppLogo from '../components/AppLogo.vue';

const router = useRouter();
const showDemoModal = ref(false);
const demoName = ref('');
const demoEducation = ref('SMA');
const demoLevel = ref('Pemula');

const openDemoModal = () => {
  demoName.value = '';
  demoEducation.value = 'SMA';
  demoLevel.value = 'Pemula';
  showDemoModal.value = true;
};

const confirmDemoMode = () => {
  const finalName = demoName.value.trim() || 'Pelajar';
  Object.assign(store.user, {
    id: 'demo-guest',
    name: finalName,
    email: 'demo@speakup.id',
    provider: 'demo',
    googleLinked: false,
    googleEmail: '',
    education: demoEducation.value,
    level: demoLevel.value,
    streak: 0,
    newWords: 0,
    weeklyProgress: 0,
    micPermission: true,
    privacyAgreed: true,
    parentalAgreed: true
  });
  store.selectedTopicIndex = 0;
  showDemoModal.value = false;
  store.showToast(`Halo ${finalName}! Mode Demo (${demoEducation.value} • ${demoLevel.value})`, 'info');
  router.push('/home');
};
</script>

<template>
  <section class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b from-brand-50/60 via-white to-mint-50/40 relative">
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

      <button @click="openDemoModal" class="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2">
        <span>🚀 Coba Mode Demo (Tanpa Akun)</span>
      </button>
    </div>

    <!-- Modal Input Nama, Jenjang & Tingkatan Demo -->
    <Teleport to="body">
      <div v-if="showDemoModal" @click.self="showDemoModal = false"
        class="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div class="screen-enter w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-lg font-extrabold text-slate-900">Mulai Mode Demo</h3>
            <button type="button" @click="showDemoModal = false" class="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          <p class="text-xs text-slate-500">Sesuaikan nama, jenjang, dan tingkatan materi latihanmu:</p>
          <form @submit.prevent="confirmDemoMode" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Panggilan</label>
              <input v-model="demoName" type="text" spellcheck="false" placeholder="Contoh: Budi / Sania" autofocus required
                class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none text-sm" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Jenjang</label>
              <div class="grid grid-cols-4 gap-2">
                <button v-for="j in ['SMP', 'SMA', 'SMK', 'Umum']" :key="j" type="button" @click="demoEducation = j"
                  :class="demoEducation === j ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-600 border-slate-200'"
                  class="py-2 rounded-xl border text-xs font-bold transition-all">
                  {{ j }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Tingkatan</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="lvl in ['Pemula', 'Menengah', 'Tinggi']" :key="lvl" type="button" @click="demoLevel = lvl"
                  :class="demoLevel === lvl ? 'bg-mint-600 text-white border-mint-600' : 'bg-slate-50 text-slate-600 border-slate-200'"
                  class="py-2 rounded-xl border text-xs font-bold transition-all">
                  {{ lvl }}
                </button>
              </div>
            </div>

            <button type="submit" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
              Masuk ke Beranda
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </section>
</template>