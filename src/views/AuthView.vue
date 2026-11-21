<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../stores/appStore';
import AppLogo from '../components/AppLogo.vue';
const showDemoModal = ref(false);
const demoName = ref('');

const route = useRoute();
const router = useRouter();

const mode = computed(() => route.params.mode || 'login');
const jenjangOptions = ['SMA', 'SMK', 'SMP', 'Umum'];

const loginIdentifier = ref('');
const loginPassword = ref('');
const forgotContact = ref('');
const regPassword = ref('');

const openGoogleModal = () => {
  store.googleModal.isOpen = true;
  store.googleModal.step = 'picker';
};

const loginAsDemo = () => {
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

const openDemoModal = () => {
  demoName.value = '';
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
    education: 'SMA',
    level: 'Pemula',
    streak: 0,
    newWords: 0,
    weeklyProgress: 0,
    micPermission: true,
    privacyAgreed: true,
    parentalAgreed: true
  });
  showDemoModal.value = false;
  store.showToast(`Halo ${finalName}! Masuk dalam Mode Demo.`, 'info');
  router.push('/home');
};

const handleLogin = () => {
  const idVal = loginIdentifier.value.trim().toLowerCase();
  if (!idVal) return;

  const matched = store.accounts.find(a => a.email.toLowerCase() === idVal);
  if (matched) {
    Object.assign(store.user, matched);
    store.showToast(`Selamat datang kembali, ${store.user.name}!`, 'success');
    router.push('/home');
    return;
  }

  const rawName = idVal.includes('@') ? idVal.split('@')[0].split(/[._-]/)[0] : 'Pelajar';
  const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Pelajar';
  const newAcc = {
    id: 'acc-' + Date.now(),
    name: formattedName,
    email: idVal,
    provider: 'email',
    googleLinked: false,
    googleEmail: '',
    education: 'SMA',
    level: 'Pemula',
    streak: 1,
    newWords: 0,
    weeklyProgress: 10,
    reminderTime: '19:00',
    micPermission: false,
    privacyAgreed: false,
    parentalAgreed: false
  };
  store.accounts.push(newAcc);
  Object.assign(store.user, newAcc);
  store.showToast(`Akun ${store.user.email} dibuat. Lengkapi persetujuan & level!`, 'success');
  router.push('/onboarding/consent');
};

const handleForgotPassword = () => {
  store.showToast(`Tautan atur ulang sandi terkirim ke ${forgotContact.value}`, 'success');
  setTimeout(() => router.push('/auth/login'), 1100);
};

const handleRegister = () => {
  const emailVal = store.user.email.trim().toLowerCase();
  const accountData = {
    ...store.user,
    id: store.user.id || ('acc-' + Date.now()),
    name: store.user.name.trim() || 'Sania',
    email: emailVal
  };
  const idx = store.accounts.findIndex(a => a.email.toLowerCase() === emailVal);
  if (idx >= 0) store.accounts[idx] = accountData;
  else store.accounts.push(accountData);

  Object.assign(store.user, accountData);
  store.showToast(`Profil ${store.user.name} tersimpan! Lanjut ke persetujuan.`, 'success');
  router.push('/onboarding/consent');
};
</script>

<template>
  <!-- MODE: FORGOT PASSWORD -->
  <section v-if="mode === 'forgot'" class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-white">
    <div class="max-w-md mx-auto w-full">
      <button @click="router.push('/auth/login')" class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="mt-6 mb-6">
        <div class="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="font-display text-2xl font-extrabold text-slate-900">Lupa Sandi</h2>
        <p class="text-sm text-slate-600 mt-2 leading-relaxed">
          Kami kirim tautan atur ulang ke kontakmu. Masukkan email atau nomor HP yang terdaftar.
        </p>
      </div>

      <form @submit.prevent="handleForgotPassword" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email atau Nomor HP</label>
          <input v-model="forgotContact" type="text" placeholder="Contoh: sania@email.com / 0812..." required
            class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all" />
        </div>
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
          Kirim Tautan
        </button>
      </form>
    </div>

    <div class="pb-4 text-center">
      <button @click="router.push('/auth/login')" class="text-xs font-semibold text-slate-500 hover:text-brand-600">
        Kembali ke halaman Masuk
      </button>
    </div>
  </section>

  <!-- MODE: REGISTER (STEP 1/3) -->
  <section v-else-if="mode === 'register'" class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-white">
    <div class="max-w-md mx-auto w-full">
      <div class="flex items-center justify-between mb-3">
        <button @click="router.push('/auth/login')" class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-xs font-semibold text-slate-400">Langkah 1 dari 3</span>
      </div>

      <div class="flex items-center gap-2 mb-6">
        <div class="flex-1 h-1.5 rounded-full bg-brand-600"></div>
        <div class="flex-1 h-1.5 rounded-full bg-slate-200"></div>
        <div class="flex-1 h-1.5 rounded-full bg-slate-200"></div>
      </div>

      <h2 class="font-display text-2xl font-extrabold text-slate-900">Buat Akun</h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1 mb-5">Lengkapi data dirimu untuk memulai perjalanan speaking</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama lengkap</label>
          <input v-model="store.user.name" type="text" placeholder="Contoh: Sania" required
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-brand-500 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
          <input v-model="store.user.email" type="email" placeholder="nama@email.com" required
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-brand-500 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Kata sandi</label>
          <input v-model="regPassword" type="password" placeholder="Minimal 6 karakter" required
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-brand-500 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-2">Jenjang</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button v-for="j in jenjangOptions" :key="j" type="button" @click="store.user.education = j"
              :class="store.user.education === j ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
              class="py-3 px-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between">
              <span>{{ j }}</span>
              <span :class="store.user.education === j ? 'border-brand-600 bg-brand-600' : 'border-slate-300'"
                class="w-4 h-4 rounded-full border flex items-center justify-center">
                <span v-if="store.user.education === j" class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            </button>
          </div>
        </div>
        <div class="pt-3">
          <button type="submit" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
            Lanjut
          </button>
        </div>
      </form>
    </div>
  </section>

  <!-- MODE: LOGIN (DEFAULT) -->
  <section v-else class="screen-enter flex-1 flex flex-col justify-between p-6 sm:p-10 bg-white">
    <div class="max-w-md mx-auto w-full">
      <button @click="router.push('/')" class="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex flex-col items-center text-center mt-2 mb-6">
        <AppLogo size="w-16 h-16 mb-3" />
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">Masuk</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Lanjutkan progres latihan bicaramu hari ini</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email atau Nomor HP</label>
          <input v-model="loginIdentifier" type="text" placeholder="Email atau Nomor HP" required
            class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-semibold text-slate-700">Kata sandi</label>
            <button type="button" @click="router.push('/auth/forgot')" class="text-xs font-semibold text-brand-600 hover:underline">
              Lupa kata sandi?
            </button>
          </div>
          <input v-model="loginPassword" type="password" placeholder="Kata sandi" required
            class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm transition-all" />
        </div>

        <button type="submit" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
          Masuk
        </button>
      </form>

      <div class="relative my-5 flex items-center justify-center">
        <div class="border-t border-slate-200 w-full"></div>
        <span class="bg-white px-3 text-xs font-medium text-slate-400">atau</span>
        <div class="border-t border-slate-200 w-full"></div>
      </div>

      <div class="space-y-2.5">
        <button type="button" @click="openGoogleModal" class="w-full py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
            <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z"/>
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"/>
          </svg>
          <span>Masuk dengan Google</span>
        </button>

        <!-- Modal Input Nama Demo -->
<Teleport to="body">
  <div v-if="showDemoModal" @click.self="showDemoModal = false"
    class="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-4">
    <div class="screen-enter w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-display text-lg font-extrabold text-slate-900">Mulai Mode Demo</h3>
        <button type="button" @click="showDemoModal = false" class="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">✕</button>
      </div>
      <p class="text-xs text-slate-500">Masukkan nama panggilanmu agar tampil di beranda latihan:</p>
      <form @submit.prevent="confirmDemoMode" class="space-y-4">
        <input v-model="demoName" type="text" spellcheck="false" placeholder="Contoh: Budi / Sania" autofocus required
          class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none text-sm" />
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
          Masuk ke Beranda
        </button>
      </form>
    </div>
  </div>
</Teleport>
      </div>
    </div>

    <div class="pt-6 pb-2 text-center">
      <p class="text-xs sm:text-sm text-slate-600">
        Belum punya akun?
        <button @click="router.push('/auth/register')" class="font-bold text-brand-600 hover:underline ml-1">Daftar</button>
      </p>
    </div>
  </section>
</template>