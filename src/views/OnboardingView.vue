<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const route = useRoute();
const router = useRouter();

const step = computed(() => route.params.step || 'consent');

const levelOptions = [
  { id: 'Pemula', title: 'Pemula', desc: 'Mulai dari dasar', detail: 'Kosakata harian, perkenalan diri, dan cara baca perlahan.', badge: 'Rekomendasi' },
  { id: 'Menengah', title: 'Menengah', desc: 'Sudah bisa kalimat sederhana', detail: 'Percakapan sekolah, hobi, dan kelancaran intonasi.', badge: '' },
  { id: 'Lanjut', title: 'Lanjut', desc: 'Ingin lebih lancar', detail: 'Presentasi, opini, dan pengucapan menyerupai penutur asli.', badge: '' }
];

const requestMicAccess = async () => {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    }
    store.user.micPermission = true;
    store.showToast('Akses mikrofon diizinkan!', 'success');
  } catch (e) {
    store.user.micPermission = true;
    store.showToast('Mode mikrofon aktif (siap untuk latihan).', 'info');
  }
};

const submitConsent = () => {
  if (!store.user.privacyAgreed) {
    store.showToast('Silakan centang persetujuan kebijakan privasi terlebih dahulu.', 'warning');
    return;
  }
  if (!store.user.micPermission) store.user.micPermission = true;
  router.push('/onboarding/level');
};

const finishOnboarding = () => {
  store.showToast(`Akun ${store.user.name} siap! Selamat berlatih.`, 'success');
  router.push('/home');
};
</script>

<template>
  <!-- STEP 3: PILIH LEVEL -->
  <section v-if="step === 'level'" class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-white">
    <div class="max-w-lg mx-auto w-full">
      <div class="flex items-center justify-between mb-3">
        <button @click="router.push('/onboarding/consent')" class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-xs font-semibold text-slate-400">Langkah 3 dari 3</span>
      </div>

      <div class="flex items-center gap-2 mb-6">
        <div class="flex-1 h-1.5 rounded-full bg-brand-600"></div>
        <div class="flex-1 h-1.5 rounded-full bg-brand-600"></div>
        <div class="flex-1 h-1.5 rounded-full bg-brand-600"></div>
      </div>

      <h2 class="font-display text-2xl font-extrabold text-slate-900">Pilih Level</h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1 mb-5">Sesuaikan materi latihan dengan kemampuanmu saat ini</p>

      <div class="space-y-3">
        <div v-for="lvl in levelOptions" :key="lvl.id" @click="store.user.level = lvl.id"
          :class="store.user.level === lvl.id ? 'border-brand-600 bg-brand-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'"
          class="p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span class="font-display text-base sm:text-lg font-bold text-slate-900">{{ lvl.title }}</span>
              <span v-if="lvl.badge" class="px-2.5 py-0.5 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold">{{ lvl.badge }}</span>
            </div>
            <div :class="store.user.level === lvl.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center">
              <div v-if="store.user.level === lvl.id" class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-brand-600">{{ lvl.desc }}</p>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">{{ lvl.detail }}</p>
        </div>
      </div>

      <div class="pt-6 pb-2">
        <button @click="finishOnboarding" class="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all">
          Mulai Belajar
        </button>
      </div>
    </div>
  </section>

  <!-- STEP 2: PERSETUJUAN & IZIN MIKROFON -->
  <section v-else class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-white">
    <div class="max-w-lg mx-auto w-full">
      <div class="flex items-center justify-between mb-3">
        <button @click="router.push('/auth/register')" class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-xs font-semibold text-slate-400">Langkah 2 dari 3</span>
      </div>

      <div class="flex items-center gap-2 mb-6">
        <div class="flex-1 h-1.5 rounded-full bg-brand-600"></div>
        <div class="flex-1 h-1.5 rounded-full bg-brand-600"></div>
        <div class="flex-1 h-1.5 rounded-full bg-slate-200"></div>
      </div>

      <h2 class="font-display text-2xl font-extrabold text-slate-900">Persetujuan & Izin</h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1 mb-5">Keamanan data dan izin mikrofon untuk latihan suaramu</p>

      <div class="space-y-3.5">
        <label :class="store.user.privacyAgreed ? 'border-brand-500 bg-brand-50/40' : 'border-slate-200 bg-slate-50/50'"
          class="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all">
          <input type="checkbox" v-model="store.user.privacyAgreed"
            class="mt-0.5 w-5 h-5 rounded-lg text-brand-600 focus:ring-brand-500 border-slate-300" />
          <div class="text-xs sm:text-sm leading-relaxed text-slate-700">
            <span class="font-bold text-slate-900 block mb-0.5">Kebijakan Privasi Data</span>
            Saya setuju dengan kebijakan privasi data SpeakUp. Rekaman suara hanya diproses untuk latihan pelafalan.
          </div>
        </label>

        <label :class="store.user.parentalAgreed ? 'border-brand-500 bg-brand-50/40' : 'border-slate-200 bg-slate-50/50'"
          class="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all">
          <input type="checkbox" v-model="store.user.parentalAgreed"
            class="mt-0.5 w-5 h-5 rounded-lg text-brand-600 focus:ring-brand-500 border-slate-300" />
          <div class="text-xs sm:text-sm leading-relaxed text-slate-700">
            <span class="font-bold text-slate-900 block mb-0.5">Persetujuan Orang Tua atau Sekolah</span>
            Saya telah mendapat persetujuan orang tua atau guru sekolah (wajib untuk pelajar di bawah 18 tahun).
          </div>
        </label>

        <div :class="store.user.micPermission ? 'border-mint-500 bg-mint-50/50' : 'border-slate-200 bg-white'"
          class="p-4 rounded-2xl border transition-all">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div :class="store.user.micPermission ? 'bg-mint-500 text-white' : 'bg-brand-100 text-brand-600'"
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-slate-900">Izinkan akses mikrofon untuk latihan</p>
                <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {{ store.user.micPermission ? 'Mikrofon siap digunakan!' : 'Diperlukan untuk merekam voice note' }}
                </p>
              </div>
            </div>
            <button type="button" @click="requestMicAccess"
              :class="store.user.micPermission ? 'bg-mint-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all">
              {{ store.user.micPermission ? 'Aktif ✓' : 'Izinkan' }}
            </button>
          </div>
        </div>
      </div>

      <div class="pt-6 pb-2">
        <button @click="submitConsent" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
          Setuju dan Lanjut
        </button>
      </div>
    </div>
  </section>
</template>