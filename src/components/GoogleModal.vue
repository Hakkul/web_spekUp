<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();
const statusMessage = ref('');
const jenjangOptions = ['SMA', 'SMK', 'SMP', 'Umum'];

const closeModal = () => {
  store.googleModal.isOpen = false;
  store.googleModal.step = 'picker';
};

const isLinked = (cand) => {
  return store.accounts.some(
    acc => acc.googleLinked && (
      acc.email.toLowerCase() === cand.email.toLowerCase() ||
      acc.googleEmail?.toLowerCase() === cand.email.toLowerCase()
    )
  );
};

const selectCandidate = (cand) => {
  store.googleModal.selectedCandidate = cand;
  const existing = store.accounts.find(
    acc => acc.googleLinked && (
      acc.email.toLowerCase() === cand.email.toLowerCase() ||
      acc.googleEmail?.toLowerCase() === cand.email.toLowerCase()
    )
  );

  if (existing) {
    Object.assign(store.user, existing, {
      provider: 'google',
      googleLinked: true,
      googleEmail: cand.email
    });
    store.googleModal.step = 'linking-existing';
    statusMessage.value = `Menautkan sesi & memverifikasi akun Google (${cand.email})...`;

    setTimeout(() => {
      if (!store.googleModal.isOpen) return;
      closeModal();
      store.showToast(`Akun Google terhubung • Selamat datang, ${store.user.name}!`, 'success');
      router.push('/home');
    }, 850);
  } else {
    store.googleModal.step = 'link-new';
    store.googleModal.pendingName = cand.name;
    store.googleModal.pendingEmail = cand.email;
    store.googleModal.pendingEducation = 'SMA';
  }
};

const submitCustomGoogle = () => {
  const name = store.googleModal.pendingName.trim();
  const email = store.googleModal.pendingEmail.trim().toLowerCase();
  if (!name || !email) return;

  const candidate = {
    name,
    email,
    googleSub: 'google-oauth2|' + Date.now(),
    avatarColor: 'from-emerald-500 to-teal-600'
  };
  if (!store.googleCandidates.some(c => c.email === email)) {
    store.googleCandidates.push(candidate);
  }
  selectCandidate(candidate);
};

const confirmCreateAccount = () => {
  const fullName = store.googleModal.pendingName.trim();
  const email = store.googleModal.pendingEmail;
  if (!fullName) return;

  const newAcc = {
    id: 'acc-' + Date.now(),
    name: fullName,
    email,
    provider: 'google',
    googleLinked: true,
    googleEmail: email,
    education: store.googleModal.pendingEducation || 'SMA',
    level: 'Pemula',
    streak: 1,
    newWords: 0,
    weeklyProgress: 15,
    reminderTime: '19:00',
    micPermission: false,
    privacyAgreed: false,
    parentalAgreed: false
  };

  const idx = store.accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
  if (idx >= 0) store.accounts[idx] = { ...store.accounts[idx], ...newAcc };
  else store.accounts.push(newAcc);

  Object.assign(store.user, newAcc);
  closeModal();
  store.showToast(`Akun SpeakUp ditautkan ke ${email}. Lengkapi persetujuan & level!`, 'success');
  router.push('/onboarding/consent');
};
</script>

<template>
  <div v-if="store.googleModal.isOpen" @click.self="closeModal"
    class="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="screen-enter w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">

      <!-- Verifikasi Akun Terhubung -->
      <div v-if="store.googleModal.step === 'linking-existing'" class="py-5 text-center space-y-3">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-mint-50 border border-mint-200 flex items-center justify-center">
          <div class="w-7 h-7 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-100 text-mint-700 text-xs font-bold">
          ✓ Akun Google terhubung
        </span>
        <h3 class="font-display text-lg font-extrabold text-slate-900">{{ store.googleModal.selectedCandidate?.name }}</h3>
        <p class="text-xs text-slate-500">{{ store.googleModal.selectedCandidate?.email }}</p>
        <p class="text-xs font-medium text-brand-600 pt-1">{{ statusMessage }}</p>
      </div>

      <!-- Form Akun Google Lain -->
      <div v-else-if="store.googleModal.step === 'custom-google'" class="space-y-4">
        <div class="flex items-center justify-between">
          <button type="button" @click="store.googleModal.step = 'picker'" class="text-xs font-bold text-slate-500 hover:text-slate-800">
            ← Kembali ke pilihan akun
          </button>
          <button type="button" @click="closeModal" class="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div>
          <h3 class="font-display text-lg font-extrabold text-slate-900">Gunakan Akun Google Lain</h3>
          <p class="text-xs text-slate-500 mt-0.5">Masukkan identitas Google untuk menautkan atau membuat akun SpeakUp</p>
        </div>
        <form @submit.prevent="submitCustomGoogle" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama di Akun Google</label>
            <input v-model="store.googleModal.pendingName" type="text" placeholder="Contoh: Dimas Saputra" required
              class="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-brand-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Alamat Email Google</label>
            <input v-model="store.googleModal.pendingEmail" type="email" placeholder="contoh@gmail.com" required
              class="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-brand-500" />
          </div>
          <button type="submit" class="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
            Lanjutkan dengan Google
          </button>
        </form>
      </div>

      <!-- Buat & Tautkan Akun Baru -->
      <div v-else-if="store.googleModal.step === 'link-new'" class="space-y-4">
        <div class="flex items-center justify-between">
          <button type="button" @click="store.googleModal.step = 'picker'" class="text-xs font-bold text-slate-500 hover:text-slate-800">
            ← Ganti Akun Google
          </button>
          <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Akun Google Baru</span>
        </div>

        <div class="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-display font-extrabold flex items-center justify-center text-base shrink-0">
            {{ (store.googleModal.selectedCandidate?.name || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-extrabold text-slate-900 truncate">{{ store.googleModal.pendingEmail }}</p>
            <p class="text-[11px] text-brand-700 font-medium mt-0.5">Belum terhubung ke SpeakUp • Buat profil & tautkan Google</p>
          </div>
        </div>

        <form @submit.prevent="confirmCreateAccount" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama lengkap di SpeakUp</label>
            <input v-model="store.googleModal.pendingName" type="text" required
              class="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-brand-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Jenjang</label>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="j in jenjangOptions" :key="j" type="button" @click="store.googleModal.pendingEducation = j"
                :class="store.googleModal.pendingEducation === j ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'"
                class="py-2 rounded-xl border text-xs font-bold transition-all">
                {{ j }}
              </button>
            </div>
          </div>
          <button type="submit" class="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all">
            Buat Akun & Tautkan Google
          </button>
        </form>
      </div>

      <!-- Picker Utama -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"/>
            </svg>
            <h3 class="font-display text-base font-extrabold text-slate-900">Pilih Akun Google</h3>
          </div>
          <button type="button" @click="closeModal" class="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600">✕</button>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed">
          Pilih akun Google untuk menautkan atau membuat akun <strong>SpeakUp</strong>:
        </p>

        <div class="space-y-2.5">
          <button v-for="cand in store.googleCandidates" :key="cand.email" type="button" @click="selectCandidate(cand)"
            class="w-full p-3 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 transition-all flex items-center justify-between gap-3 text-left">
            <div class="flex items-center gap-3 min-w-0">
              <div :class="cand.avatarColor" class="w-10 h-10 rounded-full bg-gradient-to-br text-white font-display font-bold flex items-center justify-center text-sm shrink-0">
                {{ cand.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-900 truncate">{{ cand.name }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ cand.email }}</p>
              </div>
            </div>
            <span :class="isLinked(cand) ? 'bg-mint-100 text-mint-700' : 'bg-brand-50 text-brand-700 border border-brand-200'"
              class="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0">
              {{ isLinked(cand) ? 'Terhubung' : 'Buat & Tautkan' }}
            </span>
          </button>
        </div>

        <button type="button" @click="store.googleModal.step = 'custom-google'; store.googleModal.pendingName = ''; store.googleModal.pendingEmail = '';"
          class="w-full py-3 rounded-2xl border border-dashed border-slate-300 hover:border-brand-500 text-xs font-bold text-slate-700 hover:text-brand-700 flex items-center justify-center gap-2 transition-all">
          <span>+ Gunakan / Tambah Akun Google Lain</span>
        </button>
      </div>

    </div>
  </div>
</template>