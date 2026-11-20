<script setup>
import { useRouter } from 'vue-router';
import { store } from '../stores/appStore';

const router = useRouter();

const openGoogleModal = () => {
  store.googleModal.isOpen = true;
  store.googleModal.step = 'picker';
};

const unlinkGoogle = () => {
  const prevEmail = store.user.googleEmail || store.user.email;
  store.user.googleLinked = false;
  store.user.provider = 'email';
  store.user.googleEmail = '';
  const idx = store.accounts.findIndex(a => a.email === store.user.email);
  if (idx >= 0) {
    store.accounts[idx].googleLinked = false;
    store.accounts[idx].provider = 'email';
    store.accounts[idx].googleEmail = '';
  }
  store.showToast(`Tautan akun Google (${prevEmail}) dilepas.`, 'info');
};
</script>

<template>
  <section class="screen-enter p-5 sm:p-8 space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900">Profil Pelajar</h1>
      <button @click="router.push('/closing/summary')" class="text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-2 rounded-xl">
        Tutup Sesi
      </button>
    </div>

    <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white font-display text-2xl font-extrabold flex items-center justify-center shrink-0">
        {{ store.user.name.charAt(0).toUpperCase() }}
      </div>
      <div class="min-w-0 flex-1">
        <h2 class="font-display text-lg sm:text-xl font-extrabold text-slate-900 truncate">{{ store.user.name }}</h2>
        <p class="text-xs sm:text-sm text-slate-500 truncate">{{ store.user.email || 'Belum ada email' }}</p>
        <div class="flex flex-wrap items-center gap-1.5 mt-2">
          <span class="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">{{ store.user.education }}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-mint-50 text-mint-700 text-xs font-bold">Level {{ store.user.level }}</span>
          <span :class="store.user.googleLinked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
            class="px-2.5 py-0.5 rounded-full text-xs font-bold">
            {{ store.user.googleLinked ? 'Google Linked' : 'Email / HP' }}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Status Tautan Akun</span>
        <span :class="store.user.googleLinked ? 'text-mint-600' : 'text-amber-600'" class="text-xs font-bold">
          {{ store.user.googleLinked ? '● Akun Google terhubung' : '○ Belum terhubung Google' }}
        </span>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
        <template v-if="store.user.googleLinked">
          Terhubung dengan identitas Google <strong>{{ store.user.googleEmail || store.user.email }}</strong>.
        </template>
        <template v-else>
          Hubungkan atau ganti akun Google agar progres belajarmu tertaut dengan identitas Google.
        </template>
      </p>

      <div class="flex flex-wrap gap-2 pt-1">
        <button type="button" @click="openGoogleModal"
          class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all">
          {{ store.user.googleLinked ? 'Ganti Akun Google' : 'Hubungkan Akun Google' }}
        </button>
        <button v-if="store.user.googleLinked" type="button" @click="unlinkGoogle"
          class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all">
          Lepas Tautan
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-5 rounded-3xl border border-slate-200/80 text-center">
        <span class="text-2xl">🔥</span>
        <p class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{{ store.user.streak }} Hari</p>
        <p class="text-xs text-slate-500">Streak Aktif</p>
      </div>
      <div class="bg-white p-5 rounded-3xl border border-slate-200/80 text-center">
        <span class="text-2xl">📚</span>
        <p class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{{ store.user.newWords }} Kata</p>
        <p class="text-xs text-slate-500">Kosakata Baru</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-5 border border-slate-200/80">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm sm:text-base font-bold text-slate-800">Pengingat Latihan Harian</p>
          <p class="text-xs text-slate-500">Notifikasi rutin agar tidak lupa latihan</p>
        </div>
        <input type="time" v-model="store.user.reminderTime" @change="store.showToast('Pengingat harian diatur ke pukul ' + store.user.reminderTime, 'success')"
          class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-brand-700 bg-brand-50" />
      </div>
    </div>

    <button @click="router.push('/auth/login')" class="w-full py-3.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all">
      Ganti / Keluar Akun
    </button>
  </section>
</template>